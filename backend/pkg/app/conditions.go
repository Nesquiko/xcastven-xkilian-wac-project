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

func (a monolithApp) ConditionById(
	ctx context.Context,
	id uuid.UUID,
) (api.ConditionDisplay, error) {
	cond, err := a.db.ConditionById(ctx, id)
	if err != nil {
		return api.ConditionDisplay{}, fmt.Errorf("ConditionById: %w", err)
	}
	return dataCondToCondDisplay(cond), nil
}
