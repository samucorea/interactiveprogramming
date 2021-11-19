package databases

import (
	"context"
	"log"

	"github.com/dgraph-io/dgo/v2"
	"github.com/dgraph-io/dgo/v2/protos/api"
	"google.golang.org/grpc"
)

type Db struct {
	dGraphClient *dgo.Dgraph
}

var DgraphClient Db

func NewClient(conn *grpc.ClientConn) *Db {
	db := new(Db)
	db.dGraphClient = dgo.NewDgraphClient(api.NewDgraphClient(conn))

	return db
}

func (rs Db) Insert(json []byte, ctx context.Context) (*api.Response, error) {
	txn := rs.dGraphClient.NewTxn()
	defer txn.Commit(ctx)

	mu := &api.Mutation{
		SetJson: json,
	}

	res, err := txn.Mutate(ctx, mu)

	return res, err

}

func (rs Db) GetAll(ctx context.Context) (*api.Response, error) {
	txn := rs.dGraphClient.NewTxn()
	defer txn.Commit(ctx)

	query := `{
		find_diagrams(func: has(exportedjson))
		{
			  uid,
			  name,
		  	  exportedjson,
		}
	  }
	  `

	res, err := txn.Query(ctx, query)

	if err != nil {
		log.Println(err)
	}

	return res, err

}

func (rs Db) GetById(uid string, ctx context.Context) (*api.Response, error) {
	txn := rs.dGraphClient.NewTxn()
	defer txn.Commit(ctx)

	q := `query getById($uid: string) {
		getById(func: uid($uid)) {
		  uid,
		  name,
		  exportedjson
		}
	  }`

	res, err := txn.QueryWithVars(ctx, q, map[string]string{"$uid": uid})

	if err != nil {
		log.Println(err)
	}

	return res, err
}

func (rs Db) Delete(json []byte, ctx context.Context) (*api.Response, error) {
	txn := rs.dGraphClient.NewTxn()
	defer txn.Commit(ctx)

	mu := &api.Mutation{
		DeleteJson: json,
	}

	res, err := txn.Mutate(ctx, mu)

	return res, err
}
