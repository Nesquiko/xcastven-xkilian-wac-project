package app

import (
	"context"
	"errors"
	"fmt"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func New(db data.Db) App {
	return App{db}
}

type App struct {
	db data.Db
}

var ErrDuplicateEmail = errors.New("email address already exists")

func (a App) CreatePatient(ctx context.Context, p api.Patient) (api.Patient, error) {
	patient := apiPatientToDataPatient(p)

	patient, err := a.db.CreatePatient(ctx, patient)
	if errors.Is(err, data.ErrDuplicateEmail) {
		return api.Patient{}, fmt.Errorf("CreatePatient duplicate emall: %w", ErrDuplicateEmail)
	} else if err != nil {
		return api.Patient{}, fmt.Errorf("CreatePatient: %w", err)
	}

	return dataPatientToApiPatient(patient), nil
}
