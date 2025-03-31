BINARY_NAME=wac
PKG=.
API_PKG=./pkg/api

.PHONY: all
all: local

.PHONY: local
local: generate
	@air

.PHONY: generate
generate:
	@go generate ${API_PKG}
