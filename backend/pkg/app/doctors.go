package app

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func (a monolithApp) CreateDoctor(
	ctx context.Context,
	d api.DoctorRegistration,
) (api.Doctor, error) {
	doctor := doctorRegToDataDoctor(d)
	doctor, err := a.db.CreateDoctor(ctx, doctor)
	if errors.Is(err, data.ErrDuplicateEmail) {
		return api.Doctor{}, fmt.Errorf("CreateDoctor duplicate emall: %w", ErrDuplicateEmail)
	} else if err != nil {
		return api.Doctor{}, fmt.Errorf("CreateDoctor: %w", err)
	}

	return dataDoctorToApiDoctor(doctor), nil
}

func (a monolithApp) DoctorById(ctx context.Context, id uuid.UUID) (api.Doctor, error) {
	doctor, err := a.db.DoctorById(ctx, id)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Doctor{}, fmt.Errorf("DoctorById: %w", ErrNotFound)
		}
		return api.Doctor{}, fmt.Errorf("DoctorById: %w", err)
	}

	return dataDoctorToApiDoctor(doctor), nil
}

func (a monolithApp) DoctorByEmail(ctx context.Context, email string) (api.Doctor, error) {
	doctor, err := a.db.DoctorByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, data.ErrNotFound) {
			return api.Doctor{}, fmt.Errorf("DoctorByEmail: %w", ErrNotFound)
		}
		return api.Doctor{}, fmt.Errorf("DoctorByEmail: %w", err)
	}

	return dataDoctorToApiDoctor(doctor), nil
}
