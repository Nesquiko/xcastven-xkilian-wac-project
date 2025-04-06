package data

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrDuplicateEmail      = errors.New("email address already exists")
	ErrNotFound            = errors.New("resource not found")
	ErrDoctorUnavailable   = errors.New("doctor unavailable at the specified time")
	ErrResourceUnavailable = errors.New("resource is unavailable during the requested time slot")
)

type Db interface {
	Disconnect(ctx context.Context) error

	CreateAppointment(ctx context.Context, appointment Appointment) (Appointment, error)
	AppointmentById(ctx context.Context, id uuid.UUID) (Appointment, error)

	CreatePatient(ctx context.Context, patient Patient) (Patient, error)
	PatientById(ctx context.Context, id uuid.UUID) (Patient, error)
	PatientByEmail(ctx context.Context, email string) (Patient, error)

	CreateDoctor(ctx context.Context, doctor Doctor) (Doctor, error)
	DoctorById(ctx context.Context, id uuid.UUID) (Doctor, error)
	DoctorByEmail(ctx context.Context, email string) (Doctor, error)

	CreateCondition(ctx context.Context, condition Condition) (Condition, error)
	ConditionById(ctx context.Context, id uuid.UUID) (Condition, error)
	FindConditionsByPatientId(
		ctx context.Context,
		patientId uuid.UUID,
		from time.Time,
		to *time.Time,
		page int,
		pageSize int,
	) ([]Condition, PaginationResult, error)

	CreateMedicine(ctx context.Context, medicine Medicine) (Medicine, error)
	MedicineById(ctx context.Context, id uuid.UUID) (Medicine, error)
	FindMedicinesByPatientId(
		ctx context.Context,
		patientId uuid.UUID,
		from time.Time,
		to *time.Time,
		page int,
		pageSize int,
	) ([]Medicine, PaginationResult, error)

	CreateResource(ctx context.Context, name string, typ ResourceType) (Resource, error)
	ResourceById(ctx context.Context, id uuid.UUID) (Resource, error)
	FindAvailableResourcesAtTime(
		ctx context.Context,
		appointmentDate time.Time,
	) (struct {
		Medicines  []Resource
		Facilities []Resource
		Equipment  []Resource
	}, error)
	CreateReservation(
		ctx context.Context,
		appointmentId uuid.UUID,
		resourceId uuid.UUID,
		resourceType ResourceType,
		startTime time.Time,
		endTime time.Time,
	) (Reservation, error)
}

type PaginationResult struct {
	Total    int64
	Page     int
	PageSize int
}
