package app

import (
	"github.com/oapi-codegen/runtime/types"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func apiPatientToDataPatient(p api.Patient) data.Patient {
	patient := data.Patient{
		Email:     string(p.Email),
		FirstName: p.FirstName,
		LastName:  p.LastName,
	}

	if p.Id != nil {
		patient.Id = *p.Id
	}

	return patient
}

func dataPatientToApiPatient(p data.Patient) api.Patient {
	return api.Patient{
		Id:        &p.Id,
		Email:     types.Email(p.Email),
		FirstName: p.FirstName,
		LastName:  p.LastName,
	}
}

func apiDoctorToDataDoctor(d api.Doctor) data.Doctor {
	doctor := data.Doctor{
		Email:          string(d.Email),
		FirstName:      d.FirstName,
		LastName:       d.LastName,
		Specialization: string(d.Specialization),
	}

	if d.Id != nil {
		doctor.Id = *d.Id
	}

	return doctor
}

func dataDoctorToApiDoctor(d data.Doctor) api.Doctor {
	return api.Doctor{
		Id:             &d.Id,
		Email:          types.Email(d.Email),
		FirstName:      d.FirstName,
		LastName:       d.LastName,
		Specialization: api.DoctorSpecialization(d.Specialization),
	}
}
