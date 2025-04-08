package app

import (
	"context"
	"errors"
	"fmt"
	"time"

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

func (a monolithApp) PatientsCalendar(
	ctx context.Context,
	patientId uuid.UUID,
	from api.From,
	to *api.To,
) (api.PatientsCalendar, error) {
	var toTime *time.Time = nil
	if to != nil {
		toTime = &to.Time
	}

	appts, err := a.db.AppointmentsByPatientId(ctx, patientId, from.Time, toTime)
	if err != nil {
		return api.PatientsCalendar{}, fmt.Errorf("PatientsCalendar appointments: %w", err)
	}

	conds, err := a.db.FindConditionsByPatientId(ctx, patientId, from.Time, toTime)
	if err != nil {
		return api.PatientsCalendar{}, fmt.Errorf("PatientsCalendar conditions: %w", err)
	}

	prescriptions, err := a.db.FindPrescriptionsByPatientId(ctx, patientId, from.Time, toTime)
	if err != nil {
		return api.PatientsCalendar{}, fmt.Errorf("PatientsCalendar prescriptions: %w", err)
	}

	calendar := api.PatientsCalendar{}
	var doctor *data.Doctor = nil
	if len(appts) != 0 {
		calendar.Appointments = asPtr(make([]api.AppointmentDisplay, len(appts)))

		d, err := a.db.DoctorById(ctx, appts[0].DoctorId)
		if err != nil {
			return api.PatientsCalendar{}, fmt.Errorf("PatientsCalendar doc find: %w", err)
		}
		doctor = &d
	}

	if len(conds) != 0 {
		calendar.Conditions = asPtr(make([]api.ConditionDisplay, len(conds)))
	}
	if len(prescriptions) != 0 {
		calendar.Prescriptions = asPtr(make([]api.PrescriptionDisplay, len(prescriptions)))
	}

	for i, appt := range appts {
		patient, err := a.db.PatientById(ctx, appt.PatientId)
		if err != nil {
			return api.PatientsCalendar{}, fmt.Errorf("PatientsCalendar patient find: %w", err)
		}
		(*calendar.Appointments)[i] = dataApptToApptDisplay(appt, patient, *doctor)
	}

	for i, cond := range conds {
		(*calendar.Conditions)[i] = dataCondToCondDisplay(cond)
	}

	for i, presc := range prescriptions {
		(*calendar.Prescriptions)[i] = dataPrescToPrescDisplay(presc)
	}

	return calendar, nil
}
