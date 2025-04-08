package data

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Prescription struct {
	Id          uuid.UUID `bson:"_id"                   json:"id"`
	PatientId   uuid.UUID `bson:"patientId"             json:"patientId"` // Reference to Patient._id
	Name        string    `bson:"name"                  json:"name"`
	Start       time.Time `bson:"start"                 json:"start"`
	End         time.Time `bson:"end"                   json:"end"`
	DoctorsNote *string   `bson:"doctorsNote,omitempty" json:"doctorsNote,omitempty"`
}

func (m *MongoDb) CreatePrescription(
	ctx context.Context,
	prescription Prescription,
) (Prescription, error) {
	if err := m.patientExists(ctx, prescription.PatientId); err != nil {
		return Prescription{}, fmt.Errorf("CreatePrescription patient check error: %w", err)
	}

	collection := m.Database.Collection(prescriptionsCollection)
	prescription.Id = uuid.New()

	_, err := collection.InsertOne(ctx, prescription)
	if err != nil {
		return Prescription{}, fmt.Errorf("CreatePrescription failed to insert document: %w", err)
	}

	return prescription, nil
}

func (m *MongoDb) PrescriptionById(ctx context.Context, id uuid.UUID) (Prescription, error) {
	collection := m.Database.Collection(prescriptionsCollection)
	filter := bson.M{"_id": id}
	var prescription Prescription

	err := collection.FindOne(ctx, filter).Decode(&prescription)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return Prescription{}, ErrNotFound
		}
		return Prescription{}, fmt.Errorf("PrescriptionById failed to find document: %w", err)
	}

	return prescription, nil
}

func (m *MongoDb) FindPrescriptionsByPatientId(
	ctx context.Context,
	patientId uuid.UUID,
	from time.Time,
	to *time.Time,
	page int,
	pageSize int,
) ([]Prescription, PaginationResult, error) {
	collection := m.Database.Collection(prescriptionsCollection)
	prescriptions := make([]Prescription, 0)
	pagination := PaginationResult{Page: page}

	filter := bson.M{
		"patientId": patientId,
		"end":       bson.M{"$gte": from},
	}
	if to != nil {
		filter["start"] = bson.M{"$lte": *to}
	}

	totalCount, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		// don't wrap ErrNoDocuments as an error here, count 0 is valid
		if !errors.Is(err, mongo.ErrNoDocuments) {
			return nil, PaginationResult{}, fmt.Errorf(
				"FindPrescriptionsByPatientId count failed: %w",
				err,
			)
		}
		// If ErrNoDocuments, totalCount will be 0, which is correct
	}
	pagination.Total = totalCount

	if totalCount == 0 {
		pagination.PageSize = 0
		return prescriptions, pagination, nil
	}

	limit := int64(pageSize)
	offset := int64(page) * limit
	findOptions := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "start", Value: 1}})

	cursor, err := collection.Find(ctx, filter, findOptions)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			pagination.PageSize = 0
			return prescriptions, pagination, nil
		}
		return nil, PaginationResult{}, fmt.Errorf(
			"FindPrescriptionsByPatientId find failed: %w",
			err,
		)
	}

	defer func() {
		if cerr := cursor.Close(ctx); cerr != nil {
			slog.Warn("Failed to close prescriptions cursor", "error", cerr.Error())
		}
	}()

	if err = cursor.All(ctx, &prescriptions); err != nil {
		slog.Error("Failed to decode documents from cursor", "error", err)
		return nil, PaginationResult{}, fmt.Errorf(
			"FindPrescriptionsByPatientId decode failed: %w",
			err,
		)
	}

	if err = cursor.Err(); err != nil {
		slog.Error("Prescriptions cursor iteration error", "error", err)
		return nil, PaginationResult{}, fmt.Errorf(
			"FindPrescriptionsByPatientId cursor error: %w",
			err,
		)
	}

	pagination.PageSize = len(prescriptions)
	return prescriptions, pagination, nil
}
