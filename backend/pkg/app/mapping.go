package app

import (
	"time"

	"github.com/oapi-codegen/runtime/types"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func patientRegToDataPatient(p api.PatientRegistration) data.Patient {
	return data.Patient{
		Email:     string(p.Email),
		FirstName: p.FirstName,
		LastName:  p.LastName,
	}
}

func dataPatientToApiPatient(p data.Patient) api.Patient {
	return api.Patient{
		Id:        p.Id,
		Email:     types.Email(p.Email),
		FirstName: p.FirstName,
		LastName:  p.LastName,
		Role:      api.UserRolePatient,
	}
}

func doctorRegToDataDoctor(d api.DoctorRegistration) data.Doctor {
	doctor := data.Doctor{
		Email:          string(d.Email),
		FirstName:      d.FirstName,
		LastName:       d.LastName,
		Specialization: string(d.Specialization),
	}

	return doctor
}

func dataDoctorToApiDoctor(d data.Doctor) api.Doctor {
	return api.Doctor{
		Id:             d.Id,
		Email:          types.Email(d.Email),
		FirstName:      d.FirstName,
		LastName:       d.LastName,
		Specialization: api.SpecializationEnum(d.Specialization),
		Role:           api.UserRoleDoctor,
	}
}

func newCondToDataCond(c api.NewCondition) data.Condition {
	return data.Condition{
		PatientId: c.PatientId,
		Name:      c.Name,
		Start:     c.Start,
		End:       c.End,
	}
}

func dataCondToCondDisplay(c data.Condition) api.ConditionDisplay {
	return api.ConditionDisplay{
		Id:    &c.Id,
		Name:  c.Name,
		Start: c.Start,
		End:   c.End,
	}
}

func newMedToDataMed(m api.NewMedicine) data.Medicine {
	return data.Medicine{
		PatientId: m.PatientId,
		Name:      m.Name,
		Start:     m.Start,
		End:       m.End,
	}
}

func dataMedToMedDisplay(m data.Medicine) api.MedicineDisplay {
	return api.MedicineDisplay{
		Id:    &m.Id,
		Name:  m.Name,
		Start: m.Start,
		End:   m.End,
	}
}

func resourceToEquipment(r data.Resource) api.Equipment {
	return api.Equipment{Id: r.Id, Name: r.Name}
}

func resourceToFacility(r data.Resource) api.Facility {
	return api.Facility{Id: r.Id, Name: r.Name}
}

func resourceToMedicine(r data.Resource) api.Medicine {
	return api.Medicine{Id: r.Id, Name: r.Name}
}

func newApptToDataAppt(a api.NewAppointmentRequest) data.Appointment {
	appt := data.Appointment{
		PatientId:           a.PatientId,
		DoctorId:            a.DoctorId,
		AppointmentDateTime: a.AppointmentDateTime,
		EndTime:             a.AppointmentDateTime.Add(time.Hour),
		Status:              string(api.Requested),
		Reason:              a.Reason,
		ConditionId:         a.ConditionId,
	}

	if a.Type != nil {
		appt.Type = string(*a.Type)
	}
	return appt
}

func dataApptToPatientAppt(
	a data.Appointment,
	d data.Doctor,
	c *data.Condition,
) api.PatientAppointment {
	appt := api.PatientAppointment{
		Id:                  &a.Id,
		AppointmentDateTime: a.AppointmentDateTime,
		Doctor:              dataDoctorToApiDoctor(d),
		Reason:              a.Reason,
		Status:              api.AppointmentStatus(a.Status),
		Type:                api.AppointmentType(a.Type),
		CancellationReason:  a.CancellationReason,
	}

	if c != nil {
		cond := dataCondToCondDisplay(*c)
		appt.Condition = &cond
	}

	return appt
}

func dataApptToDoctorAppt(
	appt data.Appointment,
	patient data.Patient,
	cond *data.Condition,
	facilities []data.Resource,
	equipment []data.Resource,
	medicine []data.Resource,
) api.DoctorAppointment {
	doctorAppt := api.DoctorAppointment{
		Id:                  &appt.Id,
		AppointmentDateTime: appt.AppointmentDateTime,
		CancellationReason:  appt.CancellationReason,
		Patient:             dataPatientToApiPatient(patient),
		Reason:              appt.Reason,
		Status:              api.AppointmentStatus(appt.Status),
		Type:                api.AppointmentType(appt.Type),
	}

	if cond != nil {
		doctorAppt.Condition = asPtr(dataCondToCondDisplay(*cond))
	}

	if len(facilities) > 0 {
		doctorAppt.Facilities = asPtr(Map(facilities, resourceToFacility))
	}
	if len(equipment) > 0 {
		doctorAppt.Equipment = asPtr(Map(equipment, resourceToEquipment))
	}
	if len(medicine) > 0 {
		doctorAppt.Medicine = asPtr(Map(medicine, resourceToMedicine))
	}

	return doctorAppt
}

func asPtr[T any](v T) *T {
	return &v
}

func Map[T, V any](ts []T, fn func(T) V) []V {
	result := make([]V, len(ts))
	for i, t := range ts {
		result[i] = fn(t)
	}
	return result
}
