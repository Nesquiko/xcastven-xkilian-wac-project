package data

import "context"

type Db interface {
	Disconnect(context.Context) error
}

