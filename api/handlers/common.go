// handlers/common.go

package handlers

import (
	"context"
	"net"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	ErrUserIDNotFound = errors.New("user id not found in context")
	ErrInvalidUserID  = errors.New("invalid user ID format")
)

// respondJSON is a helper function to send JSON responses.
func respondJSON(c *fiber.Ctx, statusCode int, payload interface{}) error {
	c.Set("Content-Type", "application/json")
	return c.Status(statusCode).JSON(payload)
}

// respondError is a helper function to send error responses.
func respondError(c *fiber.Ctx, statusCode int, err error) error {
	// Log the error (using your logging mechanism)
	// utils.LogError(c.Context(), "Handler error", err) // Example

	// Create a standardized error response structure.
	type errorResponse struct {
		Error string `json:"error"`
	}

	return respondJSON(c, statusCode, errorResponse{Error: err.Error()})
}

// respondOK sends a 200 OK response.
func respondOK(c *fiber.Ctx, payload interface{}) error {
	return respondJSON(c, http.StatusOK, payload)
}

// respondCreated sends a 201 Created response.
func respondCreated(c *fiber.Ctx, payload interface{}) error {
	return respondJSON(c, http.StatusCreated, payload)
}

// GetUserIDFromContext is a helper function to extract the user ID from the context.
// IMPORTANT: This assumes you have authentication middleware that adds the user ID to the context.
func GetUserIDFromContext(ctx context.Context) (primitive.ObjectID, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok {
		return primitive.NilObjectID, errors.New("user ID not found in context")
	}
	return primitive.ObjectIDFromHex(userID)
}

func GetUserIDFromContextFiber(c *fiber.Ctx) (primitive.ObjectID, error) {
	userIDStr := c.Locals("userID") // Key should match what you used in SetUserIDInContext
	if userIDStr == nil {
		return primitive.NilObjectID, ErrUserIDNotFound
	}
	userID, ok := userIDStr.(string)
	if !ok {
		return primitive.NilObjectID, ErrUserIDNotFound
	}

	oid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return primitive.NilObjectID, ErrInvalidUserID
	}
	return oid, nil
}

// GetIPAddress extracts the client's IP address from the request.
func GetIPAddress(r *http.Request) string {
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0]) // Return the *first* IP (client's original IP)
	}

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "unknown" // Return "unknown" if we can't parse
	}
	return ip // Return the parsed IP
}

func getPaginationParams(c *fiber.Ctx) (int, int) {
	page := c.QueryInt("page", 1)    // Default to page 1
	limit := c.QueryInt("limit", 10) // Default limit to 10

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	return page, limit
}
