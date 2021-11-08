package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"

	"github.com/go-chi/chi/middleware"
)

func main() {
	port := "8080"

	if fromEnv := os.Getenv("PORT"); fromEnv != "" {
		port = fromEnv
	}

	log.Printf("Listening on port %s", port)

	r := chi.NewRouter()

	r.Use(middleware.Logger)

	r.Get("/", func(rw http.ResponseWriter, r *http.Request) {

		rw.Write([]byte("Hello world"))
	})

	fmt.Println("Listening at port 8000...")
	http.ListenAndServe(":8000", r)
}
