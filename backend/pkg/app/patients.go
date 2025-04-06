package app

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func (a monolithApp) CreatePatient(
	ctx context.Context,
	p api.PatientRegistration,
) (api.Patient, error) {
	patient := patientRegToDataPatient(p)

	patient, err := a.db.CreatePatient(ctx, patient)
	if errors.Is(err, data.ErrDuplicateEmail) {
		return api.Patient{}, fmt.Errorf("CreatePatient duplicate emall: %w", ErrDuplicateEmail)
	} else if err != nil {
		return api.Patient{}, fmt.Errorf("CreatePatient: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}

func (a monolithApp) PatientById(ctx context.Context, id uuid.UUID) (api.Patient, error) {
	patient, err := a.db.PatientById(ctx, id)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Patient{}, fmt.Errorf("PatientById: %w", ErrNotFound)
		}
		return api.Patient{}, fmt.Errorf("PatientById: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}

func (a monolithApp) PatientByEmail(ctx context.Context, email string) (api.Patient, error) {
	patient, err := a.db.PatientByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Patient{}, fmt.Errorf("PatientByEmail: %w", ErrNotFound)
		}
		return api.Patient{}, fmt.Errorf("PatientByEmail: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}

func (a monolithApp) PatientsCalendar(patientId api.PatientId, params api.PatientsCalendarParams) {
	panic("unimplemented")
}

func (a monolithApp) CreatePatientCondition(
	ctx context.Context,
	c api.NewCondition,
) (api.ConditionDisplay, error) {
	cond, err := a.db.CreateCondition(ctx, newCondToDataCond(c))
	if err != nil {
		return api.ConditionDisplay{}, fmt.Errorf("CreatePatientCondition: %w", err)
	}
	return dataCondToCondDisplay(cond), nil
}

func (a monolithApp) CreatePatientMedicine(
	ctx context.Context,
	m api.NewMedicine,
) (api.MedicineDisplay, error) {
	med, err := a.db.CreateMedicine(ctx, newMedToDataMed(m))
	if err != nil {
		return api.MedicineDisplay{}, fmt.Errorf("CreatePatientMedicine: %w", err)
	}
	return dataMedToMedDisplay(med), nil
}
