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

type Medicine struct {
	Id        uuid.UUID  `bson:"_id"           json:"id"`
	PatientId uuid.UUID  `bson:"patientId"     json:"patientId"` // Reference to Patient._id
	Name      string     `bson:"name"          json:"name"`
	Start     time.Time  `bson:"start"         json:"start"`
	End       *time.Time `bson:"end,omitempty" json:"end,omitempty"`
}

func (m *MongoDb) CreateMedicine(ctx context.Context, medicine Medicine) (Medicine, error) {
	if err := m.patientExists(ctx, medicine.PatientId); err != nil {
		return Medicine{}, fmt.Errorf("CreateMedicine patient check error: %w", err)
	}

	collection := m.Database.Collection(medicinesCollection)
	medicine.Id = uuid.New()

	_, err := collection.InsertOne(ctx, medicine)
	if err != nil {
		return Medicine{}, fmt.Errorf("CreateMedicine: failed to insert document: %w", err)
	}

	return medicine, nil
}

func (m *MongoDb) MedicineById(ctx context.Context, id uuid.UUID) (Medicine, error) {
	collection := m.Database.Collection(medicinesCollection)
	filter := bson.M{"_id": id}
	var medicine Medicine

	err := collection.FindOne(ctx, filter).Decode(&medicine)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return Medicine{}, ErrNotFound
		}
		return Medicine{}, fmt.Errorf("MedicineById: failed to find document: %w", err)
	}

	return medicine, nil
}

func (m *MongoDb) FindMedicinesByPatientId(
	ctx context.Context,
	patientId uuid.UUID,
	from time.Time,
	to *time.Time,
	page int,
	pageSize int,
) ([]Medicine, PaginationResult, error) {
	collection := m.Database.Collection(medicinesCollection)
	medicines := make([]Medicine, 0)
	pagination := PaginationResult{Page: page}

	filter := bson.M{"patientId": patientId}
	dateFilter := bson.M{}
	dateFilter["$gte"] = from
	if to != nil {
		dateFilter["$lt"] = *to
	}
	filter["start"] = dateFilter

	totalCount, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		// don't wrap ErrNoDocuments as an error here, count 0 is valid
		if !errors.Is(err, mongo.ErrNoDocuments) {
			return nil, PaginationResult{}, fmt.Errorf(
				"FindMedicinesByPatientId: count failed: %w",
				err,
			)
		}
		// If ErrNoDocuments, totalCount will be 0, which is correct
	}
	pagination.Total = totalCount

	if totalCount == 0 {
		pagination.PageSize = 0
		return medicines, pagination, nil
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
			return medicines, pagination, nil
		}
		return nil, PaginationResult{}, fmt.Errorf(
			"FindMedicinesByPatientId: find failed: %w",
			err,
		)
	}

	defer func() {
		if cerr := cursor.Close(ctx); cerr != nil {
			slog.Warn("Failed to close medicine cursor", "error", cerr.Error())
		}
	}()

	if err = cursor.All(ctx, &medicines); err != nil {
		slog.Error("Failed to decode documents from cursor", "error", err)
		return nil, PaginationResult{}, fmt.Errorf(
			"FindMedicinesByPatientId: decode failed: %w",
			err,
		)
	}

	if err = cursor.Err(); err != nil {
		slog.Error("Medicine cursor iteration error", "error", err)
		return nil, PaginationResult{}, fmt.Errorf(
			"FindMedicinesByPatientId: cursor error: %w",
			err,
		)
	}

	pagination.PageSize = len(medicines)
	return medicines, pagination, nil
}
