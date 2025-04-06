package data

import (
	"context"
	"fmt"
	"log/slog"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoDb struct {
	*mongo.Database
}

var _ Db = (*MongoDb)(nil)

const (
	patientsCollection   = "patients"
	doctorsCollection    = "doctors"
	conditionsCollection = "conditions"
	medicinesCollection  = "medicine"
)

var Collections = []string{
	patientsCollection,
	doctorsCollection,
	conditionsCollection,
	medicinesCollection,
}

func ConnectMongo(ctx context.Context, uri string, db string) (*MongoDb, error) {
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return nil, fmt.Errorf("ConnectMongo: %w", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		_ = client.Disconnect(ctx)
		return nil, fmt.Errorf("ConnectMongo: failed to ping mongo server: %w", err)
	}

	mongoDb := client.Database(db)
	err = initCollections(ctx, mongoDb, Collections)
	if err != nil {
		_ = client.Disconnect(ctx)
		return nil, fmt.Errorf("ConnectMongo: failed to init collections: %w", err)
	}

	err = initIndexes(ctx, mongoDb)
	if err != nil {
		_ = client.Disconnect(ctx)
		return nil, fmt.Errorf("ConnectMongo: failed to init indexes: %w", err)
	}

	return &MongoDb{Database: mongoDb}, nil
}

func initCollections(ctx context.Context, mongoDb *mongo.Database, cols []string) error {
	if len(cols) == 0 {
		return nil
	}

	for _, collName := range cols {
		slog.Info("creating collection", "collection", collName)
		err := mongoDb.CreateCollection(ctx, collName)
		if err != nil {
			return fmt.Errorf(
				"initCollections: failed to create collection '%s': %w",
				collName,
				err,
			)
		}
	}

	return nil
}

func initIndexes(ctx context.Context, mongoDb *mongo.Database) error {
	indexes := map[string]mongo.IndexModel{
		patientsCollection: {
			Keys:    bson.M{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		doctorsCollection: {
			Keys:    bson.M{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		conditionsCollection: {
			Keys: bson.M{"patientId": 1},
		},
		medicinesCollection: {
			Keys: bson.M{"patientId": 1},
		},
	}

	for collName, indexModel := range indexes {
		coll := mongoDb.Collection(collName)
		indexName, err := coll.Indexes().CreateOne(ctx, indexModel)
		if err != nil {
			slog.Warn(
				"Could not create index (may already exist with different options or other issue)",
				slog.String("collection", collName),
				slog.Any("keys", indexModel.Keys),
				slog.String("error", err.Error()),
				slog.String("indexName", indexName),
			)
		}
	}
	return nil
}

func (m *MongoDb) Disconnect(ctx context.Context) error {
	return m.Database.Client().Disconnect(ctx)
}
