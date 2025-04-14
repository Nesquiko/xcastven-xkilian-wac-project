package app

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

// CreateAppointment implements App.
func (a monolithApp) CreateAppointment(
	ctx context.Context,
	appt api.NewAppointmentRequest,
) (api.PatientAppointment, error) {
	appointment, err := a.db.CreateAppointment(ctx, newApptToDataAppt(appt))
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("CreateAppointment create appointment: %w", err)
	}

	doc, err := a.db.DoctorById(ctx, appointment.DoctorId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("CreateAppointment find doctor: %w", err)
	}

	var cond *data.Condition = nil
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.PatientAppointment{}, fmt.Errorf("CreateAppointment find condition: %w", err)
		}
		cond = &c
	}

	return dataApptToPatientAppt(appointment, doc, cond), nil
}

func (a monolithApp) CancelAppointment(
	ctx context.Context,
	appointmentId uuid.UUID,
	reason *string,
) error {
	err := a.db.CancelAppointment(ctx, appointmentId, reason)
	if err != nil {
		return fmt.Errorf("CancelAppointment: %w", err)
	}
	return nil
}

func (a monolithApp) PatientsAppointmentById(
	ctx context.Context,
	patientId uuid.UUID,
	appointmentId uuid.UUID,
) (api.PatientAppointment, error) {
	appointment, err := a.db.AppointmentById(ctx, appointmentId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("PatientsAppointmentById: %w", err)
	}

	doc, err := a.db.DoctorById(ctx, appointment.DoctorId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("PatientsAppointmentById find doctor: %w", err)
	}

	var cond *data.Condition
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.PatientAppointment{}, fmt.Errorf(
				"PatientsAppointmentById find condition: %w",
				err,
			)
		}
		cond = &c
	}

	return dataApptToPatientAppt(appointment, doc, cond), nil
}

func (a monolithApp) DoctorsAppointmentById(
	ctx context.Context,
	doctorId uuid.UUID,
	appointmentId uuid.UUID,
) (api.DoctorAppointment, error) {
	appointment, err := a.db.AppointmentById(ctx, appointmentId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf("DoctorsAppointmentById: %w", err)
	}

	patient, err := a.db.PatientById(ctx, appointment.PatientId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf("DoctorsAppointmentById find patient: %w", err)
	}

	var cond *data.Condition
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.DoctorAppointment{}, fmt.Errorf(
				"DoctorsAppointmentById find condition: %w",
				err,
			)
		}
		cond = &c
	}

	resources, err := a.db.ResourcesByAppointmentId(ctx, appointmentId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf(
			"DoctorsAppointmentById fetch reservations: %w",
			err,
		)
	}

	var facilities, equipment, medicine []data.Resource
	for _, resource := range resources {
		switch resource.Type {
		case data.ResourceTypeFacility:
			facilities = append(facilities, resource)
		case data.ResourceTypeEquipment:
			equipment = append(equipment, resource)
		case data.ResourceTypeMedicine:
			medicine = append(medicine, resource)
		}
	}

	prescriptions, err := a.db.PrescriptionByAppointmentId(ctx, appointmentId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf(
			"DoctorsAppointmentById fetch prescriptions: %w",
			err,
		)
	}

	return dataApptToDoctorAppt(
		appointment,
		patient,
		cond,
		facilities,
		equipment,
		medicine,
		prescriptions,
	), nil
}

func (a monolithApp) DecideAppointment(
	ctx context.Context,
	appointmentId uuid.UUID,
	decision api.AppointmentDecision,
) (api.DoctorAppointment, error) {
	var resources []data.Resource
	if decision.Facilities != nil {
		for _, facility := range *decision.Facilities {
			resources = append(resources, data.Resource{
				Id:   facility.Id,
				Name: facility.Name,
				Type: data.ResourceTypeFacility,
			})
		}
	}
	if decision.Equipment != nil {
		for _, equipment := range *decision.Equipment {
			resources = append(resources, data.Resource{
				Id:   equipment.Id,
				Name: equipment.Name,
				Type: data.ResourceTypeEquipment,
			})
		}
	}
	if decision.Medicine != nil {
		for _, medicine := range *decision.Medicine {
			resources = append(resources, data.Resource{
				Id:   medicine.Id,
				Name: medicine.Name,
				Type: data.ResourceTypeMedicine,
			})
		}
	}

	appointment, err := a.db.DecideAppointment(
		ctx,
		appointmentId,
		string(decision.Action),
		decision.Reason,
		resources,
	)
	if err != nil {
		if errors.Is(err, data.ErrResourceUnavailable) {
			return api.DoctorAppointment{}, fmt.Errorf(
				"DecideAppointment: %w",
				ErrResourceUnavailable,
			)
		}
		return api.DoctorAppointment{}, fmt.Errorf("DecideAppointment: %w", err)
	}

	patient, err := a.db.PatientById(ctx, appointment.PatientId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf("DecideAppointment fetch patient: %w", err)
	}

	var cond *data.Condition
	if appointment.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appointment.ConditionId)
		if err != nil {
			return api.DoctorAppointment{}, fmt.Errorf("DecideAppointment fetch condition: %w", err)
		}
		cond = &c
	}

	var facilities, equipment, medicine []data.Resource
	for _, resource := range resources {
		switch resource.Type {
		case data.ResourceTypeFacility:
			facilities = append(facilities, resource)
		case data.ResourceTypeEquipment:
			equipment = append(equipment, resource)
		case data.ResourceTypeMedicine:
			medicine = append(medicine, resource)
		}
	}

	prescriptions, err := a.db.PrescriptionByAppointmentId(ctx, appointmentId)
	if err != nil {
		return api.DoctorAppointment{}, fmt.Errorf(
			"DoctorsAppointmentById fetch prescriptions: %w",
			err,
		)
	}

	doctorAppointment := dataApptToDoctorAppt(
		appointment,
		patient,
		cond,
		facilities,
		equipment,
		medicine,
		prescriptions,
	)

	return doctorAppointment, nil
}

func (a monolithApp) DoctorTimeSlots(
	ctx context.Context,
	doctorId uuid.UUID,
	date time.Time,
) (api.DoctorTimeslots, error) {
	appointments, err := a.db.AppointmentsByDoctorIdAndDate(ctx, doctorId, date)
	if err != nil {
		return api.DoctorTimeslots{}, fmt.Errorf("DoctorTimeSlots: %w", err)
	}

	bookedHours := make(map[int]bool)
	for _, appt := range appointments {
		bookedHours[appt.AppointmentDateTime.Hour()] = true
	}

	var slots []api.TimeSlot
	for hour := 8; hour <= 14; hour++ {
		status := api.Available
		if bookedHours[hour] {
			status = api.Unavailable
		}

		slotTime := time.Date(date.Year(), date.Month(), date.Day(), hour, 0, 0, 0, date.Location()).
			Format("15:04")

		slots = append(slots, api.TimeSlot{
			Status: status,
			Time:   slotTime,
		})
	}

	return api.DoctorTimeslots{Slots: slots}, nil
}

func (a monolithApp) RescheduleAppointment(
	ctx context.Context,
	appointmentId api.AppointmentId,
	newDateTime time.Time,
) (api.PatientAppointment, error) {
	appt, err := a.db.RescheduleAppointment(ctx, appointmentId, newDateTime)
	if err != nil {
		if errors.Is(err, data.ErrDoctorUnavailable) {
			return api.PatientAppointment{}, fmt.Errorf(
				"RescheduleAppointment: %w",
				ErrDoctorUnavailable,
			)
		}
		return api.PatientAppointment{}, fmt.Errorf("RescheduleAppointment: %w", err)
	}

	doc, err := a.db.DoctorById(ctx, appt.DoctorId)
	if err != nil {
		return api.PatientAppointment{}, fmt.Errorf("RescheduleAppointment find doctor: %w", err)
	}

	var cond *data.Condition
	if appt.ConditionId != nil {
		c, err := a.db.ConditionById(ctx, *appt.ConditionId)
		if err != nil {
			return api.PatientAppointment{}, fmt.Errorf(
				"RescheduleAppointment find condition: %w",
				err,
			)
		}
		cond = &c
	}

	return dataApptToPatientAppt(appt, doc, cond), nil
}
