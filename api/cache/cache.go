// pkg/cache/cache.go
package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8" // Use go-redis/redis/v8 (v9 is also available, but v8 is more widely used)
	"github.com/prometheus/client_golang/prometheus"
)

// Cache defines the interface for a generic cache.
type Cache[T any] interface {
	Get(ctx context.Context, key string) (T, error)
	Set(ctx context.Context, key string, value T, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
	SetNX(ctx context.Context, key string, value T, ttl time.Duration) (bool, error) // Optional: Set if Not Exists
	Close() error
}

// RedisCache implements the Cache interface using Redis.
type RedisCache[T any] struct {
	client  *redis.Client
	metrics *cacheMetrics
}

// Config holds the Redis configuration.
type Config struct {
	Address      string        `json:"address"`
	Password     string        `json:"password"`
	DB           int           `json:"db"`
	DialTimeout  time.Duration `json:"dial_timeout"`
	ReadTimeout  time.Duration `json:"read_timeout"`
	WriteTimeout time.Duration `json:"write_timeout"`
	PoolSize     int           `json:"pool_size"`
	MinIdleConns int           `json:"min_idle_conns"`
}

// DefaultConfig provides default Redis configuration values.
func DefaultConfig() *Config {
	return &Config{
		Address:      "localhost:6379",
		Password:     "",
		DB:           0,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     10,
		MinIdleConns: 5,
	}
}

// NewRedisCache creates a new RedisCache instance.
func NewRedisCache[T any](cfg *Config, registerer prometheus.Registerer) (*RedisCache[T], error) {
	if cfg == nil {
		cfg = DefaultConfig()
	}

	client := redis.NewClient(&redis.Options{
		Addr:         cfg.Address,
		Password:     cfg.Password,
		DB:           cfg.DB,
		DialTimeout:  cfg.DialTimeout,
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		PoolSize:     cfg.PoolSize,
		MinIdleConns: cfg.MinIdleConns,
	})

	// Ping the Redis server to check the connection.
	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	metrics := newCacheMetrics("my_application", "redis_cache", registerer) // Or use your application's namespace

	return &RedisCache[T]{
		client:  client,
		metrics: metrics,
	}, nil
}

// Get retrieves a value from the cache.
func (c *RedisCache[T]) Get(ctx context.Context, key string) (T, error) {
	var value T
	start := time.Now()

	val, err := c.client.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			c.metrics.recordMiss()
			return value, ErrCacheMiss // Return a specific error for cache misses.
		}
		c.metrics.recordError("get")
		return value, fmt.Errorf("redis get error: %w", err)
	}

	if err := json.Unmarshal([]byte(val), &value); err != nil {
		c.metrics.recordError("unmarshal")
		return value, fmt.Errorf("failed to unmarshal value: %w", err)
	}

	c.metrics.recordHit(time.Since(start).Seconds())
	return value, nil
}

// Set stores a value in the cache.
func (c *RedisCache[T]) Set(ctx context.Context, key string, value T, ttl time.Duration) error {
	start := time.Now()

	val, err := json.Marshal(value)
	if err != nil {
		c.metrics.recordError("marshal")
		return fmt.Errorf("failed to marshal value: %w", err)
	}

	if err := c.client.Set(ctx, key, val, ttl).Err(); err != nil {
		c.metrics.recordError("set")
		return fmt.Errorf("redis set error: %w", err)
	}

	c.metrics.recordSet(time.Since(start).Seconds())
	return nil
}

// Delete removes a value from the cache.
func (c *RedisCache[T]) Delete(ctx context.Context, key string) error {
	start := time.Now()
	if err := c.client.Del(ctx, key).Err(); err != nil {
		c.metrics.recordError("delete")
		return fmt.Errorf("redis delete error: %w", err)
	}
	c.metrics.recordDelete(time.Since(start).Seconds())
	return nil
}

// SetNX sets a value in the cache only if the key does not already exist.
func (c *RedisCache[T]) SetNX(ctx context.Context, key string, value T, ttl time.Duration) (bool, error) {
	start := time.Now()

	val, err := json.Marshal(value)
	if err != nil {
		c.metrics.recordError("marshal")
		return false, fmt.Errorf("failed to marshal value: %w", err)
	}

	ok, err := c.client.SetNX(ctx, key, val, ttl).Result()
	if err != nil {
		c.metrics.recordError("setnx")
		return false, fmt.Errorf("redis setnx error: %w", err)
	}
	c.metrics.recordSetNX(time.Since(start).Seconds(), ok) // Record success/failure
	return ok, nil
}

// Close closes the Redis connection.
func (c *RedisCache[T]) Close() error {
	return c.client.Close()
}

// ErrCacheMiss is a sentinel error to indicate a cache miss.
var ErrCacheMiss = fmt.Errorf("cache miss")

// --- Metrics ---

type cacheMetrics struct {
	hits          *prometheus.CounterVec
	misses        *prometheus.CounterVec
	sets          *prometheus.CounterVec
	deletes       *prometheus.CounterVec
	setNX         *prometheus.CounterVec
	errors        *prometheus.CounterVec
	hitLatency    *prometheus.HistogramVec
	setLatency    *prometheus.HistogramVec
	deleteLatency *prometheus.HistogramVec
	setNXLatency  *prometheus.HistogramVec
}

func newCacheMetrics(namespace, subsystem string, registerer prometheus.Registerer) *cacheMetrics {
	m := &cacheMetrics{
		hits: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "hits_total",
				Help:      "Total number of cache hits.",
			},
			[]string{},
		),
		misses: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "misses_total",
				Help:      "Total number of cache misses.",
			},
			[]string{},
		),
		sets: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "sets_total",
				Help:      "Total number of cache sets.",
			},
			[]string{},
		),
		deletes: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "deletes_total",
				Help:      "Total number of cache deletes.",
			},
			[]string{},
		),
		setNX: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "setnx_total",
				Help:      "Total number of SetNX operations.",
			},
			[]string{"success"}, // Label for success (true/false)
		),
		errors: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "errors_total",
				Help:      "Total number of cache errors.",
			},
			[]string{"operation"},
		),
		hitLatency: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "hit_latency_seconds",
				Help:      "Cache hit latency in seconds.",
				Buckets:   prometheus.ExponentialBuckets(0.0001, 2, 15), // 100µs to ~16s
			},
			[]string{},
		),
		setLatency: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "set_latency_seconds",
				Help:      "Cache set latency in seconds.",
				Buckets:   prometheus.ExponentialBuckets(0.0001, 2, 15), // 100µs to ~16s
			},
			[]string{},
		),
		deleteLatency: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "delete_latency_seconds",
				Help:      "Cache delete latency in seconds.",
				Buckets:   prometheus.ExponentialBuckets(0.0001, 2, 15), // 100µs to ~16s
			},
			[]string{},
		),
		setNXLatency: prometheus.NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: namespace,
				Subsystem: subsystem,
				Name:      "setnx_latency_seconds",
				Help:      "Cache SetNX latency in seconds.",
				Buckets:   prometheus.ExponentialBuckets(0.0001, 2, 15), // 100µs to ~16s
			},
			[]string{},
		),
	}

	// Register metrics with the provided registerer.
	if registerer != nil {
		registerer.MustRegister(
			m.hits, m.misses, m.sets, m.deletes, m.errors, m.setNX,
			m.hitLatency, m.setLatency, m.deleteLatency, m.setNXLatency,
		)
	} else {
		prometheus.MustRegister(
			m.hits, m.misses, m.sets, m.deletes, m.errors, m.setNX,
			m.hitLatency, m.setLatency, m.deleteLatency, m.setNXLatency,
		)
	}

	return m
}

func (m *cacheMetrics) recordHit(latency float64) {
	m.hits.WithLabelValues().Inc()
	m.hitLatency.WithLabelValues().Observe(latency)
}
func (m *cacheMetrics) recordMiss() {
	m.misses.WithLabelValues().Inc()
}
func (m *cacheMetrics) recordSet(latency float64) {
	m.sets.WithLabelValues().Inc()
	m.setLatency.WithLabelValues().Observe(latency)
}
func (m *cacheMetrics) recordDelete(latency float64) {
	m.deletes.WithLabelValues().Inc()
	m.deleteLatency.WithLabelValues().Observe(latency)
}
func (m *cacheMetrics) recordSetNX(latency float64, success bool) {
	m.setNX.WithLabelValues(fmt.Sprintf("%t", success)).Inc() // Convert bool to string
	m.setNXLatency.WithLabelValues().Observe(latency)
}

func (m *cacheMetrics) recordError(operation string) {
	m.errors.WithLabelValues(operation).Inc()
}
