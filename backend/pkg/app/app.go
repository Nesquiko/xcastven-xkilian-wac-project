package app

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

var (
	ErrDuplicateEmail = errors.New("email address already exists")
	ErrNotFound       = errors.New("resource not found")
)

type App interface {
	CreateAppointment(
		ctx context.Context,
		appt api.NewAppointmentRequest,
	) (api.PatientAppointment, error)

	CreatePatient(ctx context.Context, p api.PatientRegistration) (api.Patient, error)
	PatientById(ctx context.Context, id uuid.UUID) (api.Patient, error)
	PatientByEmail(ctx context.Context, email string) (api.Patient, error)
	PatientsCalendar(patientId api.PatientId, params api.PatientsCalendarParams)

	CreateDoctor(ctx context.Context, d api.DoctorRegistration) (api.Doctor, error)
	DoctorById(ctx context.Context, id uuid.UUID) (api.Doctor, error)
	DoctorByEmail(ctx context.Context, email string) (api.Doctor, error)

	CreatePatientCondition(ctx context.Context, cond api.NewCondition) (api.ConditionDisplay, error)
	ConditionById(ctx context.Context, id uuid.UUID) (api.ConditionDisplay, error)

	CreatePatientMedicine(ctx context.Context, cond api.NewMedicine) (api.MedicineDisplay, error)

	CreateResource(ctx context.Context, resource api.NewResource) (api.NewResource, error)
	ReserveResource(
		ctx context.Context,
		resourceId uuid.UUID,
		reservation api.ResourceReservation,
	) error
	AvailableResources(ctx context.Context, dateTime time.Time) (api.AvailableResources, error)
}

func New(db data.Db) App {
	return monolithApp{db}
}

type monolithApp struct {
	db data.Db
}
