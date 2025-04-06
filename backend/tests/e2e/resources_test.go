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
	"github.com/stretchr/testify/assert"
	"github.com/test-go/testify/require"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
	"github.com/Nesquiko/wac/pkg/server"
)

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
