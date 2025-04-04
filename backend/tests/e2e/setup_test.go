//go:build e2e

package e2e

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"testing"
	"time"

	"github.com/docker/go-connections/nat"
	"github.com/testcontainers/testcontainers-go/modules/mongodb"

	"github.com/Nesquiko/wac/pkg/server"
)

var ServerUrl string

func TestMain(m *testing.M) {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	logLevel := slog.LevelDebug
	server.SetupLogger(logLevel)

	mongoDBContainer, cleanup := prepareMongo(ctx)
	defer cleanup()

	portBindings, err := mongoDBContainer.Ports(ctx)
	if err != nil {
		slog.Error("couldn't retrive test containers ports", slog.String("error", err.Error()))
		os.Exit(1)
	}
	mongoTcpPort := nat.Port("27017/tcp")
	bindings, ok := portBindings[mongoTcpPort]
	if !ok || len(bindings) == 0 {
		slog.Error(
			"mongoDB port binding not found in test container",
			slog.String("port", string(mongoTcpPort)),
		)
		os.Exit(1)
	}
	dynamicMongoPort := bindings[0].HostPort

	mongoHost, err := mongoDBContainer.Host(ctx)
	if err != nil {
		slog.Error("couldn't retrieve test container host", slog.String("error", err.Error()))
		os.Exit(1)
	}

	appHost := "127.0.0.1"
	appPort := "42070"

	envVars := map[string]string{
		"WAC_APP_PORT":       appPort,
		"WAC_MONGO_HOST":     mongoHost,
		"WAC_MONGO_PORT":     dynamicMongoPort,
		"WAC_MONGO_USER":     "wac",
		"WAC_MONGO_PASSWORD": "wac",
		"WAC_MONGO_DB":       "wac-test",
		"WAC_LOG_LEVEL":      fmt.Sprintf("%d", logLevel),
	}

	for key, value := range envVars {
		if err := os.Setenv(key, value); err != nil {
			slog.Error(
				"Failed to set environment variable for test",
				slog.String("variable", key),
				slog.String("error", err.Error()),
			)
			os.Exit(1)
		}
	}

	ServerUrl = fmt.Sprintf("http://%s:%s", appHost, appPort)

	go func() {
		if err := server.Run(ctx); err != nil {
			slog.Error("server Run failed", slog.String("error", err.Error()))
			os.Exit(1) // Consider exiting if server fails to start
		}
		slog.Info("server Run finished")
	}()

	err = waitForReady(
		ctx,
		5*time.Second,
		200*time.Millisecond,
		ServerUrl+"/monitoring/heartbeat",
	)
	if err != nil {
		slog.Error("ready endpoint not answering", slog.String("error", err.Error()))
		os.Exit(1)
	}

	exitCode := m.Run()
	os.Exit(exitCode)
}

func prepareMongo(ctx context.Context) (*mongodb.MongoDBContainer, func()) {
	mongoDBContainer, err := mongodb.Run(
		ctx,
		"mongo:7.0-rc",
		mongodb.WithPassword("wac"),
		mongodb.WithUsername("wac"),
	)
	if err != nil {
		slog.Error("failed to initialize container", slog.String("error", err.Error()))
		os.Exit(1)
	}

	cleanup := func() {
		slog.Info("terminating MongoDB test container...")
		termCtx, termCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer termCancel()
		if err := mongoDBContainer.Terminate(termCtx); err != nil {
			slog.Warn("failed to terminate mongo container", slog.String("error", err.Error()))
		} else {
			slog.Info("mongoDB test container terminated successfully")
		}
	}

	return mongoDBContainer, cleanup
}
