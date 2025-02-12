package metrics

import (
	"fmt"
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Metrics holds a collection of Prometheus metrics for general-purpose monitoring.
type Metrics struct {
	// Counters
	operationsTotal  *prometheus.CounterVec
	errorsTotal      *prometheus.CounterVec
	deadLettersTotal *prometheus.CounterVec
	reconnectsTotal  *prometheus.CounterVec

	// Histograms
	operationLatencySeconds *prometheus.HistogramVec
	messageSizeBytes        *prometheus.HistogramVec
	batchSizeMessages       *prometheus.HistogramVec
	retryCount              *prometheus.HistogramVec

	// Gauges
	resourceLength *prometheus.GaugeVec
	resourceLag    *prometheus.GaugeVec
	// Add more gauges as needed, perhaps connection status, etc.

	// Registry for these metrics (allows for testing and multiple registries)
	registerer prometheus.Registerer
}

// MetricOptions allows customization of the Metrics.
type MetricOptions struct {
	Namespace          string
	Subsystem          string // Added subsystem for more organization
	Registerer         prometheus.Registerer
	LatencyBuckets     []float64
	MessageSizeBuckets []float64
	BatchSizeBuckets   []float64
	RetryCountBuckets  []float64
}

// DefaultMetricOptions provides sensible default values.
func DefaultMetricOptions(namespace, subsystem string) MetricOptions {
	return MetricOptions{
		Namespace:          namespace,
		Subsystem:          subsystem,
		Registerer:         prometheus.DefaultRegisterer,
		LatencyBuckets:     prometheus.ExponentialBuckets(0.001, 2, 10), // 1ms to ~1s
		MessageSizeBuckets: prometheus.ExponentialBuckets(100, 2, 10),   // 100B to ~100KB
		BatchSizeBuckets:   prometheus.LinearBuckets(0, 10, 10),         // 0 to 90 in steps of 10
		RetryCountBuckets:  prometheus.LinearBuckets(0, 1, 6),           // 0 to 5 retries
	}
}

// NewMetrics creates a new Metrics instance.
func NewMetrics(opts MetricOptions) *Metrics {
	if opts.Registerer == nil {
		opts.Registerer = prometheus.DefaultRegisterer
	}

	m := &Metrics{
		registerer: opts.Registerer,

		// Counters
		operationsTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "operations_total",
				Help:      "Total number of operations.",
			},
			[]string{"component", "operation", "resource"},
		),

		errorsTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "errors_total",
				Help:      "Total number of errors.",
			},
			[]string{"component", "operation", "resource", "error_type"},
		),

		deadLettersTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "dead_letters_total",
				Help:      "Total number of messages sent to a dead letter queue.",
			},
			[]string{"component", "operation", "resource", "error_type"},
		),

		reconnectsTotal: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "reconnects_total",
				Help:      "Total number of reconnection attempts.",
			},
			[]string{"component", "resource"},
		),

		// Histograms
		operationLatencySeconds: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "operation_latency_seconds",
				Help:      "Operation latency in seconds.",
				Buckets:   opts.LatencyBuckets,
			},
			[]string{"component", "operation", "resource"},
		),

		messageSizeBytes: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "message_size_bytes",
				Help:      "Size of messages in bytes.",
				Buckets:   opts.MessageSizeBuckets,
			},
			[]string{"component", "operation", "resource"},
		),

		batchSizeMessages: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "batch_size_messages",
				Help:      "Number of messages in a batch.",
				Buckets:   opts.BatchSizeBuckets,
			},
			[]string{"component", "operation", "resource"}, // Or use "direction" (in/out)
		),

		retryCount: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "retry_count",
				Help:      "Number of retries per operation.",
				Buckets:   opts.RetryCountBuckets,
			},
			[]string{"component", "operation", "resource"},
		),

		// Gauges
		resourceLength: prometheus.NewGaugeVec(
			prometheus.GaugeOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "resource_length",
				Help:      "Current length of a resource (e.g., queue length).",
			},
			[]string{"component", "resource", "partition"},
		),

		resourceLag: prometheus.NewGaugeVec(
			prometheus.GaugeOpts{
				Namespace: opts.Namespace,
				Subsystem: opts.Subsystem,
				Name:      "resource_lag",
				Help:      "Lag of a consumer or process behind the latest state.",
			},
			[]string{"component", "resource", "partition", "group"}, // Added "group"
		),
	}

	// Register all metrics with the provided registerer.
	m.registerer.MustRegister(
		m.operationsTotal,
		m.errorsTotal,
		m.deadLettersTotal,
		m.reconnectsTotal,
		m.operationLatencySeconds,
		m.messageSizeBytes,
		m.batchSizeMessages,
		m.retryCount,
		m.resourceLength,
		m.resourceLag,
	)
	return m
}

// Helper methods (more generic)

// RecordOperation records a successful operation.
func (m *Metrics) RecordOperation(component, operation, resource string, latency float64, messageSize int, batchSize int) {
	m.operationsTotal.WithLabelValues(component, operation, resource).Inc()
	m.operationLatencySeconds.WithLabelValues(component, operation, resource).Observe(latency)
	if messageSize > 0 { // Only observe if message size is applicable
		m.messageSizeBytes.WithLabelValues(component, operation, resource).Observe(float64(messageSize))
	}
	if batchSize > 0 { // Only observe if batch size is applicable.
		m.batchSizeMessages.WithLabelValues(component, operation, resource).Observe(float64(batchSize))
	}
}

// RecordError records an error.
func (m *Metrics) RecordError(component, operation, resource, errorType string) {
	m.errorsTotal.WithLabelValues(component, operation, resource, errorType).Inc()
}

// RecordDeadLetter records a message being sent to a dead letter queue.
func (m *Metrics) RecordDeadLetter(component, operation, resource, errorType string) {
	m.deadLettersTotal.WithLabelValues(component, operation, resource, errorType).Inc()
}

// RecordReconnect records a reconnection attempt.
func (m *Metrics) RecordReconnect(component, resource string) {
	m.reconnectsTotal.WithLabelValues(component, resource).Inc()
}

// RecordRetry records the number of retries for an operation.
func (m *Metrics) RecordRetry(component, operation, resource string, count float64) {
	m.retryCount.WithLabelValues(component, operation, resource).Observe(count)
}

// RecordResourceLength sets the current length of a resource.
func (m *Metrics) RecordResourceLength(component, resource string, partition int, length float64) {
	m.resourceLength.WithLabelValues(component, resource, fmt.Sprintf("%d", partition)).Set(length)
}

// RecordResourceLag sets the lag of a consumer.
func (m *Metrics) RecordResourceLag(component, resource string, partition int, group string, lag float64) {
	m.resourceLag.WithLabelValues(component, resource, fmt.Sprintf("%d", partition), group).Set(lag)
}

// ExposeMetricsHandler provides an HTTP handler for Prometheus to scrape metrics.
func (m *Metrics) ExposeMetricsHandler() http.Handler {
	return promhttp.HandlerFor(m.registerer.(*prometheus.Registry), promhttp.HandlerOpts{})
}
