package data

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
type ResourceType string

const (
	ResourceTypeMedicine  ResourceType = "medicine"
	ResourceTypeFacility  ResourceType = "facility"
	ResourceTypeEquipment ResourceType = "equipment"
)

type Resource struct {
	Id   uuid.UUID    `bson:"id"   json:"id"`
	Name string       `bson:"name" json:"name"`
	Type ResourceType `bson:"type" json:"type"`
}

func (m *MongoDb) CreateResource(
	ctx context.Context,
	name string,
	typ ResourceType,
) (Resource, error) {
	collection := m.Database.Collection(resourcesCollection)

	resource := Resource{
		Id:   uuid.New(),
		Name: name,
		Type: typ,
	}

	_, err := collection.InsertOne(ctx, resource)
	if err != nil {
		return Resource{}, fmt.Errorf(
			"CreateResource creating %q failed to insert document: %w",
			typ,
			err,
		)
	}

	return resource, nil
}

