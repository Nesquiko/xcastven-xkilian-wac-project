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

func (a monolithApp) CreatePatientPrescription(
	ctx context.Context,
	pres api.NewPrescription,
) (api.Prescription, error) {
	prescription, err := a.db.CreatePrescription(ctx, newPrescToDataPresc(pres))
	if err != nil {
		return api.Prescription{}, fmt.Errorf("CreatePatientPrescription: %w", err)
	}

	var appt *data.Appointment = nil
	var patient *data.Patient = nil
	var doctor *data.Doctor = nil

	if pres.AppointmentId != nil {
		appointment, err := a.db.AppointmentById(ctx, *pres.AppointmentId)
		if err != nil {
			return api.Prescription{}, fmt.Errorf("CreatePatientPrescription appt find: %w", err)
		}
		p, err := a.db.PatientById(ctx, appointment.PatientId)
		if err != nil {
			return api.Prescription{}, fmt.Errorf("CreatePatientPrescription patient find: %w", err)
		}
		patient = &p

		d, err := a.db.DoctorById(ctx, appointment.DoctorId)
		if err != nil {
			return api.Prescription{}, fmt.Errorf("CreatePatientPrescription doc find: %w", err)
		}
		doctor = &d
	}

	return dataPrescToPresc(prescription, appt, patient, doctor), nil
}
