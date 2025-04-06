//go:build e2e

package e2e

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/google/uuid"
	"github.com/oapi-codegen/runtime/types"
	"github.com/stretchr/testify/assert"
	"github.com/test-go/testify/require"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/server"
)

func TestGetPatientById_OK(t *testing.T) {
	t.Parallel()

	patientRequest := newPatient(fmt.Sprintf("test.patient.get.%s@example.com", uuid.NewString()))
	createdPatient := mustCreatePatient(t, patientRequest)
	require.NotEmpty(t, createdPatient.Id, "Setup failed: Created patient ID is empty")

	url := fmt.Sprintf("%s/patients/%s", ServerUrl, createdPatient.Id)
	res, err := http.Get(url)
	require.NoError(t, err, "http.Get failed for GetPatientById")
	defer res.Body.Close()
	require.Equal(t, http.StatusOK, res.StatusCode, "Expected OK status code")

	var retrievedPatient api.Patient
	err = json.NewDecoder(res.Body).Decode(&retrievedPatient)
	require.NoError(t, err, "Failed to decode response body for GetPatientById")

	assert := assert.New(t)
	assert.Equal(createdPatient.Id, retrievedPatient.Id)
	assert.Equal(createdPatient.Email, retrievedPatient.Email)
	assert.Equal(createdPatient.FirstName, retrievedPatient.FirstName)
	assert.Equal(createdPatient.LastName, retrievedPatient.LastName)
}

func TestGetPatientById_NotFound(t *testing.T) {
	t.Parallel()

	nonExistentID := uuid.New()
	url := fmt.Sprintf("%s/patients/%s", ServerUrl, nonExistentID)
	res, err := http.Get(url)
	require.NoError(t, err, "http.Get failed for GetPatientById (NotFound)")
	defer res.Body.Close()
	require.Equal(t, http.StatusNotFound, res.StatusCode, "Expected Not Found status code")

	var errorResponse api.ErrorDetail
	err = json.NewDecoder(res.Body).Decode(&errorResponse)
	require.NoError(t, err, "Failed to decode error response body for GetPatientById (NotFound)")

	assert := assert.New(t)
	assert.Equal(http.StatusNotFound, errorResponse.Status)
	assert.Equal("Not Found", errorResponse.Title)
	assert.Equal("patient.not-found", errorResponse.Code)
	assert.Contains(
		errorResponse.Detail,
		nonExistentID.String(),
		"Error detail should mention the missing ID",
	)
}

func mustCreatePatient(t *testing.T, request *api.PatientRegistration) api.Patient {
	t.Helper()
	require := require.New(t)

	res, err := createPatient(request)
	require.NoError(err, "mustCreatePatient: failed during http post")
	defer res.Body.Close()

	bodyBytes, readErr := io.ReadAll(res.Body)
	require.NoError(readErr, "mustCreatePatient: failed to read response body")
	res.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	require.Equal(
		http.StatusCreated,
		res.StatusCode,
		"mustCreatePatient: unexpected status code. Response body: %s",
		string(bodyBytes),
	)

	var createdPatient api.Patient
	err = json.NewDecoder(res.Body).Decode(&createdPatient)
	require.NoError(err, "mustCreatePatient: failed to decode successful response")

	return createdPatient
}

func createPatient(request *api.PatientRegistration) (*http.Response, error) {
	if request == nil {
		request = newPatient("")
	}
	req, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("createPatient marshal: %w", err)
	}

	url := ServerUrl + "/auth/register"
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(req))
	if err != nil {
		return nil, fmt.Errorf("createPatient post: %w", err)
	}
	return res, nil
}

func newPatient(email string) *api.PatientRegistration {
	p := &api.PatientRegistration{
		Email:     "email@email.com",
		FirstName: "John",
		LastName:  "Doe",
		Role:      api.UserRolePatient,
	}
	if email != "" {
		p.Email = types.Email(email)
	}
	return p
}
