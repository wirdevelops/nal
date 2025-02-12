package handlers

import (
	"fmt"
	"net/http"

	"nalevel/middleware"
	"nalevel/services"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

type OnboardingHandler struct {
	onboardingService services.OnboardingServiceInterface
	userService       services.UserServiceInterface // Inject UserService
	mid               *middleware.AuthMiddleware
}

func NewOnboardingHandler(onboardingService services.OnboardingServiceInterface, userService services.UserServiceInterface, mid *middleware.AuthMiddleware) *OnboardingHandler {
	return &OnboardingHandler{
		onboardingService: onboardingService,
		userService:       userService,
		mid:               mid,
	}
}

func (h *OnboardingHandler) ApplyRoutes(app *fiber.App) {
	onboardingGroup := app.Group("/api/v1/onboarding")
	onboardingGroup.Use(h.mid.JWTProtected())

	onboardingGroup.Post("/start", h.startOnboarding) // POST because we're creating a new state.
	onboardingGroup.Get("/status", h.getOnboardingStatus)
	onboardingGroup.Put("/basic-info", h.setBasicInfo)
	onboardingGroup.Put("/role-details", h.setRoleDetails)
	onboardingGroup.Put("/verification", h.setVerificationData)
	onboardingGroup.Post("/complete", h.completeOnboarding) // POST to signal completion

}
func (h *OnboardingHandler) startOnboarding(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, errors.New("unauthorized")) // Consistent error
	}

	var req struct {
		Roles []string `json:"roles" validate:"required,min=1"` // Validate: required, at least one role
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := validate.Struct(req); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("validation error: %w", err))
	}

	if err := h.onboardingService.StartOnboarding(c.UserContext(), userID, req.Roles); err != nil {
		return respondError(c, http.StatusBadRequest, err) // 400 for invalid roles, etc.
	}

	return respondOK(c, fiber.Map{"message": "Onboarding started"})
}

func (h *OnboardingHandler) getOnboardingStatus(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, errors.New("unauthorized"))
	}

	status, err := h.onboardingService.GetOnboardingStatus(c.UserContext(), userID)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get onboarding status"))
	}

	return respondOK(c, fiber.Map{"stage": status})
}

func (h *OnboardingHandler) setBasicInfo(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, errors.New("unauthorized"))
	}

	var data map[string]interface{}
	if err := c.BodyParser(&data); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.onboardingService.SetBasicInfo(c.UserContext(), userID, data); err != nil {
		return respondError(c, http.StatusBadRequest, err) // 400 if at wrong stage, or invalid data
	}

	return respondOK(c, fiber.Map{"message": "Basic info updated"})
}

func (h *OnboardingHandler) setRoleDetails(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, errors.New("unauthorized"))
	}

	var data map[string]interface{} // Flexible data
	if err := c.BodyParser(&data); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.onboardingService.SetRoleDetails(c.UserContext(), userID, data); err != nil {
		return respondError(c, http.StatusBadRequest, err) // Or 500 depending on the error
	}

	return respondOK(c, fiber.Map{"message": "Role details updated"})
}

func (h *OnboardingHandler) setVerificationData(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, errors.New("unauthorized"))
	}

	var data map[string]interface{}
	if err := c.BodyParser(&data); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.onboardingService.SetVerificationData(c.UserContext(), userID, data); err != nil {
		return respondError(c, http.StatusBadRequest, err)
	}

	return respondOK(c, fiber.Map{"message": "Verification data updated"})
}

func (h *OnboardingHandler) completeOnboarding(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, errors.New("unauthorized"))
	}

	if err := h.onboardingService.CompleteOnboarding(c.UserContext(), userID); err != nil {
		return respondError(c, http.StatusBadRequest, err) // 400 if not at the right stage
	}

	return respondOK(c, fiber.Map{"message": "Onboarding completed"})
}
