package app

import (
	"context"
	"fmt"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/data"
)

func (a monolithApp) CreateResource(
	ctx context.Context,
	resource api.NewResource,
) (api.NewResource, error) {
	res, err := a.db.CreateResource(ctx, resource.Name, data.ResourceType(resource.Type))
	if err != nil {
		return api.NewResource{}, fmt.Errorf("CreateResource: %w", err)
	}

	return api.NewResource{
		Id:   &res.Id,
		Name: res.Name,
		Type: api.ResourceType(res.Type),
	}, nil
}

