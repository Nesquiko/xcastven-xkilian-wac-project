package app

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

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

func (a monolithApp) ReserveResource(
	ctx context.Context,
	resourceId uuid.UUID,
	res api.ResourceReservation,
) error {
	resource, err := a.db.ResourceById(ctx, resourceId)
	if err != nil {
		return fmt.Errorf("ReserveResource can't find resource by id %q: %w", resourceId, err)
	}
	_, err = a.db.CreateReservation(
		ctx,
		res.AppointmentId,
		resourceId,
		resource.Name,
		resource.Type,
		res.Start,
		res.End,
	)
	if err != nil {
		return fmt.Errorf("ReserveResource can't reserve resource: %w", err)
	}
	return nil
}

func (a monolithApp) AvailableResources(
	ctx context.Context,
	dateTime time.Time,
) (api.AvailableResources, error) {
	resources, err := a.db.FindAvailableResourcesAtTime(ctx, dateTime)
	if err != nil {
		return api.AvailableResources{}, fmt.Errorf("AvailableResources: %w", err)
	}

	available := api.AvailableResources{
		Equipment:  make([]api.Equipment, len(resources.Equipment)),
		Facilities: make([]api.Facility, len(resources.Facilities)),
		Medicine:   make([]api.Medicine, len(resources.Medicines)),
	}

	for i, res := range resources.Equipment {
		available.Equipment[i] = resourceToEquipment(res)
	}

	for i, res := range resources.Facilities {
		available.Facilities[i] = resourceToFacility(res)
	}

	for i, res := range resources.Medicines {
		available.Medicine[i] = resourceToMedicine(res)
	}

	return available, nil
}
