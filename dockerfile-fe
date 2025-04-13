FROM oven/bun:latest AS installer

WORKDIR /app

COPY ./frontend/package.json ./frontend/bun.lock /app

RUN bun install --frozen-lockfile

WORKDIR /api

COPY ./api/package.json ./api/bun.lock /api

RUN bun install --frozen-lockfile

COPY ./api/api.yaml /api
COPY ./api/components /api/components
COPY ./api/paths /api/paths

RUN bun run bundle

FROM openapitools/openapi-generator-cli:v7.12.0 AS api-gen

COPY --from=installer /app /app

COPY --from=installer /api/api.bundled.yaml /app

WORKDIR /app

RUN mkdir -p src/api/generated

RUN docker-entrypoint.sh generate -g typescript-fetch -i api.bundled.yaml -o src/api/generated

FROM oven/bun:latest AS builder

WORKDIR /build

COPY --from=api-gen /app /build

COPY ./frontend .

RUN bun run build

### we will use polyfea/spa_base as the base image for our
### "BackEnd for (micro)FrontEnd" pattern
FROM ghcr.io/polyfea/spa-base

COPY --from=builder /build/www /spa/public

ENV OTEL_SERVICE_NAME=xcastven-xkilian-project
ENV SPA_BASE_PORT=8080
EXPOSE 8080
