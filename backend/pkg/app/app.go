package app

import "github.com/Nesquiko/wac/pkg/data"

func New(db data.Db) App {
	return App{db}
}

type App struct {
	db data.Db
}
