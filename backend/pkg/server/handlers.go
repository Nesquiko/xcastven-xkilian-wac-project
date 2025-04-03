package server

import (
	"net/http"

	"github.com/Nesquiko/wac/pkg/api"
)

func (s Server) RegisterPatient(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
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
