package handlers

import "context"

type NotificationHandler interface {
	Send(ctx context.Context, userID string, data map[string]string) error
	Supports(channel string) bool
}
