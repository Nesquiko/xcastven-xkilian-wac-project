include ./deployments/local.env

.PHONY: all
all: local

.PHONY: local
local: generate mongo-up
	@trap '$(DOCKER_COMPOSE_CMD) down' EXIT; \
	air

.PHONY: generate
generate:
	@go generate ./pkg/api

PROJECT_ROOT := .
DOCKER_COMPOSE_FILE := $(PROJECT_ROOT)/deployments/docker-compose.yaml
DOCKER_COMPOSE_ENV := $(PROJECT_ROOT)/deployments/local.env
DOCKER_COMPOSE_CMD := docker compose --file $(DOCKER_COMPOSE_FILE) --env-file $(DOCKER_COMPOSE_ENV)

.PHONY: mongo-up
mongo-up:
	$(DOCKER_COMPOSE_CMD) up --detach

.PHONY: mongo-down
mongo-down:
	$(DOCKER_COMPOSE_CMD) down
