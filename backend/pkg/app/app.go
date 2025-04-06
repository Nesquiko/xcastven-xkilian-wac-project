package app

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func New(db data.Db) App {
	return App{db}
}

type App struct {
	db data.Db
}

var (
	ErrDuplicateEmail = errors.New("email address already exists")
	ErrNotFound       = errors.New("resource not found")
)

func (a App) CreatePatient(ctx context.Context, p api.PatientRegistration) (api.Patient, error) {
	patient := patientRegToDataPatient(p)

	patient, err := a.db.CreatePatient(ctx, patient)
	if errors.Is(err, data.ErrDuplicateEmail) {
		return api.Patient{}, fmt.Errorf("CreatePatient duplicate emall: %w", ErrDuplicateEmail)
	} else if err != nil {
		return api.Patient{}, fmt.Errorf("CreatePatient: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}

func (a App) CreateDoctor(ctx context.Context, d api.DoctorRegistration) (api.Doctor, error) {
	doctor := doctorRegToDataDoctor(d)
	doctor, err := a.db.CreateDoctor(ctx, doctor)
	if errors.Is(err, data.ErrDuplicateEmail) {
		return api.Doctor{}, fmt.Errorf("CreateDoctor duplicate emall: %w", ErrDuplicateEmail)
	} else if err != nil {
		return api.Doctor{}, fmt.Errorf("CreateDoctor: %w", err)
	}

	return dataDoctorToApiDoctor(doctor), nil
}

func (a App) PatientById(ctx context.Context, id uuid.UUID) (api.Patient, error) {
	patient, err := a.db.PatientById(ctx, id)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Patient{}, fmt.Errorf("PatientById: %w", ErrNotFound)
		}
		return api.Patient{}, fmt.Errorf("PatientById: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}

func (a App) DoctorById(ctx context.Context, id uuid.UUID) (api.Doctor, error) {
	doctor, err := a.db.DoctorById(ctx, id)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Doctor{}, fmt.Errorf("DoctorById: %w", ErrNotFound)
		}
		return api.Doctor{}, fmt.Errorf("DoctorById: %w", err)
	}

	return dataDoctorToApiDoctor(doctor), nil
}

func (a App) PatientByEmail(ctx context.Context, email string) (api.Patient, error) {
	patient, err := a.db.PatientByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Patient{}, fmt.Errorf("PatientByEmail: %w", ErrNotFound)
		}
		return api.Patient{}, fmt.Errorf("PatientByEmail: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}

func (a App) DoctorByEmail(ctx context.Context, email string) (api.Doctor, error) {
	doctor, err := a.db.DoctorByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Doctor{}, fmt.Errorf("DoctorByEmail: %w", ErrNotFound)
		}
		return api.Doctor{}, fmt.Errorf("DoctorByEmail: %w", err)
	}

	return dataDoctorToApiDoctor(doctor), nil
}
