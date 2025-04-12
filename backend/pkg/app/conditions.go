package app

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
)

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

func (a monolithApp) ConditionById(ctx context.Context, id uuid.UUID) (api.Condition, error) {
	cond, err := a.db.ConditionById(ctx, id)
	if err != nil {
		return api.Condition{}, fmt.Errorf("ConditionById: %w", err)
	}

	appts, err := a.db.AppointmentsByConditionId(ctx, cond.Id)
	if err != nil {
		return api.Condition{}, fmt.Errorf("ConditionById find appts: %w", err)
	}

	patient, err := a.db.PatientById(ctx, cond.PatientId)
	if err != nil {
		return api.Condition{}, fmt.Errorf("ConditionById find patient: %w", err)
	}

	appointments := make([]api.AppointmentDisplay, len(appts))
	for i, appt := range appts {
		doc, err := a.db.DoctorById(ctx, appt.DoctorId)
		if err != nil {
			return api.Condition{}, fmt.Errorf("ConditionById find doctor: %w", err)
		}
		appointments[i] = dataApptToApptDisplay(appt, patient, doc)
	}

	return dataCondToCond(cond, appointments), nil
}
