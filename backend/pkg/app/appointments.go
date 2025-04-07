package app

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

// CreateAppointment implements App.
func (a monolithApp) CreateAppointment(
	ctx context.Context,
	appt api.NewAppointmentRequest,
) (api.PatientAppointment, error) {
	appointment, err := a.db.CreateAppointment(ctx, newApptToDataAppt(appt))
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("CreateAppointment create appointment: %w", err)
	}

	doc, err := a.db.DoctorById(ctx, appointment.DoctorId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("CreateAppointment find doctor: %w", err)
	}

	var cond *data.Condition = nil
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.PatientAppointment{}, fmt.Errorf("CreateAppointment find condition: %w", err)
		}
		cond = &c
	}

	return dataApptToPatientAppt(appointment, doc, cond), nil
}

func (a monolithApp) CancelAppointment(
	ctx context.Context,
	appointmentId uuid.UUID,
	reason *string,
) error {
	err := a.db.CancelAppointment(ctx, appointmentId, reason)
	if err != nil {
		return fmt.Errorf("CancelAppointment: %w", err)
	}
	return nil
}

func (a monolithApp) PatientsAppointmentById(
	ctx context.Context,
	patientId uuid.UUID,
	appointmentId uuid.UUID,
) (api.PatientAppointment, error) {
	appointment, err := a.db.AppointmentById(ctx, appointmentId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("PatientsAppointmentById: %w", err)
	}

	doc, err := a.db.DoctorById(ctx, appointment.DoctorId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("PatientsAppointmentById find doctor: %w", err)
	}

	var cond *data.Condition
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.PatientAppointment{}, fmt.Errorf(
				"PatientsAppointmentById find condition: %w",
				err,
			)
		}
		cond = &c
	}

	return dataApptToPatientAppt(appointment, doc, cond), nil
}

func (a monolithApp) DoctorsAppointmentById(
	ctx context.Context,
	doctorId uuid.UUID,
	appointmentId uuid.UUID,
) (api.DoctorAppointment, error) {
	appointment, err := a.db.AppointmentById(ctx, appointmentId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf("DoctorsAppointmentById: %w", err)
	}

	patient, err := a.db.PatientById(ctx, appointment.PatientId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf("DoctorsAppointmentById find patient: %w", err)
	}

	var cond *data.Condition
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.DoctorAppointment{}, fmt.Errorf(
				"DoctorsAppointmentById find condition: %w",
				err,
			)
		}
		cond = &c
	}

	resources, err := a.db.ResourcesByAppointmentId(ctx, appointmentId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf(
			"DoctorsAppointmentById fetch reservations: %w",
			err,
		)
	}

	var facilities, equipment, medicine []data.Resource
	for _, resource := range resources {
		switch resource.Type {
		case data.ResourceTypeFacility:
			facilities = append(facilities, resource)
		case data.ResourceTypeEquipment:
			equipment = append(equipment, resource)
		case data.ResourceTypeMedicine:
			medicine = append(medicine, resource)
		}
	}

	return dataApptToDoctorAppt(appointment, patient, cond, facilities, equipment, medicine), nil
}
