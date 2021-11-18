package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os/exec"

	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"google.golang.org/grpc"
)

type Diagram struct {
	Uid          string `json:"uid,omitempty"`
	Name         string `json:"name,omitempty"`
	ExportedJson string `json:"exportedjson,omitempty"`
	DType        string `json:"dgraph.type,omitempty"`
}

type diagramsResource struct{}

func (rs diagramsResource) Routes(conn *grpc.ClientConn) chi.Router {

	r := chi.NewRouter()

	r.Get("/", rs.List)
	r.Post("/", rs.Create)
	r.Put("/", rs.Create)
	r.Post("/execute", rs.Execute)

	r.Route("/{uid}", func(r chi.Router) {
		r.Use(DiagramCtx)
		r.Get("/", rs.Get)
	})

	return r
}

func DiagramCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "uid", chi.URLParam(r, "uid"))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (rs diagramsResource) List(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	allDiagrams := db.getAll(r.Context())

	w.Write(allDiagrams)
}

func (rs diagramsResource) Create(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var d Diagram

	err := json.NewDecoder(r.Body).Decode(&d)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println(err)
	}

	pb, _ := json.Marshal(d)

	res, err := db.insert(pb, r.Context())

	if err != nil {
		log.Println(err)
	}

	json, _ := json.Marshal(res)
	w.Write(json)
}

func (rs diagramsResource) Execute(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")

	buf := new(bytes.Buffer)

	buf.ReadFrom(r.Body)

	codeToExecute := buf.String()

	file, e := os.Create("temp.py")

	if e != nil {
		log.Fatal(e)
	}
	fmt.Fprintln(file, codeToExecute)
	file.Close()

	cmd := exec.Command("python", "temp.py")
	out, cmdErr := cmd.CombinedOutput()

	if cmdErr != nil {
		log.Print(cmdErr)
	}
	w.Write(out)

}

func (rs diagramsResource) Get(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("uid").(string)

	w.Header().Set("Content-Type", "application/json")

	diagram := db.getById(id, r.Context())

	w.Write(diagram)

}
