package data

import (
	"context"
)

type Db interface {
	Disconnect(ctx context.Context) error

	CreatePatient(ctx context.Context, patient Patient) (Patient, error)
	CreateDoctor(ctx context.Context, doctor Doctor) (Doctor, error)
}
