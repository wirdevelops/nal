package utils

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

var ErrNoIPFound = errors.New("no IP address found")

type contextKey string

const (
	ipAddressKey contextKey = "ipAddress"

	CtxKeyIPAddress contextKey = "ipAddress"

	fiberCtxKey contextKey = "fiberContext" // Key for Fiber context
)

// GetIPAddress retrieves the IP address from the context.
func GetIPAddress(ctx context.Context) (string, error) {
	if ip, ok := ctx.Value(ipAddressKey).(string); ok && ip != "" {
		return ip, nil
	}

	if fastCtx, ok := ctx.Value(fiberCtxKey).(*fiber.Ctx); ok {
		return getIPFromFastHTTPRequest(fastCtx)
	}

	if req, ok := ctx.Value("http.Request").(*http.Request); ok {
		return getIPFromRequest(req)
	}

	return "", ErrNoIPFound
}

func getIPFromRequest(r *http.Request) (string, error) {
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		ips := strings.Split(xff, ",")
		ip := strings.TrimSpace(ips[0])
		if net.ParseIP(ip) == nil {
			return "", fmt.Errorf("invalid IP in X-Forwarded-For: %s", ip)
		}
		return ip, nil
	}

	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		if net.ParseIP(xri) == nil {
			return "", fmt.Errorf("invalid IP in X-Real-IP: %s", xri)
		}
		return xri, nil
	}

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		if net.ParseIP(r.RemoteAddr) != nil {
			return r.RemoteAddr, nil
		}
		return "", fmt.Errorf("error processing RemoteAddr: %w", err)
	}
	if net.ParseIP(ip) == nil {
		return "", fmt.Errorf("invalid IP in RemoteAddr: %s", ip)
	}
	return ip, nil
}

func getIPFromFastHTTPRequest(c *fiber.Ctx) (string, error) {
	ip := c.IP()
	if ip != "" {
		if net.ParseIP(ip) == nil {
			return "", fmt.Errorf("invalid IP address from c.IP(): %s", ip)
		}
		return ip, nil
	}
	xff := string(c.Request().Header.Peek("X-Forwarded-For"))
	if xff != "" {
		ips := strings.Split(xff, ",")
		for _, possibleIP := range ips {
			trimmedIP := strings.TrimSpace(possibleIP)
			if net.ParseIP(trimmedIP) != nil {
				return trimmedIP, nil
			}
		}

	}

	xri := string(c.Request().Header.Peek("X-Real-IP"))
	if xri != "" {
		if net.ParseIP(xri) == nil {
			return "", fmt.Errorf("invalid IP in X-Real-IP: %s", xri)
		}
		return xri, nil
	}

	return "", ErrNoIPFound
}

// SetIPAddressInContext is middleware for net/http.
func SetIPAddressInContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, err := getIPFromRequest(r)
		if err != nil {
			log.Printf("Error getting IP (net/http): %v", err)
			ip = "unknown"
		}
		//Crucially, we store the *http.Request in the context
		ctx := context.WithValue(r.Context(), "http.Request", r) //net/http context key
		ctx = context.WithValue(ctx, ipAddressKey, ip)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// SetIPAddressInContextFiber is middleware for Fiber.
func SetIPAddressInContextFiber(logger *log.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ip, err := getIPFromFastHTTPRequest(c)
		if err != nil {
			logger.Printf("Fiber: Error getting IP: %v", err)
			ip = "unknown"
		}

		ctx := context.WithValue(c.UserContext(), fiberCtxKey, c) // Store *fiber.Ctx
		ctx = context.WithValue(ctx, ipAddressKey, ip)
		c.SetUserContext(ctx)
		return c.Next()
	}
}
