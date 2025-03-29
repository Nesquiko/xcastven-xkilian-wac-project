package server

import (
	"context"
	"flag"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/Nesquiko/wac/pkg/api"
	"github.com/Nesquiko/wac/pkg/app"
	"github.com/go-chi/httplog/v2"
)

const (
	AppHostDefault  = "localhost"
	AppPortDefault  = "42069"
	LogLevelDefault = slog.LevelInfo
	TzDefault       = "Europe/Bratislava"
)

func Run(ctx context.Context, args []string) error {
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	flags := flag.NewFlagSet("flags", flag.ExitOnError)

	host := flags.String("host", AppHostDefault, "application host")
	port := flags.String("port", AppPortDefault, "application port")
	logLevel := flags.Int(
		"log",
		int(LogLevelDefault),
		"application log level (-4, 0, 4, 8)",
	)
	tz := flags.String("tz", TzDefault, "timezone in which the app is running")
	flags.Parse(args)

	httpLogger := SetupLogger(slog.Level(*logLevel))

	loc, err := time.LoadLocation(*tz)
	if err != nil {
		slog.Error("failed to load timezone", slog.String("error", err.Error()))
		return err
	}
	httpLogger.Info("loaded timezone", slog.String("tz", loc.String()))
	time.Local = loc

	if err != nil {
		slog.Error("failed to connect to database", slog.String("error", err.Error()))
	}

	spec, err := api.GetSwagger()
	if err != nil {
		slog.Error("failed to load OpenApi spec", slog.String("error", err.Error()))
		os.Exit(1)
	}

	app := app.New()
	srv := NewServer(app, spec, httpLogger)

	httpServer := &http.Server{
		Addr:    net.JoinHostPort(*host, *port),
		Handler: srv,
	}

	go func() {
		slog.Info("starting server", slog.String("addr", httpServer.Addr))
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("error listening and serving", slog.String("error", err.Error()))
		}
	}()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		<-ctx.Done()
		slog.Info("interrupt received, shutting down server")
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownCancel()
		if err := httpServer.Shutdown(shutdownCtx); err != nil {
			slog.Error("error shutting down http server", slog.String("error", err.Error()))
		}
	}()
	wg.Wait()
	return nil
}

func SetupLogger(logLevel slog.Level) *httplog.Logger {
	logger := httplog.NewLogger("swimlogs-api", httplog.Options{
		LogLevel: slog.Level(logLevel),
	})
	slog.SetDefault(logger.Logger)
	return logger
}
