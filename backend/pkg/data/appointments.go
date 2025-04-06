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
)

type Appointment struct {
	Id                  uuid.UUID `bson:"_id"                 json:"id"`
	PatientId           uuid.UUID `bson:"patientId"           json:"patientId"` // Reference to Patient._id
	DoctorId            uuid.UUID `bson:"doctorId"            json:"doctorId"`  // Reference to Doctor._id
	AppointmentDateTime time.Time `bson:"appointmentDateTime" json:"appointmentDateTime"`
	EndTime             time.Time `bson:"endTime"             json:"endTime"`

	Type        string     `bson:"type"                  json:"type"`
	Status      string     `bson:"status"                json:"status"`
	Reason      *string    `bson:"reason,omitempty"      json:"reason,omitempty"`
	ConditionId *uuid.UUID `bson:"conditionId,omitempty" json:"conditionId,omitempty"`

	CancellationReason *string `bson:"cancellationReason,omitempty" json:"cancellationReason,omitempty"`

	Medicines  []Resource `bson:"medicines,omitempty"  json:"medicines,omitempty"`
	Facilities []Resource `bson:"facilities,omitempty" json:"facilities,omitempty"`
	Equipment  []Resource `bson:"equipment,omitempty"  json:"equipment,omitempty"`
}

func (m *MongoDb) CreateAppointment(
	ctx context.Context,
	appointment Appointment,
) (Appointment, error) {
	if err := m.patientExists(ctx, appointment.PatientId); err != nil {
		return Appointment{}, fmt.Errorf("CreateAppointment patient check: %w", err)
	}

	if err := m.doctorExists(ctx, appointment.DoctorId); err != nil {
		return Appointment{}, fmt.Errorf("CreateAppointment doctor check: %w", err)
	}

	if appointment.ConditionId != nil {
		if err := m.conditionExists(ctx, *appointment.ConditionId); err != nil {
			return Appointment{}, fmt.Errorf("CreateAppointment condition check: %w", err)
		}
	}

	appointmentsColl := m.Database.Collection(appointmentsCollection)
	availabilityFilter := bson.M{
		"doctorId":            appointment.DoctorId,
		"appointmentDateTime": appointment.AppointmentDateTime,
		"status":              bson.M{"$nin": []string{"cancelled", "denied"}},
	}

	count, err := appointmentsColl.CountDocuments(ctx, availabilityFilter)
	if err != nil {
		slog.Error(
			"Failed to count doctor appointments for availability check",
			"doctorId", appointment.DoctorId,
			"dateTime", appointment.AppointmentDateTime,
			"error", err,
		)
		return Appointment{}, fmt.Errorf(
			"CreateAppointment: doctor availability check failed: %w",
			err,
		)
	}

	if count > 0 {
		slog.Warn(
			"Attempted to schedule appointment when doctor is unavailable",
			"doctorId", appointment.DoctorId,
			"dateTime", appointment.AppointmentDateTime,
		)
		return Appointment{}, fmt.Errorf(
			"%w at %s",
			ErrDoctorUnavailable,
			appointment.AppointmentDateTime.Format(time.RFC3339),
		)
	}

	appointment.Id = uuid.New()
	_, err = appointmentsColl.InsertOne(ctx, appointment)
	if err != nil {
		return Appointment{}, fmt.Errorf("CreateAppointment: failed to insert document: %w", err)
	}

	return appointment, nil
}

func (m *MongoDb) AppointmentById(ctx context.Context, id uuid.UUID) (Appointment, error) {
	appointmentsColl := m.Database.Collection(appointmentsCollection)
	filter := bson.M{"_id": id}

	var appt Appointment

	err := appointmentsColl.FindOne(ctx, filter).Decode(&appt)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return Appointment{}, ErrNotFound
		}
		return Appointment{}, fmt.Errorf("AppointmentById failed to find document: %w", err)
	}

	return appt, nil
}

func (m *MongoDb) appointmentExists(ctx context.Context, id uuid.UUID) error {
	appointmentsColl := m.Database.Collection(appointmentsCollection)
	filter := bson.M{"_id": id}

	count, err := appointmentsColl.CountDocuments(ctx, filter)
	if err != nil {
		return fmt.Errorf("appointmentExists: failed patient count check: %w", err)
	}
	if count == 0 {
		return ErrNotFound
	}

	return nil
}
