// events/events.go
package events

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"time"

	"nalevel/config" // Your config package
	"nalevel/metrics"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
)

// Event, Metadata remain the same ...
type Event struct {
	ID        string    `json:"id"`        // Unique event ID
	Source    string    `json:"source"`    // Service that generated the event
	Type      string    `json:"type"`      // Event type for routing
	Version   string    `json:"version"`   // Schema version
	Data      any       `json:"data"`      // Event payload
	Metadata  Metadata  `json:"metadata"`  // Additional context
	Timestamp time.Time `json:"timestamp"` // Event creation time
}

type Metadata struct {
	TraceID       string            `json:"trace_id"`
	UserID        string            `json:"user_id,omitempty"`
	CorrelationID string            `json:"correlation_id,omitempty"`
	Tags          map[string]string `json:"tags,omitempty"`
}

type KafkaEventManager struct {
	writer     *kafka.Writer
	reader     *kafka.Reader
	logger     *zap.Logger
	metrics    *metrics.Metrics //  Add metrics.Metrics field
	config     *config.KafkaConfig
	middleware []EventMiddleware
	ctx        context.Context    // Add context
	cancel     context.CancelFunc // Add cancel function
}

type EventMiddleware func(Event) Event

// Option defines a functional option for configuring the KafkaEventManager.
type Option func(*KafkaEventManager)

// WithMiddleware adds event middleware to the manager.
func WithMiddleware(middleware ...EventMiddleware) Option {
	return func(k *KafkaEventManager) {
		k.middleware = append(k.middleware, middleware...)
	}
}

// WithContext allows to set a context for all operations of this manager.
func WithContext(ctx context.Context) Option {
	return func(kem *KafkaEventManager) {
		kem.ctx, kem.cancel = context.WithCancel(ctx)
	}
}

func NewKafkaEventManager(cfg *config.KafkaConfig, logger *zap.Logger, opts ...Option) (*KafkaEventManager, error) {
	if err := validateConfig(cfg); err != nil {
		return nil, fmt.Errorf("invalid config: %w", err)
	}

	// --- Metrics Initialization ---
	metricsOpts := metrics.DefaultMetricOptions("nalevel_empire", "Kafka") //  Change to your service name
	m := metrics.NewMetrics(metricsOpts)                                   // Initialize metrics

	writer := kafka.NewWriter(kafka.WriterConfig{
		Brokers:      cfg.Brokers,
		Topic:        cfg.Topic,
		Balancer:     &kafka.LeastBytes{},
		WriteTimeout: cfg.WriteTimeout,
		ReadTimeout:  cfg.ReadTimeout,
		BatchSize:    cfg.BatchSize,
		BatchTimeout: cfg.BatchTimeout,
		RequiredAcks: cfg.RequiredAcks, // Use config value, cast correctly
		Async:        false,
	})

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:           cfg.Brokers,
		Topic:             cfg.Topic,
		GroupID:           cfg.GroupID,
		MinBytes:          cfg.MinBytes,
		MaxBytes:          cfg.MaxBytes,
		HeartbeatInterval: cfg.HeartbeatInterval,
		SessionTimeout:    cfg.SessionTimeout,
		ReadBackoffMin:    cfg.RetryBackoff,
		ReadBackoffMax:    cfg.RetryBackoff * 10,
		ReadLagInterval:   cfg.HeartbeatInterval,
		//StartOffset:       kafka.FirstOffset,  // Use config for flexibility
	})

	// Set StartOffset based on configuration
	switch cfg.AutoOffsetReset {
	case "earliest":
		reader.SetOffset(kafka.FirstOffset)
	case "latest":
		reader.SetOffset(kafka.LastOffset) //  Use LastOffset
	default:
		return nil, fmt.Errorf("invalid AutoOffsetReset value: %s", cfg.AutoOffsetReset)
	}

	ctx, cancel := context.WithCancel(context.Background()) // Create context
	kem := &KafkaEventManager{
		writer:     writer,
		reader:     reader,
		logger:     logger,
		metrics:    m, // Store metrics instance
		config:     cfg,
		middleware: []EventMiddleware{}, // Initialize the slice
		ctx:        ctx,                 // Store context
		cancel:     cancel,              // Store cancel function
	}

	// Apply options
	for _, opt := range opts {
		opt(kem)
	}

	// Start the rebalance monitoring goroutine:

	go kem.monitorRebalances(kem.ctx) // Pass the manager's context

	return kem, nil
}

// monitorRebalances periodically checks the reader stats and logs rebalances.
func (k *KafkaEventManager) monitorRebalances(ctx context.Context) {
	// Use a ticker for periodic checks:
	ticker := time.NewTicker(5 * time.Second) // Check every 5 seconds (adjust as needed)
	defer ticker.Stop()

	var lastRebalanceCount int64 // Keep track of the last seen rebalance count

	for {
		select {
		case <-ctx.Done():
			return // Exit when context is cancelled
		case <-ticker.C:
			stats := k.reader.Stats() // Get the reader statistics
			if stats.Rebalances > lastRebalanceCount {
				k.logger.Info("Consumer group rebalance detected",
					zap.Int64("rebalances", stats.Rebalances),
					zap.Int64("fetches", stats.Fetches),
					zap.Int64("messages", stats.Messages),
					zap.Int64("offset", stats.Offset),
					zap.String("partition", stats.Partition), // Log partition as int
					zap.Int64("lag", stats.Lag),
					zap.String("client_id", stats.ClientID),
					zap.String("topic", stats.Topic),
				)
				// Optionally, record the rebalance in your metrics:
				k.metrics.RecordOperation("kafka", "rebalance", k.config.Topic, 0, 0, 0)
				lastRebalanceCount = stats.Rebalances // Update the last seen count
			}
		}
	}
}

// Publish, Subscribe, publishToDLQ, and generateEventID remain largely the same

func (k *KafkaEventManager) Publish(ctx context.Context, event Event) error {
	start := time.Now()

	for _, mw := range k.middleware {
		event = mw(event)
	}

	if event.ID == "" {
		event.ID = generateEventID()
	}
	if event.Timestamp.IsZero() {
		event.Timestamp = time.Now().UTC()
	}

	value, err := json.Marshal(event)
	if err != nil {
		k.metrics.RecordError("kafka", "publish", k.config.Topic, "marshal_error")
		return fmt.Errorf("error marshaling event: %w", err)
	}

	msg := kafka.Message{
		Key:   []byte(event.ID),
		Value: value,
		Headers: []kafka.Header{
			{Key: "event_type", Value: []byte(event.Type)},
			{Key: "source", Value: []byte(event.Source)},
			{Key: "trace_id", Value: []byte(event.Metadata.TraceID)},
		},
	}

	var lastErr error
	for i := 0; i <= k.config.MaxRetries; i++ {
		if err := k.writer.WriteMessages(ctx, msg); err != nil {
			lastErr = err
			k.logger.Warn("Failed to publish event",
				zap.String("event_id", event.ID),
				zap.String("event_type", event.Type),
				zap.Int("attempt", i+1),
				zap.Error(err),
			)
			backoff := k.config.RetryBackoff * time.Duration(math.Pow(2, float64(i)))
			time.Sleep(backoff)
			k.metrics.RecordRetry("kafka", "publish", k.config.Topic, float64(i+1))
			k.metrics.RecordError("kafka", "publish", k.config.Topic, "kafka_error")
			continue
		}

		k.metrics.RecordOperation("kafka", "publish", k.config.Topic, time.Since(start).Seconds(), len(value), 0) // Batch size is 0 for single messages
		return nil
	}

	k.metrics.RecordError("kafka", "publish", k.config.Topic, "max_retries_exceeded")
	return fmt.Errorf("failed to publish event after %d retries: %w", k.config.MaxRetries, lastErr)
}

func (k *KafkaEventManager) Subscribe(ctx context.Context, handler func(context.Context, Event) error) error {
	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		<-ctx.Done()
		return k.Close()
	})

	g.Go(func() error {
		for {
			select {
			case <-ctx.Done():
				return ctx.Err()
			default:
				start := time.Now()
				msg, err := k.reader.ReadMessage(ctx)
				if err != nil {
					if err == context.Canceled {
						return nil
					}
					k.metrics.RecordError("kafka", "consume", k.config.Topic, "read_error")
					k.logger.Error("Failed to read message", zap.Error(err), zap.Int64("offset", msg.Offset))
					continue
				}

				var event Event
				if err := json.Unmarshal(msg.Value, &event); err != nil {
					k.metrics.RecordError("kafka", "consume", k.config.Topic, "unmarshal_error")
					k.logger.Error("Failed to unmarshal event",
						zap.Binary("message", msg.Value),
						zap.Error(err),
						zap.Int64("offset", msg.Offset),
					)
					if k.config.DLQTopic != "" {
						if dlqErr := k.publishToDLQ(ctx, msg, err); dlqErr != nil {
							k.logger.Error("Failed to publish to DLQ", zap.Error(dlqErr))
						}
					}
					continue
				}

				for _, mw := range k.middleware {
					event = mw(event)
				}

				if err := handler(ctx, event); err != nil {
					k.metrics.RecordError("kafka", "consume", k.config.Topic, "handler_error")
					k.logger.Error("Failed to handle event",
						zap.String("event_id", event.ID),
						zap.String("event_type", event.Type),
						zap.Error(err),
						zap.Int64("offset", msg.Offset),
					)

					if k.config.DLQTopic != "" {
						if dlqErr := k.publishToDLQ(ctx, msg, err); dlqErr != nil {
							k.logger.Error("Failed to publish to DLQ", zap.Error(dlqErr))
						}
					}
					continue
				}

				k.metrics.RecordOperation("kafka", "consume", k.config.Topic, time.Since(start).Seconds(), len(msg.Value), 1) // Assuming batch size of 1
			}
		}
	})

	return g.Wait()
}

func (k *KafkaEventManager) publishToDLQ(ctx context.Context, msg kafka.Message, originalError error) error {
	dlqMsg := kafka.Message{
		Key:   []byte(uuid.NewString()),
		Value: msg.Value,
		Headers: append(msg.Headers, kafka.Header{
			Key: "original_error",
			// events/events.go (continued)

			Value: []byte(originalError.Error()),
		},
			kafka.Header{
				Key:   "original_topic",
				Value: []byte(msg.Topic),
			},
			kafka.Header{
				Key:   "original_offset",
				Value: []byte(fmt.Sprintf("%d", msg.Offset)),
			},
		),
	}
	var lastErr error
	for i := 0; i <= k.config.MaxRetries; i++ {
		writer := kafka.NewWriter(kafka.WriterConfig{
			Brokers: k.config.Brokers,
			Topic:   k.config.DLQTopic,
		})
		if err := writer.WriteMessages(ctx, dlqMsg); err != nil {
			lastErr = err
			k.logger.Warn("Failed to publish event to dlq",
				zap.Int("attempt", i+1),
				zap.Error(err),
			)
			k.metrics.RecordRetry("kafka", "publish_dlq", k.config.DLQTopic, float64(i+1))
			k.metrics.RecordError("kafka", "publish_dlq", k.config.DLQTopic, "kafka_error")

			backoff := k.config.RetryBackoff * time.Duration(math.Pow(2, float64(i)))
			time.Sleep(backoff)
			continue
		}
		k.metrics.RecordOperation("kafka", "publish_dlq", k.config.DLQTopic, 0, len(dlqMsg.Value), 0) // No latency tracking for DLQ
		return nil
	}
	k.metrics.RecordError("kafka", "publish_dlq", k.config.DLQTopic, "max_retries_exceeded")
	return fmt.Errorf("failed to publish to DLQ after %d retries: %w", k.config.MaxRetries, lastErr)
}

func (k *KafkaEventManager) Close() error {
	k.cancel() // Cancel the context
	if err := k.writer.Close(); err != nil {
		return fmt.Errorf("failed to close writer: %w", err)
	}
	if err := k.reader.Close(); err != nil {
		return fmt.Errorf("failed to close reader: %w", err)
	}
	return nil
}

func generateEventID() string {
	return uuid.New().String()
}

// validateConfig checks if the Kafka configuration is valid
func validateConfig(cfg *config.KafkaConfig) error {
	if cfg == nil {
		return fmt.Errorf("config cannot be nil")
	}
	if len(cfg.Brokers) == 0 {
		return fmt.Errorf("at least one broker must be specified")
	}
	if cfg.Topic == "" {
		return fmt.Errorf("topic must be specified")
	}
	if cfg.GroupID == "" {
		return fmt.Errorf("group ID must be specified for consumers")
	}
	return nil
}
