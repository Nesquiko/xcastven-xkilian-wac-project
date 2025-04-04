package data

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Doctor struct {
	Id             uuid.UUID `bson:"_id"            json:"id"`
	Email          string    `bson:"email"          json:"email"`
	FirstName      string    `bson:"firstName"      json:"firstName"`
	LastName       string    `bson:"lastName"       json:"lastName"`
	Specialization string    `bson:"specialization" json:"specialization"`
}

func (m *MongoDb) CreateDoctor(ctx context.Context, doctor Doctor) (Doctor, error) {
	collection := m.Database.Collection(doctorsCollection)
	doctor.Id = uuid.New()

	_, err := collection.InsertOne(ctx, doctor)
	if err != nil {
		var writeErr mongo.WriteException
		if errors.As(err, &writeErr) {
			for _, we := range writeErr.WriteErrors {
				if we.Code == 11000 {
					return Doctor{}, ErrDuplicateEmail
				}
			}
		}
		return Doctor{}, fmt.Errorf("CreateDoctor: failed to insert document: %w", err)
	}

	return doctor, nil
}
