package server

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/app"
)

// CancelAppointment implements api.ServerInterface.
func (s Server) CancelAppointment(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

// ConditionDetail implements api.ServerInterface.
func (s Server) ConditionDetail(
	w http.ResponseWriter,
	r *http.Request,
	conditionId api.ConditionId,
) {
	panic("unimplemented")
}

// DecideAppointment implements api.ServerInterface.
func (s Server) DecideAppointment(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

// DoctorsCalendar implements api.ServerInterface.
func (s Server) DoctorsCalendar(
	w http.ResponseWriter,
	r *http.Request,
	doctorId api.DoctorId,
	params api.DoctorsCalendarParams,
) {
	panic("unimplemented")
}

// DoctorsTimeslots implements api.ServerInterface.
func (s Server) DoctorsTimeslots(
	w http.ResponseWriter,
	r *http.Request,
	doctorId api.DoctorId,
	params api.DoctorsTimeslotsParams,
) {
	panic("unimplemented")
}

// GetAvailableResources implements api.ServerInterface.
func (s Server) GetAvailableResources(
	w http.ResponseWriter,
	r *http.Request,
	params api.GetAvailableResourcesParams,
) {
	resources, err := s.app.AvailableResources(r.Context(), params.DateTime)
	if err != nil {
		slog.Error(UnexpectedError, "error", err.Error(), "where", "GetAvailableResources")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusOK, resources)
}

// GetDoctorById implements api.ServerInterface.
func (s Server) GetDoctorById(w http.ResponseWriter, r *http.Request, doctorId api.DoctorId) {
	doctor, err := s.app.DoctorById(r.Context(), doctorId)
	if err != nil {
		if errors.Is(err, app.ErrNotFound) {
			apiErr := &ApiError{
				ErrorDetail: api.ErrorDetail{
					Code:   "doctor.not-found",
					Title:  "Not Found",
					Detail: fmt.Sprintf("Doctor with ID %q not found.", doctorId),
					Status: http.StatusNotFound,
				},
			}
			encodeError(w, apiErr)
			return
		}
		slog.Error(UnexpectedError, "error", err.Error(), "where", "GetDoctorById")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusOK, doctor)
}

// DoctorsAppointment implements api.ServerInterface.
func (s Server) DoctorsAppointment(
	w http.ResponseWriter,
	r *http.Request,
	doctorId api.DoctorId,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

// GetPatientById implements api.ServerInterface.
func (s Server) GetPatientById(w http.ResponseWriter, r *http.Request, patientId api.PatientId) {
	patient, err := s.app.PatientById(r.Context(), patientId)
	if err != nil {
		if errors.Is(err, app.ErrNotFound) {
			apiErr := &ApiError{
				ErrorDetail: api.ErrorDetail{
					Code:   "patient.not-found",
					Title:  "Not Found",
					Detail: fmt.Sprintf("Patient with ID %q not found.", patientId),
					Status: http.StatusNotFound,
				},
			}
			encodeError(w, apiErr)
			return
		}
		slog.Error(UnexpectedError, "error", err.Error(), "where", "GetPatientById")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusOK, patient)
}

// PatientsAppointment implements api.ServerInterface.
func (s Server) PatientsAppointment(
	w http.ResponseWriter,
	r *http.Request,
	patientId api.PatientId,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

// PatientsCalendar implements api.ServerInterface.
func (s Server) PatientsCalendar(
	w http.ResponseWriter,
	r *http.Request,
	patientId api.PatientId,
	params api.PatientsCalendarParams,
) {
	panic("unimplemented")
}

// PatientsMedicalHistoryFiles implements api.ServerInterface.
func (s Server) PatientsMedicalHistoryFiles(
	w http.ResponseWriter,
	r *http.Request,
	patientId api.PatientId,
	params api.PatientsMedicalHistoryFilesParams,
) {
	panic("unimplemented")
}

// RescheduleAppointment implements api.ServerInterface.
func (s Server) RescheduleAppointment(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

// CreatePatientCondition implements api.ServerInterface.
func (s Server) CreatePatientCondition(w http.ResponseWriter, r *http.Request) {
	req, decodeErr := Decode[api.NewCondition](w, r)
	if decodeErr != nil {
		encodeError(w, decodeErr)
		return
	}

	cond, err := s.app.CreatePatientCondition(r.Context(), req)
	if err != nil {
		slog.Error(UnexpectedError, "error", err.Error(), "where", "CreatePatientCondition")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusCreated, cond)
}

// CreatePatientMedicine implements api.ServerInterface.
func (s Server) CreatePatientMedicine(w http.ResponseWriter, r *http.Request) {
	req, decodeErr := Decode[api.NewMedicine](w, r)
	if decodeErr != nil {
		encodeError(w, decodeErr)
		return
	}

	med, err := s.app.CreatePatientMedicine(r.Context(), req)
	if err != nil {
		slog.Error(UnexpectedError, "error", err.Error(), "where", "CreatePatientMedicine")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusCreated, med)
}

// RequestAppointment implements api.ServerInterface.
func (s Server) RequestAppointment(w http.ResponseWriter, r *http.Request) {
	req, decodeErr := Decode[api.NewAppointmentRequest](w, r)
	if decodeErr != nil {
		encodeError(w, decodeErr)
		return
	}

	appt, err := s.app.CreateAppointment(r.Context(), req)
	if err != nil {
		slog.Error(UnexpectedError, "error", err.Error(), "where", "RequestAppointment")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusCreated, appt)
}

// CreateResource implements api.ServerInterface.
func (s Server) CreateResource(w http.ResponseWriter, r *http.Request) {
	req, decodeErr := Decode[api.NewResource](w, r)
	if decodeErr != nil {
		encodeError(w, decodeErr)
		return
	}

	resource, err := s.app.CreateResource(r.Context(), req)
	if err != nil {
		slog.Error(UnexpectedError, "error", err.Error(), "where", "CreateResource")
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusCreated, resource)
}

// ReserveResource implements api.ServerInterface.
func (s Server) ReserveResource(w http.ResponseWriter, r *http.Request, resourceId api.ResourceId) {
	req, decodeErr := Decode[api.ResourceReservation](w, r)
	if decodeErr != nil {
		encodeError(w, decodeErr)
		return
	}

	err := s.app.ReserveResource(r.Context(), resourceId, req)
	if err != nil {
		slog.Error(UnexpectedError, "error", err.Error(), "where", "ReserveResource")
		encodeError(w, internalServerError())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
