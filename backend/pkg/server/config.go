package server

import (
	"fmt"
	"log/slog"

	"github.com/spf13/viper"
)

type Config struct {
	App struct {
		Host     string `mapstructure:"host"`
		Port     string `mapstructure:"port"`
		Timezone string `mapstructure:"timezone"`
	} `mapstructure:"app"`

	Log struct {
		Level slog.Level `mapstructure:"level"`
	} `mapstructure:"log"`
}

const (
	AppHostDefault  = "localhost"
	AppPortDefault  = "42069"
	LogLevelDefault = slog.LevelInfo
	TzDefault       = "Europe/Bratislava"
)

func loadConfig(configPath string) (*Config, error) {
	v := viper.New()

	v.SetDefault("app.host", AppHostDefault)
	v.SetDefault("app.port", AppPortDefault)
	v.SetDefault("app.timezone", TzDefault)
	v.SetDefault("log.level", int(LogLevelDefault))

	if configPath != "" {
		v.SetConfigFile(configPath)
	} else {
		v.SetConfigFile("config-local.yaml")
	}

	err := v.ReadInConfig()
	if _, ok := err.(viper.ConfigFileNotFoundError); !ok && err != nil {
		return nil, fmt.Errorf("loadConfig failed to read config file: %w", err)
	}

	var cfg Config
	err = v.Unmarshal(&cfg)
	if err != nil {
		return nil, fmt.Errorf("loadConfig failed to unmarshal config: %w", err)
	}

	return &cfg, nil
}
