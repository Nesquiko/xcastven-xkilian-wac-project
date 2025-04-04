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

func TestCreatePatient(t *testing.T) {
	require := require.New(t)
	patient := newPatient("test@one.com")
	req, err := json.Marshal(patient)
	require.NoError(err)

	url := ServerUrl + "/patients"
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(req))
	require.NoError(err)

	require.Equal(http.StatusCreated, res.StatusCode, "response: %+v", res)

	var newPatient api.Patient
	err = json.NewDecoder(res.Body).Decode(&newPatient)
	res.Body.Close()
	require.NoError(err, "response: %+v", res)

	assert.Equal(t, patient.Email, newPatient.Email)
	assert.Equal(t, patient.FirstName, newPatient.FirstName)
	assert.Equal(t, patient.LastName, newPatient.LastName)
}

func TestCreatePatient_Conflict(t *testing.T) {
	require := require.New(t)
	assert := assert.New(t)

	uniqueEmail := fmt.Sprintf("test.conflict.%s@example.com", uuid.NewString())
	patient1 := newPatient(uniqueEmail)
	_ = mustCreatePatient(t, patient1)

	res2, err := createPatient(patient1) // Use the same patient data
	require.NoError(err, "Second createPatient call failed")
	defer res2.Body.Close()

	require.Equal(http.StatusConflict, res2.StatusCode, "Expected conflict status code")

	var errorResponse api.ErrorDetail
	err = json.NewDecoder(res2.Body).Decode(&errorResponse)
	require.NoError(err, "Failed to decode error response body")

	assert.Equal(http.StatusConflict, errorResponse.Status)
	assert.Equal("Conflict", errorResponse.Title)
	assert.Equal("patient.email-exists", errorResponse.Code)
	assert.Contains(
		errorResponse.Detail,
		string(patient1.Email),
		"Error detail should mention the conflicting email",
	)
}

func mustCreatePatient(t *testing.T, request *api.Patient) api.Patient {
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

func createPatient(request *api.Patient) (*http.Response, error) {
	if request == nil {
		request = newPatient("")
	}
	req, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("createPatient marshal: %w", err)
	}

	url := ServerUrl + "/patients"
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(req))
	if err != nil {
		return nil, fmt.Errorf("createPatient post: %w", err)
	}
	return res, nil
}

func newPatient(email string) *api.Patient {
	p := &api.Patient{
		Email:     "email@email.com",
		FirstName: "John",
		LastName:  "Doe",
	}
	if email != "" {
		p.Email = types.Email(email)
	}
	return p
}
