package handlers

import (
	"fmt"
	"net/http"

	"nalevel/middleware"
	"nalevel/models" // Import models to check for valid roles
	"nalevel/repositories"
	"nalevel/services"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProfileHandler struct {
	profileService services.ProfileServiceInterface
	mid            *middleware.AuthMiddleware
}

var validate = validator.New() // Initialize validator once

func NewProfileHandler(profileService services.ProfileServiceInterface, mid *middleware.AuthMiddleware) *ProfileHandler {
	return &ProfileHandler{
		profileService: profileService,
		mid:            mid,
	}
}

func (h *ProfileHandler) ApplyRoutes(app *fiber.App) {
	profileGroup := app.Group("/api/v1/profiles")
	profileGroup.Use(h.mid.JWTProtected())

	profileGroup.Post("/", h.createProfile)
	profileGroup.Get("/:profileID", h.getProfileByID)
	profileGroup.Get("/user/:userID", h.getProfilesByUserID)
	profileGroup.Put("/:profileID", h.updateProfile)
	profileGroup.Delete("/:profileID", h.deleteProfile)
}

func (h *ProfileHandler) createProfile(c *fiber.Ctx) error {
	userID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	var req struct {
		Role string                 `json:"role" validate:"required"`
		Data map[string]interface{} `json:"data"`
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid request body: %w", err))
	}

	if err := validate.Struct(req); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("validation error: %w", err))
	}

	// Authorization: Check if the role is valid
	if !isValidRole(req.Role) { // isValidRole function
		return respondError(c, http.StatusBadRequest, errors.New("invalid role"))
	}
	if err := h.profileService.CreateProfile(c.Context(), userID, req.Role, req.Data); err != nil {
		// Handle specific errors, like duplicate profiles
		if errors.Is(err, repositories.ErrDuplicateKey) {
			return respondError(c, http.StatusConflict, err) // 409 Conflict
		}
		return respondError(c, http.StatusInternalServerError, err)
	}

	return respondCreated(c, fiber.Map{"message": "Profile created"})
}

func (h *ProfileHandler) getProfileByID(c *fiber.Ctx) error {
	profileIDStr := c.Params("profileID")
	profileID, err := primitive.ObjectIDFromHex(profileIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid profile ID: %w", err))
	}

	profile, err := h.profileService.GetProfileByID(c.Context(), profileID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err) // 404 Not Found
		}
		return respondError(c, http.StatusInternalServerError, err)
	}
	// Authorization: Check if the user has permission to access this profile
	userID, err := GetUserIDFromContextFiber(c) //get the userId to compare
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}
	// Ensure profile and profile.(map[string]interface{}) are not nil
	if profile == nil {
		return respondError(c, http.StatusNotFound, errors.New("profile not found or nil"))
	}
	profileMap, ok := profile.(map[string]interface{})
	if !ok {
		return respondError(c, http.StatusInternalServerError, errors.New("profile data is not in the expected format"))
	}

	// Safely access "user_id" field
	profileUserIDValue, exists := profileMap["user_id"]
	if !exists {
		return respondError(c, http.StatusInternalServerError, errors.New("user_id field not found in profile"))
	}

	profileUserID, ok := profileUserIDValue.(primitive.ObjectID)
	if !ok {

		return respondError(c, http.StatusInternalServerError, errors.New("profile user ID is not a valid ObjectID"))
	}
	// Check if the user IDs match
	if profileUserID.Hex() != userID.Hex() {
		return respondError(c, http.StatusForbidden, errors.New("unauthorized access to profile"))
	}

	return respondOK(c, profile)
}

func (h *ProfileHandler) getProfilesByUserID(c *fiber.Ctx) error {
	userIDStr := c.Params("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid user ID: %w", err))
	}

	// Authorization: Only allow users to see their own profiles.
	authUserID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}
	if userID.Hex() != authUserID.Hex() {
		return respondError(c, http.StatusForbidden, errors.New("unauthorized to access these profiles"))
	}

	profiles, err := h.profileService.GetProfilesByUserID(c.Context(), userID)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}

	return respondOK(c, profiles)
}

func (h *ProfileHandler) updateProfile(c *fiber.Ctx) error {
	profileIDStr := c.Params("profileID")
	profileID, err := primitive.ObjectIDFromHex(profileIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid profile ID: %w", err))
	}

	var data map[string]interface{}
	if err := c.BodyParser(&data); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid request body: %w", err))
	}

	//Authorization: Fetch the profile and check ownership.
	existingProfile, err := h.profileService.GetProfileByID(c.Context(), profileID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, err)
	}

	// Ensure existingProfile and existingProfile.(map[string]interface{}) are not nil
	if existingProfile == nil {
		return respondError(c, http.StatusNotFound, errors.New("profile not found or nil"))
	}

	existingProfileMap, ok := existingProfile.(map[string]interface{})
	if !ok {
		return respondError(c, http.StatusInternalServerError, errors.New("existing profile data is not in expected format"))
	}

	// Safely access "user_id" field
	profileUserIDValue, exists := existingProfileMap["user_id"]
	if !exists {
		return respondError(c, http.StatusInternalServerError, errors.New("user_id field not found in existing profile"))
	}

	profileUserID, ok := profileUserIDValue.(primitive.ObjectID) //type assertion
	if !ok {
		return respondError(c, http.StatusInternalServerError, errors.New("profile user ID is not valid object ID"))
	}

	authUserID, err := GetUserIDFromContextFiber(c) //get the userId from token
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	if profileUserID.Hex() != authUserID.Hex() {
		return respondError(c, http.StatusForbidden, errors.New("unauthorized to update this profile"))
	}

	if err := h.profileService.UpdateProfile(c.Context(), profileID, data); err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}

	return respondOK(c, fiber.Map{"message": "Profile updated"})
}

func (h *ProfileHandler) deleteProfile(c *fiber.Ctx) error {
	profileIDStr := c.Params("profileID")
	profileID, err := primitive.ObjectIDFromHex(profileIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid profile ID: %w", err))
	}

	// Authorization: Fetch the profile and check ownership.
	existingProfile, err := h.profileService.GetProfileByID(c.Context(), profileID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, err)
	}

	// Ensure existingProfile and existingProfile.(map[string]interface{}) are not nil
	if existingProfile == nil {
		return respondError(c, http.StatusNotFound, errors.New("profile not found or nil"))
	}

	existingProfileMap, ok := existingProfile.(map[string]interface{})
	if !ok {
		return respondError(c, http.StatusInternalServerError, errors.New("existing profile data is not in expected format"))
	}

	// Safely access "user_id" field
	profileUserIDValue, exists := existingProfileMap["user_id"]
	if !exists {
		return respondError(c, http.StatusInternalServerError, errors.New("user_id field not found in existing profile"))
	}

	profileUserID, ok := profileUserIDValue.(primitive.ObjectID)
	if !ok {
		return respondError(c, http.StatusInternalServerError, errors.New("profile user id is not valid"))
	}
	authUserID, err := GetUserIDFromContextFiber(c)
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}
	if profileUserID.Hex() != authUserID.Hex() {
		return respondError(c, http.StatusForbidden, errors.New("unauthorized to delete this profile"))
	}

	if err := h.profileService.DeleteProfile(c.Context(), profileID); err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}

	return respondOK(c, fiber.Map{"message": "Profile deleted"})
}

func isValidRole(role string) bool {
	switch role {
	case
		models.RoleActor,
		models.RoleAdmin,
		models.RoleBeneficiary,
		models.RoleCrew,
		models.RoleDonor,
		models.RoleEmployee,
		models.RoleNGO,
		models.RolePartner,
		models.RoleProducer,
		models.RoleProjectOwner,
		models.RoleSeller,
		models.RoleVendor,
		models.RoleVolunteer:
		return true // Fixed: Use boolean true, not string
	default:
		return false // Fixed: Use boolean false, not string
	}
}
