package data

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var ErrDuplicateEmail = errors.New("email address already exists")

type Patient struct {
	Id        uuid.UUID `bson:"_id"       json:"id"`
	Email     string    `bson:"email"     json:"email"`
	FirstName string    `bson:"firstName" json:"firstName"`
	LastName  string    `bson:"lastName"  json:"lastName"`
}

func (m *MongoDb) CreatePatient(ctx context.Context, patient Patient) (Patient, error) {
	collection := m.Database.Collection(patientsCollection)
	patient.Id = uuid.New()

	_, err := collection.InsertOne(ctx, patient)
	if err != nil {
		var writeErr mongo.WriteException
		if errors.As(err, &writeErr) {
			for _, we := range writeErr.WriteErrors {
				if we.Code == 11000 {
					return Patient{}, ErrDuplicateEmail
				}
			}
		}
		return Patient{}, fmt.Errorf("CreatePatient: failed to insert document: %w", err)
	}

	return patient, nil
}
