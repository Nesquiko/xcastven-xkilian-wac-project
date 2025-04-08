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
	CancelAppointment(ctx context.Context, appointmentId uuid.UUID, reason *string) error
	PatientsAppointmentById(
		ctx context.Context,
		patientId uuid.UUID,
		appointmentId uuid.UUID,
	) (api.PatientAppointment, error)
	DoctorsAppointmentById(
		ctx context.Context,
		doctorId uuid.UUID,
		appointmentId uuid.UUID,
	) (api.DoctorAppointment, error)
	DecideAppointment(
		ctx context.Context,
		appointmentId uuid.UUID,
		decision api.AppointmentDecision,
	) (api.DoctorAppointment, error)
	DoctorTimeSlots(
		ctx context.Context,
		doctorId uuid.UUID,
		date time.Time,
	) (api.DoctorTimeslots, error)

	CreatePatient(ctx context.Context, p api.PatientRegistration) (api.Patient, error)
	PatientById(ctx context.Context, id uuid.UUID) (api.Patient, error)
	PatientByEmail(ctx context.Context, email string) (api.Patient, error)
	PatientsCalendar(
		ctx context.Context,
		patientId uuid.UUID,
		from api.From,
		to *api.To,
	) (api.PatientsCalendar, error)

	CreateDoctor(ctx context.Context, d api.DoctorRegistration) (api.Doctor, error)
	DoctorById(ctx context.Context, id uuid.UUID) (api.Doctor, error)
	DoctorByEmail(ctx context.Context, email string) (api.Doctor, error)
	DoctorsCalendar(
		ctx context.Context,
		doctorId uuid.UUID,
		from api.From,
		to *api.To,
	) (api.DoctorCalendar, error)

	CreatePatientCondition(ctx context.Context, cond api.NewCondition) (api.ConditionDisplay, error)
	ConditionById(ctx context.Context, id uuid.UUID) (api.ConditionDisplay, error)

	CreatePatientPrescription(
		ctx context.Context,
		pres api.NewPrescription,
	) (api.Prescription, error)

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
