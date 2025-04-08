//go:build e2e

package e2e

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/test-go/testify/require"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/server"
)

func TestDecideAppointmentApprove(t *testing.T) {
	t.Parallel()

	patientEmail := fmt.Sprintf("test.decide.appt.approve.%s@patient.com", uuid.NewString())
	patient := mustCreatePatient(t, newPatient(patientEmail))

	doctorEmail := fmt.Sprintf("test.decide.appt.approve.%s@doctor.com", uuid.NewString())
	doctor := mustCreateDoctor(t, newDoctor(doctorEmail))

	appointmentTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	newAppointmentReq := api.NewAppointmentRequest{
		PatientId:           patient.Id,
		DoctorId:            doctor.Id,
		AppointmentDateTime: appointmentTime,
		Type:                asPtr(api.RegularCheck),
	}
	createdAppointment := mustCreateAppointment(t, newAppointmentReq)
	appointmentId := *createdAppointment.Id

	resourceName := "Test Resource"
	resourceType := api.ResourceTypeEquipment
	resource := mustCreateResource(t, api.NewResource{Name: resourceName, Type: resourceType})

	decision := api.AppointmentDecision{
		Action: api.Accept,
		Equipment: &[]api.Equipment{
			{
				Id:   *resource.Id,
				Name: resource.Name,
			},
		},
	}
	decisionReqBody, err := json.Marshal(decision)
	require.NoError(t, err, "Failed to marshal decision request body")

	url := fmt.Sprintf("%s/appointments/%s", ServerUrl, appointmentId)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(decisionReqBody))
	require.NoError(t, err, "Failed to create HTTP POST request")
	req.Header.Set("Content-Type", server.ApplicationJSON)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err, "http.Post failed for DecideAppointment")
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode, "Expected '200 OK' status code")

	var fetchedAppointment api.DoctorAppointment
	err = json.NewDecoder(res.Body).Decode(&fetchedAppointment)
	require.NoError(t, err, "Failed to decode fetched appointment")

	assert := assert.New(t)
	assert.Equal(
		api.Scheduled,
		fetchedAppointment.Status,
		"Appointment status should be 'scheduled'",
	)
	assert.NotNil(fetchedAppointment.Equipment)
	assert.Len(*fetchedAppointment.Equipment, 1)
	assert.Equal(*resource.Id, (*fetchedAppointment.Equipment)[0].Id)
	assert.Equal(resource.Name, (*fetchedAppointment.Equipment)[0].Name)
}

func TestDecideAppointmentReject(t *testing.T) {
	t.Parallel()

	patientEmail := fmt.Sprintf("test.decide.appt.reject.%s@patient.com", uuid.NewString())
	patient := mustCreatePatient(t, newPatient(patientEmail))

	doctorEmail := fmt.Sprintf("test.decide.appt.reject.%s@doctor.com", uuid.NewString())
	doctor := mustCreateDoctor(t, newDoctor(doctorEmail))

	appointmentTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	newAppointmentReq := api.NewAppointmentRequest{
		PatientId:           patient.Id,
		DoctorId:            doctor.Id,
		AppointmentDateTime: appointmentTime,
		Type:                asPtr(api.RegularCheck),
	}
	createdAppointment := mustCreateAppointment(t, newAppointmentReq)
	appointmentId := *createdAppointment.Id

	rejectionReason := "Test rejection reason"
	decision := api.AppointmentDecision{
		Action: api.Reject,
		Reason: &rejectionReason,
	}
	decisionReqBody, err := json.Marshal(decision)
	require.NoError(t, err, "Failed to marshal decision request body")

	url := fmt.Sprintf("%s/appointments/%s", ServerUrl, appointmentId)
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(decisionReqBody))
	require.NoError(t, err, "Failed to create HTTP POST request")
	req.Header.Set("Content-Type", server.ApplicationJSON)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err, "http.Post failed for DecideAppointment")
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode, "Expected '200 OK' status code")

	var fetchedAppointment api.DoctorAppointment
	err = json.NewDecoder(res.Body).Decode(&fetchedAppointment)
	require.NoError(t, err, "Failed to decode fetched appointment")

	assert := assert.New(t)
	assert.Equal(api.Denied, fetchedAppointment.Status, "Appointment status should be 'denied'")
	assert.Equal(rejectionReason, *fetchedAppointment.Reason, "Rejection reason mismatch")
}

func TestDoctorsAppointmentById(t *testing.T) {
	t.Parallel()

	patientEmail := fmt.Sprintf("test.doctor.appt.by.id.%s@patient.com", uuid.NewString())
	patient := mustCreatePatient(t, newPatient(patientEmail))

	doctorEmail := fmt.Sprintf("test.doctor.appt.by.id.%s@doctor.com", uuid.NewString())
	doctor := mustCreateDoctor(t, newDoctor(doctorEmail))

	appointmentTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	newAppointmentReq := api.NewAppointmentRequest{
		PatientId:           patient.Id,
		DoctorId:            doctor.Id,
		AppointmentDateTime: appointmentTime,
		Type:                asPtr(api.RegularCheck),
	}
	createdAppointment := mustCreateAppointment(t, newAppointmentReq)
	appointmentId := *createdAppointment.Id

	resourceName := "Test Resource"
	resourceType := api.ResourceTypeEquipment
	resource := mustCreateResource(t, api.NewResource{Name: resourceName, Type: resourceType})
	mustCreateReservation(
		t,
		api.ResourceReservation{
			AppointmentId: appointmentId,
			Start:         appointmentTime,
			End:           appointmentTime.Add(time.Hour),
		},
		*resource.Id,
	)

	url := fmt.Sprintf("%s/doctors/%s/appointment/%s", ServerUrl, doctor.Id, appointmentId)
	res, err := http.Get(url)
	require.NoError(t, err, "http.Get failed for DoctorsAppointmentById")
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode, "Expected '200 OK' status code")

	var fetchedAppointment api.DoctorAppointment
	err = json.NewDecoder(res.Body).Decode(&fetchedAppointment)
	require.NoError(t, err, "Failed to decode fetched appointment")

	assert := assert.New(t)
	assert.True(
		appointmentTime.Equal(fetchedAppointment.AppointmentDateTime),
		"Appointment date time mismatch",
	)
	assert.Nil(
		fetchedAppointment.CancellationReason,
		"Cancellation reason should be nil for a new appointment",
	)
	assert.Equal(patient.Id, fetchedAppointment.Patient.Id, "Patient ID mismatch")
	assert.Equal(appointmentId, *fetchedAppointment.Id, "Appointment ID mismatch")
	assert.Equal(
		newAppointmentReq.Reason,
		fetchedAppointment.Reason,
		"Appointment reason mismatch",
	)
	assert.Equal(
		api.Requested,
		fetchedAppointment.Status,
		"Appointment status should be 'requested'",
	)
	assert.Equal(*newAppointmentReq.Type, fetchedAppointment.Type, "Appointment type mismatch")

	require.NotNil(t, fetchedAppointment.Equipment)
	assert.Len(*fetchedAppointment.Equipment, 1)
	assert.Equal(*resource.Id, (*fetchedAppointment.Equipment)[0].Id)
	assert.Equal(resource.Name, (*fetchedAppointment.Equipment)[0].Name)
}

func TestPatientsAppointmentById(t *testing.T) {
	t.Parallel()

	patientEmail := fmt.Sprintf("test.patient.appt.by.id.%s@patient.com", uuid.NewString())
	patient := mustCreatePatient(t, newPatient(patientEmail))

	doctorEmail := fmt.Sprintf("test.patient.appt.by.id.%s@doctor.com", uuid.NewString())
	doctor := mustCreateDoctor(t, newDoctor(doctorEmail))

	appointmentTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	newAppointmentReq := api.NewAppointmentRequest{
		PatientId:           patient.Id,
		DoctorId:            doctor.Id,
		AppointmentDateTime: appointmentTime,
		Type:                asPtr(api.RegularCheck),
	}
	createdAppointment := mustCreateAppointment(t, newAppointmentReq)
	appointmentId := *createdAppointment.Id

	url := fmt.Sprintf("%s/patients/%s/appointment/%s", ServerUrl, patient.Id, appointmentId)
	res, err := http.Get(url)
	require.NoError(t, err, "http.Get failed for PatientsAppointmentById")
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode, "Expected '200 OK' status code")

	var fetchedAppointment api.PatientAppointment
	err = json.NewDecoder(res.Body).Decode(&fetchedAppointment)
	require.NoError(t, err, "Failed to decode fetched appointment")

	assert := assert.New(t)
	assert.True(
		appointmentTime.Equal(fetchedAppointment.AppointmentDateTime),
		"Appointment date time mismatch",
	)
	assert.Nil(
		fetchedAppointment.CancellationReason,
		"Cancellation reason should be nil for a new appointment",
	)
	assert.Nil(fetchedAppointment.Condition, "Condition should be nil if not provided")
	assert.Equal(doctor.Id, fetchedAppointment.Doctor.Id, "Doctor ID mismatch")
	assert.Equal(appointmentId, *fetchedAppointment.Id, "Appointment ID mismatch")
	assert.Equal(
		newAppointmentReq.Reason,
		fetchedAppointment.Reason,
		"Appointment reason mismatch",
	)
	assert.Equal(
		api.Requested,
		fetchedAppointment.Status,
		"Appointment status should be 'scheduled'",
	)
	assert.Equal(*newAppointmentReq.Type, fetchedAppointment.Type, "Appointment type mismatch")
}

func TestCancelAppointment(t *testing.T) {
	t.Parallel()

	patientEmail := fmt.Sprintf("test.cancel.appt.%s@patient.com", uuid.NewString())
	patient := mustCreatePatient(t, newPatient(patientEmail))

	doctorEmail := fmt.Sprintf("test.cancel.appt.%s@doctor.com", uuid.NewString())
	doctor := mustCreateDoctor(t, newDoctor(doctorEmail))

	appointmentTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	newAppointmentReq := api.NewAppointmentRequest{
		PatientId:           patient.Id,
		DoctorId:            doctor.Id,
		AppointmentDateTime: appointmentTime,
	}
	createdAppointment := mustCreateAppointment(t, newAppointmentReq)
	appointmentId := *createdAppointment.Id

	cancellationReason := "Test cancellation reason"
	cancellationReqBody, err := json.Marshal(
		api.AppointmentCancellation{Reason: &cancellationReason},
	)
	require.NoError(t, err, "Failed to marshal cancellation request body")

	url := fmt.Sprintf("%s/appointments/%s", ServerUrl, appointmentId)
	req, err := http.NewRequest(http.MethodDelete, url, bytes.NewBuffer(cancellationReqBody))
	require.NoError(t, err, "Failed to create HTTP DELETE request")
	req.Header.Set("Content-Type", server.ApplicationJSON)

	res, err := http.DefaultClient.Do(req)
	require.NoError(t, err, "http.Delete failed for CancelAppointment")
	defer res.Body.Close()

	require.Equal(t, http.StatusNoContent, res.StatusCode, "Expected '204 No Content' status code")

	getUrl := fmt.Sprintf("%s/patients/%s/appointment/%s", ServerUrl, patient.Id, appointmentId)
	getRes, err := http.Get(getUrl)
	require.NoError(t, err, "Failed to fetch appointment after cancellation")
	defer getRes.Body.Close()

	require.Equal(
		t,
		http.StatusOK,
		getRes.StatusCode,
		"Expected '200 OK' status code for fetched appointment",
	)

	var fetchedAppointment api.PatientAppointment
	err = json.NewDecoder(getRes.Body).Decode(&fetchedAppointment)
	require.NoError(t, err, "Failed to decode fetched appointment")

	assert.Equal(
		t,
		api.Cancelled,
		fetchedAppointment.Status,
		"Appointment status should be 'cancelled'",
	)
	assert.Equal(
		t,
		cancellationReason,
		*fetchedAppointment.CancellationReason,
		"Cancellation reason mismatch",
	)
}

func mustCreateAppointment(t *testing.T, request api.NewAppointmentRequest) api.PatientAppointment {
	t.Helper()
	require := require.New(t)

	reqBodyBytes, err := json.Marshal(request)
	require.NoError(err, "mustCreateAppointment: Failed to marshal request")

	url := fmt.Sprintf("%s/appointments", ServerUrl)
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(reqBodyBytes))
	require.NoError(err, "mustCreateAppointment: http.Post failed")
	defer res.Body.Close()

	bodyBytes, readErr := io.ReadAll(res.Body)
	require.NoError(readErr, "mustCreateAppointment: Failed to read response body")
	res.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	require.Equal(
		http.StatusCreated,
		res.StatusCode,
		"mustCreateAppointment: Expected '201 Created'. Body: %s",
		string(bodyBytes),
	)

	var createdAppointment api.PatientAppointment
	err = json.NewDecoder(res.Body).Decode(&createdAppointment)
	require.NoError(err, "mustCreateAppointment: Failed to decode response")
	require.NotNil(createdAppointment.Id, "mustCreateAppointment: Response ID is nil")
	require.NotEmpty(*createdAppointment.Id, "mustCreateAppointment: Response ID is empty UUID")

	return createdAppointment
}
