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
	"github.com/stretchr/testify/require"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/server"
)

func TestCreateDoctor(t *testing.T) {
	uniqueEmail := fmt.Sprintf("test.doctor.create.%s@example.com", uuid.NewString())
	docRequest := newDoctorRequest(uniqueEmail)

	createdDoctor := mustCreateDoctor(t, docRequest)

	assert := assert.New(t)
	assert.Equal(docRequest.Email, createdDoctor.Email)
	assert.Equal(docRequest.FirstName, createdDoctor.FirstName)
	assert.Equal(docRequest.LastName, createdDoctor.LastName)
	assert.Equal(docRequest.Specialization, createdDoctor.Specialization)
	assert.NotEmpty(createdDoctor.Id, "Created doctor ID should not be empty")
}

func TestCreateDoctor_Conflict(t *testing.T) {
	uniqueEmail := fmt.Sprintf("test.doctor.conflict.%s@example.com", uuid.NewString())
	docRequest1 := newDoctorRequest(uniqueEmail)
	_ = mustCreateDoctor(t, docRequest1)

	res2, err := createDoctor(docRequest1)
	require.NoError(t, err, "Second createDoctor call failed")
	defer res2.Body.Close()

	require.Equal(t, http.StatusConflict, res2.StatusCode, "Expected conflict status code")

	var errorResponse api.ErrorDetail
	err = json.NewDecoder(res2.Body).Decode(&errorResponse)
	require.NoError(t, err, "Failed to decode error response body")

	assert := assert.New(t)
	assert.Equal(http.StatusConflict, errorResponse.Status)
	assert.Equal("Conflict", errorResponse.Title)
	assert.Equal("doctor.email-exists", errorResponse.Code)
	assert.Contains(
		errorResponse.Detail,
		string(docRequest1.Email),
		"Error detail should mention the conflicting email",
	)
}

func mustCreateDoctor(t *testing.T, request *api.Doctor) api.Doctor {
	t.Helper()
	require := require.New(t)

	res, err := createDoctor(request)
	require.NoError(err, "mustCreateDoctor: failed during http post")
	defer res.Body.Close()

	bodyBytes, readErr := io.ReadAll(res.Body)
	require.NoError(readErr, "mustCreateDoctor: failed to read response body")
	res.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	require.Equal(
		http.StatusCreated,
		res.StatusCode,
		"mustCreateDoctor: unexpected status code. Response body: %s",
		string(bodyBytes),
	)

	var createdDoctor api.Doctor
	err = json.NewDecoder(res.Body).Decode(&createdDoctor)
	require.NoError(err, "mustCreateDoctor: failed to decode successful response")

	return createdDoctor
}

func createDoctor(request *api.Doctor) (*http.Response, error) {
	if request == nil {
		request = newDoctorRequest("")
	}
	reqBytes, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("createDoctor marshal: %w", err)
	}

	url := ServerUrl + "/doctors"
	res, err := http.Post(url, server.ApplicationJSON, bytes.NewBuffer(reqBytes))
	if err != nil {
		return nil, fmt.Errorf("createDoctor post: %w", err)
	}
	return res, nil
}

func newDoctorRequest(email string) *api.Doctor {
	d := &api.Doctor{
		Email:          "dr.default@example.com",
		FirstName:      "Gregory",
		LastName:       "House",
		Specialization: api.Urologist,
	}
	if email != "" {
		d.Email = types.Email(email)
	}
	return d
}
