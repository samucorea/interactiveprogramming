package models

type Diagram struct {
	Uid          string `json:"uid,omitempty"`
	Name         string `json:"name,omitempty"`
	ExportedJson string `json:"exported_json,omitempty"`
	DType        string `json:"dgraph.type,omitempty"`
}
