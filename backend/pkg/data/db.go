package data

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

var (
	ErrDuplicateEmail = errors.New("email address already exists")
	ErrNotFound       = errors.New("resource not found")
)

type Db interface {
	Disconnect(ctx context.Context) error

	CreatePatient(ctx context.Context, patient Patient) (Patient, error)
	PatientById(ctx context.Context, id uuid.UUID) (Patient, error)
	PatientByEmail(ctx context.Context, email string) (Patient, error)

	CreateDoctor(ctx context.Context, doctor Doctor) (Doctor, error)
	DoctorById(ctx context.Context, id uuid.UUID) (Doctor, error)
	DoctorByEmail(ctx context.Context, email string) (Doctor, error)
}
