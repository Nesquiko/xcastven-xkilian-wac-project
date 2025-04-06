package app

import (
	"context"
	"fmt"

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
