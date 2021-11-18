package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"google.golang.org/grpc"

	"github.com/go-chi/chi/middleware"
)

var db Db

func main() {
	port := "9000"

	if fromEnv := os.Getenv("PORT"); fromEnv != "" {
		port = fromEnv
	}

	log.Printf("Listening on port %s", port)

	conn, err := grpc.Dial("localhost:9080", grpc.WithInsecure())

	if err != nil {
		log.Fatal(err)
	}

	db = *newClient(conn)

	defer conn.Close()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Mount("/diagrams", diagramsResource{}.Routes(conn))

	log.Fatal(http.ListenAndServe(":"+port, r))
}
