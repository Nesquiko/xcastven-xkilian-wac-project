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

	Mongo struct {
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		User     string `mapstructure:"user"`
		Password string `mapstructure:"password"`
		Db       string `mapstructure:"db"`
	} `mapstructure:"mongo"`
}

func (c Config) MongoURI() string {
	return fmt.Sprintf(
		"mongodb://%s:%s@%s:%d/%s?authSource=admin",
		c.Mongo.User,
		c.Mongo.Password,
		c.Mongo.Host,
		c.Mongo.Port,
		c.Mongo.Db,
	)
}

const (
	AppHostDefault   = "localhost"
	AppPortDefault   = "42069"
	LogLevelDefault  = slog.LevelInfo
	TzDefault        = "Europe/Bratislava"
	MongoHostDefault = "localhost"
	MongoPortDefault = 27017
)

func loadConfig(configPath string) (*Config, error) {
	v := viper.New()

	v.SetDefault("app.host", AppHostDefault)
	v.SetDefault("app.port", AppPortDefault)
	v.SetDefault("app.timezone", TzDefault)
	v.SetDefault("log.level", int(LogLevelDefault))
	v.SetDefault("mongo.host", MongoHostDefault)
	v.SetDefault("mongo.port", MongoPortDefault)

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
