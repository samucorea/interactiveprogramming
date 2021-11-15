package main

import (
	"net/http"

	"github.com/go-chi/chi"
)

type diagramsResource struct{}

func (rs diagramsResource) Routes() chi.Router {

	r := chi.NewRouter()

	r.Get("/", rs.List)

	return r
}

func (rs diagramsResource) List(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("List all diagrams"))
}
