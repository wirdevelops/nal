package utils

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// RateLimiter provides rate limiting functionality based on a given identifier (e.g., IP address, user ID).
type RateLimiter struct {
	mu         sync.RWMutex
	limits     map[string]*rateLimiterWrapper // identifier -> rate.Limiter
	cleanupTkr *time.Ticker                   // Ticker for periodic cleanup
	config     RateLimitConfig                // Configuration parameters
}

// RateLimiterWrapper wraps the standard rate.Limiter and adds a last-used timestamp.
type rateLimiterWrapper struct {
	limiter  *rate.Limiter
	lastUsed time.Time
}

// RateLimitConfig encapsulates the rate limiting parameters.
type RateLimitConfig struct {
	DefaultRate  rate.Limit    // Default requests per second
	DefaultBurst int           // Default maximum burst size
	CleanupIntvl time.Duration // Interval for cleaning up expired limiters
	Expiration   time.Duration // Duration after which a limiter is considered expired
}

// NewRateLimiter creates a new RateLimiter instance.
func NewRateLimiter(config RateLimitConfig) *RateLimiter {
	// Set default values if not provided
	if config.CleanupIntvl == 0 {
		config.CleanupIntvl = 5 * time.Minute
	}
	if config.Expiration == 0 {
		config.Expiration = 10 * time.Minute // Default expiration
	}

	rl := &RateLimiter{
		limits:     make(map[string]*rateLimiterWrapper),
		cleanupTkr: time.NewTicker(config.CleanupIntvl),
		config:     config,
	}

	go rl.cleanupExpired() // Start the cleanup goroutine
	return rl
}

// Allow checks if the given identifier is allowed to perform an action based on the rate limit.
func (rl *RateLimiter) Allow(identifier string) bool {
	limiter := rl.getLimiter(identifier)
	return limiter.Allow() // Check if the limiter allows the action
}

// getLimiter retrieves or creates a rate limiter for the given identifier.
func (rl *RateLimiter) getLimiter(identifier string) *rate.Limiter {
	wrapper := rl.getLimiterWrapper(identifier)
	return wrapper.limiter // Check if the limiter allows the action
}

// getLimiterWrapper retrieves or creates a rate limiter wrapper for the given identifier.
func (rl *RateLimiter) getLimiterWrapper(identifier string) *rateLimiterWrapper {
	rl.mu.RLock()
	wrapper, exists := rl.limits[identifier]
	rl.mu.RUnlock()

	if exists {
		wrapper.lastUsed = time.Now()
		return wrapper // Return the existing limiter
	}

	// Create a new limiter if it doesn't exist
	rl.mu.Lock()
	defer rl.mu.Unlock()

	// Double-check if another goroutine created the limiter in the meantime
	wrapper, exists = rl.limits[identifier]
	if exists {
		wrapper.lastUsed = time.Now()
		return wrapper
	}

	// Create a new rate limiter with the default rate and burst
	newLimiter := rate.NewLimiter(rl.config.DefaultRate, rl.config.DefaultBurst)
	wrapper = &rateLimiterWrapper{limiter: newLimiter, lastUsed: time.Now()}

	rl.limits[identifier] = wrapper
	return wrapper
}

// cleanupExpired periodically removes expired limiters from the map.
func (rl *RateLimiter) cleanupExpired() {
	for range rl.cleanupTkr.C {
		rl.mu.Lock()
		now := time.Now() // Get the current time once for consistency
		for key, wrapper := range rl.limits {
			if now.Sub(wrapper.lastUsed) > rl.config.Expiration {
				delete(rl.limits, key) // Remove the limiter if it's expired
			}
		}
		rl.mu.Unlock()
	}
}

// UpdateRate allows updating the rate limit for a given identifier.
func (rl *RateLimiter) UpdateRate(identifier string, newRate rate.Limit, burst int) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	if wrapper, exists := rl.limits[identifier]; exists {
		wrapper.limiter.SetLimit(newRate) // Update the rate limit
		wrapper.limiter.SetBurst(burst)   // Update the burst size
	}
}

// package utils

// import (
// 	"sync"
// 	"time"
// )

// type RateLimiter struct {
// 	requests map[string]*requestCount
// 	mu       sync.Mutex
// 	max      int
// 	window   time.Duration
// }

// type requestCount struct {
// 	count    int
// 	lastSeen time.Time
// }

// func NewRateLimiter(max int, window time.Duration) *RateLimiter {
// 	rl := &RateLimiter{
// 		requests: make(map[string]*requestCount),
// 		max:      max,
// 		window:   window,
// 	}
// 	go rl.cleanup()
// 	return rl
// }

// func (rl *RateLimiter) IsLimited(ip string) bool {
// 	rl.mu.Lock()
// 	defer rl.mu.Unlock()

// 	now := time.Now()
// 	if rc, exists := rl.requests[ip]; exists {
// 		if now.Sub(rc.lastSeen) < rl.window {
// 			rc.count++
// 			rc.lastSeen = now
// 			return rc.count > rl.max
// 		}
// 		delete(rl.requests, ip)
// 	}
// 	rl.requests[ip] = &requestCount{count: 1, lastSeen: now}
// 	return false
// }

// func (rl *RateLimiter) cleanup() {
// 	for {
// 		time.Sleep(rl.window)
// 		rl.mu.Lock()
// 		now := time.Now()
// 		for ip, rc := range rl.requests {
// 			if now.Sub(rc.lastSeen) > rl.window {
// 				delete(rl.requests, ip)
// 			}
// 		}
// 		rl.mu.Unlock()
// 	}
// }

// func (rl *RateLimiter) Increment(ip string) {
// 	rl.mu.Lock()
// 	defer rl.mu.Unlock()

// 	now := time.Now()
// 	if rc, exists := rl.requests[ip]; exists {
// 		if now.Sub(rc.lastSeen) < rl.window {
// 			rc.count++
// 			rc.lastSeen = now
// 			return
// 		}
// 	}
// 	rl.requests[ip] = &requestCount{count: 1, lastSeen: now}
// }
