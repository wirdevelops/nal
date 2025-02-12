// utils/log.go
package utils

import (
	"context"
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func init() {
	zerolog.TimeFieldFormat = time.RFC3339Nano

	// Configure pretty console output when running locally.
	if os.Getenv("APP_ENV") == "local" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})
	}
}

// LogError logs an error with context information.
func LogError(ctx context.Context, message string, err error) {
	log.Error().
		Err(err).
		Str("trace_id", getTraceID(ctx)). // Assuming you have a trace ID in context
		Msg(message)
}

// LogInfo logs an info message with context.
func LogInfo(ctx context.Context, message string) {
	log.Info().
		Str("trace_id", getTraceID(ctx)).
		Msg(message)
}

// getTraceID retrieves a trace ID from the context (example).  Adapt to your tracing implementation.
func getTraceID(ctx context.Context) string {
	// Adapt this to how you store your trace ID in the context.
	// Example using a context key:
	// traceID := ctx.Value(traceIDKey).(string)
	// return traceID

	return "unknown" // Or return an empty string if no trace ID is found
}
