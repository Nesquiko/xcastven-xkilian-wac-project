package server

import (
	"net/http"

	"github.com/Nesquiko/wac/pkg/api"
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
	panic("unimplemented")
}

// GetDoctorById implements api.ServerInterface.
func (s Server) GetDoctorById(w http.ResponseWriter, r *http.Request, doctorId api.DoctorId) {
	panic("unimplemented")
}

// GetDoctorsDoctorIdAppointmentAppointmentId implements api.ServerInterface.
func (s Server) GetDoctorsDoctorIdAppointmentAppointmentId(
	w http.ResponseWriter,
	r *http.Request,
	doctorId api.DoctorId,
	appointmentId api.AppointmentId,
) {
	panic("unimplemented")
}

// GetPatientById implements api.ServerInterface.
func (s Server) GetPatientById(w http.ResponseWriter, r *http.Request, patientId api.PatientId) {
	panic("unimplemented")
}

// GetPatientsPatientIdAppointmentAppointmentId implements api.ServerInterface.
func (s Server) GetPatientsPatientIdAppointmentAppointmentId(
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
