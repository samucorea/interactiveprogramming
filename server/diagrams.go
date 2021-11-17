package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os/exec"

	"log"
	"net/http"
	"os"

	"github.com/dgraph-io/dgo/v2"
	"github.com/dgraph-io/dgo/v2/protos/api"
	"github.com/go-chi/chi"
	"google.golang.org/grpc"
)

var dgraphClient *dgo.Dgraph

type Diagram struct {
	Uid          string `json:"uid,omitempty"`
	ExportedJson string `json:"exportedjson,omitempty"`
	DType        string `json:"dgraph.type,omitempty"`
}

type diagramsResource struct{}

func (rs diagramsResource) Routes(conn *grpc.ClientConn) chi.Router {

	dgraphClient = dgo.NewDgraphClient(api.NewDgraphClient(conn))

	r := chi.NewRouter()

	r.Get("/", rs.List)
	r.Post("/", rs.Create)
	r.Post("/execute", rs.Execute)

	return r
}

func (rs diagramsResource) List(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello get all"))
}

func (rs diagramsResource) Create(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	txn := dgraphClient.NewTxn()
	defer txn.Commit(r.Context())

	var d Diagram

	err := json.NewDecoder(r.Body).Decode(&d)

	if err != nil {
		log.Fatal(err)
	}

	pb, err := json.Marshal(d)

	if err != nil {
		log.Fatal(err)
	}

	mu := &api.Mutation{
		SetJson: pb,
	}

	res, err := txn.Mutate(r.Context(), mu)

	if err != nil {
		log.Fatal(err)
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
	w.Write([]byte(string(out)))

}
