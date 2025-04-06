//go:build e2e

package e2e

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/test-go/testify/require"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/server"
)

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
