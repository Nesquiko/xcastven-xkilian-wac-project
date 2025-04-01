FROM oven/bun:latest AS installer


WORKDIR /app

COPY package.json bun.lock /app

RUN bun install --frozen-lockfile

FROM openapitools/openapi-generator-cli:v7.12.0 AS api-gen

COPY --from=installer /app /app

WORKDIR /app

COPY api.bundled.yaml /app

RUN mkdir -p src/api/generated

RUN docker-entrypoint.sh generate -g typescript-fetch -i api.bundled.yaml -o src/api/generated

FROM oven/bun:latest AS builder

WORKDIR /build

COPY --from=api-gen /app /build

COPY . .

RUN bun run build

### we will use polyfea/spa_base as the base image for our
### "BackEnd for (micro)FrontEnd" pattern
FROM ghcr.io/polyfea/spa-base

COPY --from=builder /build/www /spa/public

ENV OTEL_SERVICE_NAME=xcastven-xkilian-project
ENV SPA_BASE_PORT=8080
EXPOSE 8080
