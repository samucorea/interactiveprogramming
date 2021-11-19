package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os/exec"

	"net/http"
	"os"

	"github.com/go-chi/chi"

	"github.com/samucorea/interactiveprogramming/models"

	"github.com/samucorea/interactiveprogramming/databases"
)

type DiagramsResource struct{}

func (rs DiagramsResource) Routes() chi.Router {

	r := chi.NewRouter()

	r.Get("/", rs.List)
	r.Post("/", rs.Create)
	r.Put("/", rs.Create)
	r.Delete("/", rs.Delete)
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

func (rs DiagramsResource) List(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	res, err := databases.DgraphClient.GetAll(r.Context())

	if err != nil {
		respondWithError(http.StatusInternalServerError, err, w, r)
		return
	}

	w.Write(res.Json)
}

func (rs DiagramsResource) Create(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var d models.Diagram

	err := json.NewDecoder(r.Body).Decode(&d)

	if err != nil {
		respondWithError(http.StatusBadRequest, err, w, r)
		return

	}

	pb, _ := json.Marshal(d)

	res, err := databases.DgraphClient.Insert(pb, r.Context())

	if err != nil {
		respondWithError(http.StatusBadRequest, err, w, r)
		return
	}

	json, _ := json.Marshal(res)
	w.Write(json)
}

func (rs DiagramsResource) Execute(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")

	buf := new(bytes.Buffer)

	buf.ReadFrom(r.Body)

	codeToExecute := buf.String()

	file, err := os.Create("temp.py")

	if err != nil {
		respondWithError(http.StatusInternalServerError, err, w, r)
		return
	}
	fmt.Fprintln(file, codeToExecute)
	file.Close()

	cmd := exec.Command("python", "temp.py")
	out, err := cmd.CombinedOutput()

	if err != nil {
		respondWithError(http.StatusInternalServerError, err, w, r)
		return
	}
	w.Write(out)

}

func (rs DiagramsResource) Get(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("uid").(string)

	w.Header().Set("Content-Type", "application/json")

	res, err := databases.DgraphClient.GetById(id, r.Context())

	if err != nil {

		respondWithError(http.StatusBadRequest, err, w, r)
		return
	}

	w.Write(res.Json)

}

func (rs DiagramsResource) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var d models.Diagram

	err := json.NewDecoder(r.Body).Decode(&d)

	if err != nil {
		respondWithError(http.StatusBadRequest, err, w, r)
		return
	}

	pb, _ := json.Marshal(d)

	res, err := databases.DgraphClient.Delete(pb, r.Context())

	if err != nil {
		respondWithError(http.StatusInternalServerError, err, w, r)
		return
	}

	json, _ := json.Marshal(res)
	w.Write(json)
}
