package handlers

import (
	"fmt"
	"net/http"

	"nalevel/middleware"
	"nalevel/models"
	"nalevel/services"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// UserHandler handles user-related requests.
type UserHandler struct {
	userService services.UserServiceInterface
	mid         *middleware.AuthMiddleware
}

// NewUserHandler creates a new UserHandler.
func NewUserHandler(
	userService services.UserServiceInterface,
	mid *middleware.AuthMiddleware,
) *UserHandler {
	return &UserHandler{
		userService: userService,
		mid:         mid,
	}
}

func (h *UserHandler) ApplyRoutes(app *fiber.App) {
	userGroup := app.Group("/api/v1/users")
	userGroup.Use(h.mid.JWTProtected())

	userGroup.Get("/me", h.getMe)                         // Get current user's profile.
	userGroup.Put("/me", h.updateMe)                      // Update current user's profile.
	userGroup.Delete("/me", h.deleteMe)                   // Soft delete current user.
	userGroup.Put("/me/active-role", h.setActiveRole)     //set active role
	userGroup.Patch("/me/settings", h.updateUserSettings) //update user settings
}

// getMe retrieves the currently logged-in user's information.
func (h *UserHandler) getMe(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c) // Use the helper function
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	user, err := h.userService.GetUserByID(c.Context(), userID)
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err) // Should not happen, but good to check
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get user"))
	}

	// Return a subset of user data (avoid sensitive fields).
	return respondOK(c, fiber.Map{
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"roles":      user.Roles,
		"status":     user.Status,
		"activeRole": user.ActiveRole,
		"location":   user.Location,
		// ... other non-sensitive fields ...
	})
}

// updateMe updates the currently logged-in user's information.
func (h *UserHandler) updateMe(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	var updateData map[string]interface{}
	if err := c.BodyParser(&updateData); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	delete(updateData, "password")
	delete(updateData, "is_verified")
	delete(updateData, "is_active")
	delete(updateData, "roles") // Roles have a dedicated endpoint

	// Restrict which fields the user can update.
	allowedFields := map[string]bool{
		"name":     true,
		"location": true,

		// Add other allowed fields here.  DO NOT include "roles", "status", "activeRole" here!
	}

	filteredUpdateData := make(map[string]interface{})
	for key, value := range updateData {
		if allowedFields[key] {
			filteredUpdateData[key] = value
		}
	}

	//if the filtered map is empty
	if len(filteredUpdateData) == 0 {
		return respondError(c, http.StatusBadRequest, errors.New("no valid fields to update"))
	}

	if err := h.userService.UpdateUserDetails(c.Context(), userID, filteredUpdateData); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err) // Shouldn't happen, but good to handle
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to update user"))
	}

	return respondOK(c, fiber.Map{"message": "User updated successfully"})
}

// deleteMe "deletes" (deactivates) the currently logged-in user's account.
func (h *UserHandler) deleteMe(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	// Instead of a hard delete, we'll likely just set the user's status to "inactive" or "deleted".
	if err := h.userService.UpdateUserStatus(c.Context(), userID, models.StatusInactive); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err) // Shouldn't happen
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to delete user"))
	}

	return respondOK(c, fiber.Map{"message": "User deactivated successfully"})
}

func (h *UserHandler) setActiveRole(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	var req struct {
		Role string `json:"role" validate:"required"`
	}

	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}
	if err := validate.Struct(req); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("validation error: %w", err))
	}

	if err := h.userService.SetUserActiveRole(c.Context(), userID, req.Role); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err) //404
		} else if errors.Is(err, services.ErrInvalidRole) {
			return respondError(c, http.StatusBadRequest, err) //400
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to set active role"))
	}

	return respondOK(c, fiber.Map{"message": "Active role set successfully"})
}

func (h *UserHandler) updateUserSettings(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	var settings models.UserSettings
	if err := c.BodyParser(&settings); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := validate.Struct(settings); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("validation error: %w", err))
	}
	if err := h.userService.UpdateUserSettings(c.Context(), userID, settings); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to update user settings"))
	}

	return respondOK(c, fiber.Map{"message": "User settings updated successfully"})
}
