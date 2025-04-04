package server

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/app"
)

func (s Server) RegisterPatient(w http.ResponseWriter, r *http.Request) {
	request, decodeErr := Decode[api.Patient](w, r)
	if decodeErr != nil {
		encodeError(w, decodeErr)
		return
	}

	p, err := s.app.CreatePatient(r.Context(), request)
	if errors.Is(err, app.ErrDuplicateEmail) {
		apiErr := &ApiError{
			ErrorDetail: api.ErrorDetail{
				Code:   "patient.email-exists",
				Title:  "Conflict",
				Detail: fmt.Sprintf("A patient with email %q already exists.", request.Email),
				Status: http.StatusConflict,
			},
		}
		encodeError(w, apiErr)
		return
	} else if err != nil {
		slog.Error(UnexpectedError, slog.String("error", err.Error()), slog.String("where", "RegisterPatient"))
		encodeError(w, internalServerError())
		return
	}

	encode(w, http.StatusCreated, p)
}

func (s Server) RegisterDoctor(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

func (s Server) AssignAppointmentResources(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

func (s Server) CancelAppointment(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

func (s Server) DecideAppointmentRequest(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

func (s Server) GetAvailableResources(
	w http.ResponseWriter,
	r *http.Request,
	params api.GetAvailableResourcesParams,
) {
	panic("unimplemented")
}

func (s Server) GetDoctorTimeslots(
	w http.ResponseWriter,
	r *http.Request,
	doctorId api.DoctorId,
	params api.GetDoctorTimeslotsParams,
) {
	panic("unimplemented")
}

func (s Server) ListDoctors(w http.ResponseWriter, r *http.Request, params api.ListDoctorsParams) {
	panic("unimplemented")
}

func (s Server) PatientsMedicalHistoryFiles(
	w http.ResponseWriter,
	r *http.Request,
	patientId api.PatientId,
	params api.PatientsMedicalHistoryFilesParams,
) {
	panic("unimplemented")
}

func (s Server) RequestAppointment(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

func (s Server) RescheduleMyAppointment(
	w http.ResponseWriter,
	r *http.Request,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}
