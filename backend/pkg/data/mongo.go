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
	patientsCollection     = "patients"
	doctorsCollection      = "doctors"
	conditionsCollection   = "conditions"
	medicinesCollection    = "medicine"
	appointmentsCollection = "appointments"
	resourcesCollection    = "resources"
)

var Collections = []string{
	patientsCollection,
	doctorsCollection,
	conditionsCollection,
	medicinesCollection,
	appointmentsCollection,
	resourcesCollection,
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
	indexes := map[string][]mongo.IndexModel{
		patientsCollection: {
			{
				Keys:    bson.D{{Key: "email", Value: 1}},
				Options: options.Index().SetUnique(true).SetName("idx_patient_email_unique"),
			},
		},
		doctorsCollection: {
			{
				Keys:    bson.D{{Key: "email", Value: 1}},
				Options: options.Index().SetUnique(true).SetName("idx_doctor_email_unique"),
			},
		},
		conditionsCollection: {
			{
				Keys:    bson.D{{Key: "patientId", Value: 1}},
				Options: options.Index().SetName("idx_condition_patientId"),
			},
			{
				Keys:    bson.D{{Key: "patientId", Value: 1}, {Key: "start", Value: 1}},
				Options: options.Index().SetName("idx_condition_patientId_start"),
			},
		},
		medicinesCollection: {
			{
				Keys:    bson.D{{Key: "patientId", Value: 1}},
				Options: options.Index().SetName("idx_medicine_patientId"),
			},
			{
				Keys:    bson.D{{Key: "patientId", Value: 1}, {Key: "start", Value: 1}},
				Options: options.Index().SetName("idx_medicine_patientId_start"),
			},
		},
		appointmentsCollection: {
			{
				Keys:    bson.D{{Key: "status", Value: 1}},
				Options: options.Index().SetName("idx_appointment_status"),
			},
			{
				Keys:    bson.D{{Key: "appointmentDateTime", Value: 1}},
				Options: options.Index().SetName("idx_appointment_datetime"),
			},
		},
		resourcesCollection: {
			{
				Keys:    bson.D{{Key: "type", Value: 1}},
				Options: options.Index().SetName("idx_resource_type"),
			},
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
