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

type Condition struct {
	Id        uuid.UUID  `bson:"_id"           json:"id"`
	PatientId uuid.UUID  `bson:"patientId"     json:"patientId"` // Reference to Patient._id
	Name      string     `bson:"name"          json:"name"`
	Start     time.Time  `bson:"start"         json:"start"`
	End       *time.Time `bson:"end,omitempty" json:"end,omitempty"`
}

func (m *MongoDb) CreateCondition(ctx context.Context, condition Condition) (Condition, error) {
	if err := m.patientExists(ctx, condition.PatientId); err != nil {
		return Condition{}, fmt.Errorf("CreateCondition patient check error: %w", err)
	}

	collection := m.Database.Collection(conditionsCollection)
	condition.Id = uuid.New()

	_, err := collection.InsertOne(ctx, condition)
	if err != nil {
		return Condition{}, fmt.Errorf("CreateCondition: failed to insert document: %w", err)
	}

	return condition, nil
}

func (m *MongoDb) ConditionById(ctx context.Context, id uuid.UUID) (Condition, error) {
	collection := m.Database.Collection(conditionsCollection)
	filter := bson.M{"_id": id}
	var condition Condition

	err := collection.FindOne(ctx, filter).Decode(&condition)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return Condition{}, ErrNotFound
		}
		return Condition{}, fmt.Errorf("ConditionById: failed to find document: %w", err)
	}

	return condition, nil
}

func (m *MongoDb) FindConditionsByPatientId(
	ctx context.Context,
	patientId uuid.UUID,
	from time.Time,
	to *time.Time,
	page int,
	pageSize int,
) ([]Condition, PaginationResult, error) {
	collection := m.Database.Collection(conditionsCollection)
	conditions := make([]Condition, 0)
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
				"FindConditionsByPatientId: count failed: %w",
				err,
			)
		}
		// If ErrNoDocuments, totalCount will be 0, which is correct
	}
	pagination.Total = totalCount

	if totalCount == 0 {
		pagination.PageSize = 0
		return conditions, pagination, nil
	}

	limit := int64(pageSize)
	offset := int64(page) * limit
	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "start", Value: 1}})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			pagination.PageSize = 0
			return conditions, pagination, nil
		}
		return nil, PaginationResult{}, fmt.Errorf(
			"FindConditionsByPatientId: find failed: %w",
			err,
		)
	}

	defer func() {
		if cerr := cursor.Close(ctx); cerr != nil {
			slog.Warn("Failed to close cursor", "error", cerr.Error())
		}
	}()

	if err = cursor.All(ctx, &conditions); err != nil {
		slog.Error("Failed to decode documents from cursor", "error", err)
		return nil, PaginationResult{}, fmt.Errorf(
			"FindConditionsByPatientId: decode failed: %w",
			err,
		)
	}

	if err = cursor.Err(); err != nil {
		slog.Error("Cursor iteration error", "error", err)
		return nil, PaginationResult{}, fmt.Errorf(
			"FindConditionsByPatientIdPaginated: cursor error: %w",
			err,
		)
	}

	pagination.PageSize = len(conditions)
	return conditions, pagination, nil
}
