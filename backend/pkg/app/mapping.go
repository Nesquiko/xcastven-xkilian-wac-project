package app

import (
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
