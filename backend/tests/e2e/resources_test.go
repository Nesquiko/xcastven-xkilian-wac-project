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
	"github.com/Nesquiko/wac/pkg/data"
	"github.com/Nesquiko/wac/pkg/server"
)

func TestReserveResource(t *testing.T) {
	t.Parallel()

	resourceName := fmt.Sprintf("Reservable Resource %s", uuid.NewString())
	resourceType := data.ResourceTypeEquipment
	newResourceReq := api.NewResource{
		Name: resourceName,
		Type: api.ResourceType(resourceType),
	}
	createdResource := mustCreateResource(t, newResourceReq)
	resourceId := *createdResource.Id

	patientEmail := fmt.Sprintf("test.reserve.res.%s@patient.com", uuid.NewString())
	patientReq := newPatient(patientEmail)
	createdPatient := mustCreatePatient(t, patientReq)

	doctorEmail := fmt.Sprintf("test.reserve.res.%s@doctor.com", uuid.NewString())
	doctorReq := newDoctor(doctorEmail)
	createdDoctor := mustCreateDoctor(t, doctorReq)

	appointmentTime := time.Now().Add(24 * time.Hour).Truncate(time.Hour)
	newAppointmentReq := api.NewAppointmentRequest{
		PatientId:           createdPatient.Id,
		AppointmentDateTime: appointmentTime,
		DoctorId:            createdDoctor.Id,
	}
	createdAppointment := mustCreateAppointment(t, newAppointmentReq)
	appointmentId := *createdAppointment.Id

	startTime := appointmentTime
	endTime := startTime.Add(time.Hour)

	reservationPayload := api.ResourceReservation{
		AppointmentId: appointmentId,
		Start:         startTime,
		End:           endTime,
	}
	reqBodyBytes, err := json.Marshal(reservationPayload)
	require.NoError(t, err, "Failed to marshal ReservationRequest")

	url := fmt.Sprintf("%s/resources/%s", ServerUrl, resourceId)
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(reqBodyBytes))
	require.NoError(t, err, "http.Post failed for ReserveResource")
	defer res.Body.Close()

	assert.Equal(
		t,
		http.StatusNoContent,
		res.StatusCode,
		"Expected '204 No Content' status code for successful reservation",
	)
}

func TestCreateResource(t *testing.T) {
	t.Parallel()

	resourceName := fmt.Sprintf("Test Resource %s", uuid.NewString())
	resourceType := data.ResourceTypeFacility

	newResourceRequest := api.NewResource{
		Name: resourceName,
		Type: api.ResourceType(resourceType),
	}

	reqBodyBytes, err := json.Marshal(newResourceRequest)
	require.NoError(t, err, "Failed to marshal NewResource request")

	url := fmt.Sprintf("%s/resources", ServerUrl)
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(reqBodyBytes))
	require.NoError(t, err, "http.Post failed for CreateResource")
	defer res.Body.Close()

	bodyBytes, readErr := io.ReadAll(res.Body)
	require.NoError(t, readErr, "Failed to read response body")
	res.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	require.Equal(
		t,
		http.StatusCreated,
		res.StatusCode,
		"Expected '201 Created' status code. Response body: %s",
		string(bodyBytes),
	)

	var createdResource api.NewResource
	err = json.NewDecoder(res.Body).Decode(&createdResource)
	require.NoError(t, err, "Failed to decode successful response body into NewResource")

	assert := assert.New(t)
	assert.NotNil(createdResource.Id, "Response resource ID should not be nil")
	assert.NotEmpty(*createdResource.Id, "Response resource ID should not be an empty UUID")
	assert.Equal(resourceName, createdResource.Name, "Response resource name mismatch")
	assert.Equal(
		api.ResourceType(resourceType),
		createdResource.Type,
		"Response resource type mismatch",
	)
}

func mustCreateResource(t *testing.T, request api.NewResource) api.NewResource {
	t.Helper()
	require := require.New(t)

	reqBodyBytes, err := json.Marshal(request)
	require.NoError(err, "mustCreateResource: Failed to marshal request")

	url := fmt.Sprintf("%s/resources", ServerUrl)
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(reqBodyBytes))
	require.NoError(err, "mustCreateResource: http.Post failed")
	defer res.Body.Close()

	bodyBytes, readErr := io.ReadAll(res.Body)
	require.NoError(readErr, "mustCreateResource: Failed to read response body")
	res.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	require.Equal(
		http.StatusCreated,
		res.StatusCode,
		"mustCreateResource: Expected '201 Created'. Body: %s",
		string(bodyBytes),
	)

	var createdResource api.NewResource
	err = json.NewDecoder(res.Body).Decode(&createdResource)
	require.NoError(err, "mustCreateResource: Failed to decode response")
	require.NotNil(createdResource.Id, "mustCreateResource: Response ID is nil")
	require.NotEmpty(*createdResource.Id, "mustCreateResource: Response ID is empty UUID")

	return createdResource
}
