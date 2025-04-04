package data

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoDb struct {
	*mongo.Database
}

var _ Db = (*MongoDb)(nil)

func ConnectMongo(ctx context.Context, uri string, db string) (*MongoDb, error) {
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return nil, fmt.Errorf("ConnectMongo: %w", err)
	}

	pingCtx, pingCancel := context.WithTimeout(ctx, 5*time.Second)
	defer pingCancel()

	err = client.Ping(pingCtx, nil)
	if err != nil {
		_ = client.Disconnect(ctx)
		return nil, fmt.Errorf("ConnectMongo: failed to ping mongo server: %w", err)
	}

	mongoDb := client.Database(db)
	return &MongoDb{Database: mongoDb}, nil
}

func (m *MongoDb) Disconnect(ctx context.Context) error {
	return m.Database.Client().Disconnect(ctx)
}
