package app

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

var (
	ErrDuplicateEmail = errors.New("email address already exists")
	ErrNotFound       = errors.New("resource not found")
)

type App interface {
	CreatePatient(ctx context.Context, p api.PatientRegistration) (api.Patient, error)
	PatientById(ctx context.Context, id uuid.UUID) (api.Patient, error)
	PatientByEmail(ctx context.Context, email string) (api.Patient, error)
	PatientsCalendar(patientId api.PatientId, params api.PatientsCalendarParams)

	CreateDoctor(ctx context.Context, d api.DoctorRegistration) (api.Doctor, error)
	DoctorById(ctx context.Context, id uuid.UUID) (api.Doctor, error)
	DoctorByEmail(ctx context.Context, email string) (api.Doctor, error)

	CreatePatientCondition(ctx context.Context, cond api.NewCondition) (api.ConditionDisplay, error)

	CreatePatientMedicine(ctx context.Context, cond api.NewMedicine) (api.MedicineDisplay, error)
}

func New(db data.Db) App {
	return monolithApp{db}
}

type monolithApp struct {
	db data.Db
}
