package handlers

import (
	"fmt"
	"nalevel/middleware"
	"nalevel/models"
	"nalevel/repositories"
	"nalevel/services"
	"nalevel/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AdminHandler handles admin-related requests.
type AdminHandler struct {
	userService       services.UserServiceInterface
	auditService      services.AuditLogServiceInterface
	roleService       services.RolePermissionServiceInterface
	onboardingService services.OnboardingServiceInterface
	profileService    services.ProfileServiceInterface
}

// NewAdminHandler creates a new AdminHandler.
func NewAdminHandler(
	userService services.UserServiceInterface,
	auditService services.AuditLogServiceInterface,
	roleService services.RolePermissionServiceInterface,
	onboardingService services.OnboardingServiceInterface,
	profileService services.ProfileServiceInterface,
) *AdminHandler {
	return &AdminHandler{
		userService:       userService,
		auditService:      auditService,
		roleService:       roleService,
		onboardingService: onboardingService,
		profileService:    profileService,
	}
}

func (h *AdminHandler) ApplyRoutes(app *fiber.App) {
	adminGroup := app.Group("/api/v1/admin")
	adminGroup.Use(middleware.AdminOnly())

	adminGroup.Post("/users", h.createUser)                       // Create a user (admin-specific).
	adminGroup.Post("/users/:id/roles", h.addRole)                // Add a role (admin-specific).
	adminGroup.Put("/users/:id/status", h.setUserStatus)          // Moved from UserHandler
	adminGroup.Get("/users", h.listUsers)                         // Example admin-specific list (maybe with more details)
	adminGroup.Delete("/users/:id/roles/:role", h.removeUserRole) //moved from user handler

	adminGroup.Get("/audit-logs", h.getAuditLogs)
	adminGroup.Get("/audit-logs/user/:userID", h.getAuditLogsByUser)
	adminGroup.Get("/audit-logs/action/:action", h.getAuditLogsByAction)

	adminGroup.Post("/roles", h.createRole)
	adminGroup.Get("/roles", h.listRoles)                              // List all roles (admin-specific)
	adminGroup.Get("/roles/:name/permissions", h.getRolePermissions)   // Get permissions for a role
	adminGroup.Post("/roles/:name/permissions", h.addPermissions)      // Add permissions
	adminGroup.Delete("/roles/:name/permissions", h.removePermissions) // Remove permissions.
	adminGroup.Put("/roles/:name/disable", h.disableRole)
	adminGroup.Put("/roles/:name/enable", h.enableRole)

	adminGroup.Get("/users/:id/onboarding/stage", h.getOnboardingStageAdmin) // Admin-only
	adminGroup.Put("/users/:id/onboarding/advance", h.advanceOnboardingAdmin)

	adminGroup.Get("/profiles", h.listProfiles)                              // List all profiles (admin-only, with filtering)
	adminGroup.Get("/profiles/skill/:skill", h.findProfilesBySkill)          // Find profiles by skill (admin)
	adminGroup.Get("/profiles/location/:location", h.findProfilesByLocation) // Find by location (admin)
	adminGroup.Get("/profiles/count/role/:role", h.countProfilesByRole)      // Count by role (admin)
	adminGroup.Put("/profiles/actor/:id", h.updateActorProfile)              // Update actor profile (admin)
	adminGroup.Put("/profiles/producer/:id", h.updateProducerProfile)        // Update producer profile (admin)
	adminGroup.Put("/profiles/crew/:id", h.updateCrewProfile)                // Update crew profile (admin)
	adminGroup.Put("/profiles/project-owner/:id", h.updateProjectOwnerProfile)
	adminGroup.Put("/profiles/vendor/:id", h.updateVendorProfile)           // Update vendor profile (admin)
	adminGroup.Put("/profiles/ngo/:id", h.updateNgoProfile)                 // Update NGO profile (admin)
	adminGroup.Put("/profiles/admin/:id", h.updateAdminProfile)             // Update admin profile (admin)
	adminGroup.Put("/profiles/volunteer/:id", h.updateVolunteerProfile)     // Update volunteer profile (admin)
	adminGroup.Put("/profiles/beneficiary/:id", h.updateBeneficiaryProfile) // Update beneficiary profile (admin)
	adminGroup.Put("/profiles/donor/:id", h.updateDonorProfile)             // Update donor profile (admin)
	adminGroup.Put("/profiles/partner/:id", h.updatePartnerProfile)         // Update partner profile (admin)
	adminGroup.Put("/profiles/seller/:id", h.updateSellerProfile)           // Update seller profile (admin)
	adminGroup.Put("/profiles/employee/:id", h.updateEmployeeProfile)       // Update employee profile (admin)
	// Added missing profile endpoints
	adminGroup.Get("/profiles/:id", h.getProfile)
	adminGroup.Delete("/profiles/:id", h.deleteProfile)

	adminGroup.Get("/users/:id", h.getUserByID)   // Moved and updated from UserHandler
	adminGroup.Put("/users/:id", h.updateUser)    // Moved and updated from UserHandler
	adminGroup.Delete("/users/:id", h.deleteUser) // Moved and kept from UserHandler

}

// createUser creates a new user (admin-specific).
func (h *AdminHandler) createUser(c *fiber.Ctx) error {
	var req struct {
		Name     string   `json:"name"`
		Email    string   `json:"email"`
		Password string   `json:"password"` // You might want a separate "initial password" flow
		Roles    []string `json:"roles"`
	}

	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	// You *could* use the AuthService here to handle password hashing,
	// but since this is admin-specific, you might do it directly:
	hashedPassword, err := utils.HashPassword(req.Password, 10) // Adjust cost as needed
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to hash password"))
	}

	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword, // Store the hashed password

	}

	createdUser, err := h.userService.CreateUserWithRoles(c.Context(), user, req.Roles)
	if err != nil {
		if errors.Is(err, services.ErrUserAlreadyExists) {
			return respondError(c, http.StatusConflict, err)
		} else if errors.Is(err, services.ErrInvalidRole) {
			return respondError(c, http.StatusBadRequest, err) // 400 for invalid roles
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to create user"))
	}

	return respondCreated(c, fiber.Map{"id": createdUser.ID}) // Return the ID
}

func (h *AdminHandler) addRole(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	var req struct {
		Role string `json:"role"`
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.userService.AddUserRole(c.Context(), userID, req.Role); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		} else if errors.Is(err, services.ErrInvalidRole) || errors.Is(err, services.ErrRoleAlreadyExists) {
			return respondError(c, http.StatusBadRequest, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to add role"))
	}

	return respondOK(c, fiber.Map{"message": "Role added successfully"})
}

func (h *AdminHandler) removeUserRole(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	roleToRemove := c.Params("role")
	if roleToRemove == "" { // Added check for empty role parameter
		return respondError(c, http.StatusBadRequest, errors.New("role parameter is required"))
	}

	if err := h.userService.RemoveUserRole(c.Context(), userID, roleToRemove); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		} else if errors.Is(err, services.ErrInvalidRole) {
			return respondError(c, http.StatusBadRequest, err)
		} else if errors.Is(err, services.ErrCannotRemoveRole) {
			return respondError(c, http.StatusForbidden, err) // 403
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to remove user role"))
	}

	return respondOK(c, fiber.Map{"message": "User role removed successfully"})
}

func (h *AdminHandler) setUserStatus(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	var req struct {
		Status string `json:"status" validate:"required,oneof=active inactive suspended"` // Validate status
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}
	if err := validate.Struct(req); err != nil {
		return respondError(c, http.StatusBadRequest, fmt.Errorf("validation error: %w", err))
	}

	if err := h.userService.UpdateUserStatus(c.Context(), userID, req.Status); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to update user status"))
	}

	return respondOK(c, fiber.Map{"message": "User status updated successfully"})
}

func (h *AdminHandler) listUsers(c *fiber.Ctx) error {
	page, limit := getPaginationParams(c) // Helper function (see below)
	filter := getFilterParams(c)          // Helper function (see below)

	users, totalCount, err := h.userService.ListUsers(c.Context(), filter, page, limit)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to list users"))
	}

	//  Return a simplified user list (avoid sensitive fields).
	userList := make([]fiber.Map, 0, len(users))
	for _, user := range users {
		userList = append(userList, fiber.Map{
			"id":       user.ID,
			"name":     user.Name,
			"email":    user.Email,
			"roles":    user.Roles,
			"status":   user.Status,
			"location": user.Location,
		})
	}

	return respondOK(c, fiber.Map{
		"users":      userList,
		"totalCount": totalCount,
		"page":       page,
		"limit":      limit,
	})
}

func (h *AdminHandler) getAuditLogs(c *fiber.Ctx) error {
	page, limit := getPaginationParams(c)
	startTime, endTime, err := getTimeRangeParams(c)
	if err != nil {
		return respondError(c, http.StatusBadRequest, err)
	}
	lastID := c.Query("lastID")
	logs, totalCount, nextLastID, err := h.auditService.GetAllLogs(c.UserContext(), startTime, endTime, page, limit, lastID)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get audit logs"))
	}

	return respondOK(c, fiber.Map{
		"logs":       logs,
		"totalCount": totalCount,
		"page":       page,
		"limit":      limit,
		"lastID":     nextLastID,
	})
}

func (h *AdminHandler) getAuditLogsByUser(c *fiber.Ctx) error {
	userIDStr := c.Params("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	page, limit := getPaginationParams(c) // From query params, you have this implemented
	startTime, endTime, err := getTimeRangeParams(c)
	if err != nil {
		return respondError(c, http.StatusBadRequest, err)
	}

	// Get the "lastID" parameter for pagination.
	lastID := c.Query("lastID")

	logs, totalCount, nextLastID, err := h.auditService.GetLogsByUser(c.UserContext(), userID, startTime, endTime, page, limit, lastID) // Pass lastID
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get audit logs by user"))
	}

	return respondOK(c, fiber.Map{
		"logs":       logs,
		"totalCount": totalCount,
		"page":       page,
		"limit":      limit,
		"lastID":     nextLastID, // Return the last ID for the next page
	})
}

func (h *AdminHandler) getAuditLogsByAction(c *fiber.Ctx) error {
	action := c.Params("action")
	if action == "" { // Basic input validation
		return respondError(c, http.StatusBadRequest, errors.New("action parameter is required"))
	}

	page, limit := getPaginationParams(c)
	startTime, endTime, err := getTimeRangeParams(c)
	if err != nil {
		return respondError(c, http.StatusBadRequest, err)
	}

	// Get the "lastID" parameter for pagination.
	lastID := c.Query("lastID")

	logs, totalCount, nextLastID, err := h.auditService.GetLogsByAction(c.UserContext(), action, startTime, endTime, page, limit, lastID) // Pass lastID and action
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get audit logs by action"))
	}

	return respondOK(c, fiber.Map{
		"logs":       logs,
		"totalCount": totalCount,
		"page":       page,
		"limit":      limit,
		"lastID":     nextLastID, // Return the last ID for the next page
	})
}

// Helper function to get start and end time from query parameters
func getTimeRangeParams(c *fiber.Ctx) (*time.Time, *time.Time, error) {
	startTimeStr := c.Query("startTime")
	endTimeStr := c.Query("endTime")

	var startTime, endTime *time.Time

	if startTimeStr != "" {
		st, err := time.Parse(time.RFC3339, startTimeStr)
		if err != nil {
			return nil, nil, errors.New("invalid startTime format (use RFC3339)")
		}
		startTime = &st
	}

	if endTimeStr != "" {
		et, err := time.Parse(time.RFC3339, endTimeStr)
		if err != nil {
			return nil, nil, errors.New("invalid endTime format (use RFC3339)")
		}
		endTime = &et
	}

	return startTime, endTime, nil
}

// createRole creates a new role.
func (h *AdminHandler) createRole(c *fiber.Ctx) error {
	var req struct {
		Name        string   `json:"name" validate:"required,alphanum"`
		Permissions []string `json:"permissions"`
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.roleService.CreateRole(c.Context(), req.Name, req.Permissions); err != nil {
		// Handle specific errors (e.g., role already exists, validation errors)
		if errors.Is(err, services.ErrRoleAlreadyExists) {
			return respondError(c, http.StatusConflict, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to create role"))
	}

	return respondCreated(c, fiber.Map{"message": "Role created successfully"})
}

func (h *AdminHandler) listRoles(c *fiber.Ctx) error {
	roles, err := h.roleService.GetAllRoles(c.Context())
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to list roles"))
	}

	return respondOK(c, fiber.Map{"roles": roles})
}

func (h *AdminHandler) getRolePermissions(c *fiber.Ctx) error {
	roleName := c.Params("name")
	permissions, err := h.roleService.GetRolePermissions(c.Context(), roleName)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) { // Assuming your repo returns ErrNotFound
			return respondError(c, http.StatusNotFound, errors.New("role not found"))
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get role permissions"))
	}

	return respondOK(c, fiber.Map{"permissions": permissions})
}

func (h *AdminHandler) addPermissions(c *fiber.Ctx) error {
	roleName := c.Params("name")
	var req struct {
		Permissions []string `json:"permissions" validate:"required"`
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.roleService.AddPermissionsToRole(c.Context(), roleName, req.Permissions); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, errors.New("role not found"))
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to add permissions"))
	}

	return respondOK(c, fiber.Map{"message": "Permissions added successfully"})
}

func (h *AdminHandler) removePermissions(c *fiber.Ctx) error {
	roleName := c.Params("name")
	var req struct {
		Permissions []string `json:"permissions" validate:"required"`
	}

	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.roleService.RemovePermissionsFromRole(c.Context(), roleName, req.Permissions); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, errors.New("role not found"))
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to remove permissions"))
	}

	return respondOK(c, fiber.Map{"message": "Permissions removed successfully"})
}

func (h *AdminHandler) disableRole(c *fiber.Ctx) error {
	roleName := c.Params("name")
	if err := h.roleService.DisableRole(c.Context(), roleName); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to disable role"))
	}
	return respondOK(c, fiber.Map{"message": "Role disabled successfully"})
}

func (h *AdminHandler) enableRole(c *fiber.Ctx) error {
	roleName := c.Params("name")
	if err := h.roleService.EnableRole(c.Context(), roleName); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to enable role"))
	}
	return respondOK(c, fiber.Map{"message": "Role enabled successfully"})
}

func (h *AdminHandler) getOnboardingStageAdmin(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	stage, err := h.onboardingService.GetCurrentOnboardingStage(c.UserContext(), userID)
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get onboarding stage"))
	}

	return respondOK(c, fiber.Map{"stage": stage})
}

// advanceOnboardingAdmin advances the onboarding stage for a user (admin only).
func (h *AdminHandler) advanceOnboardingAdmin(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	var req struct {
		Stage string                 `json:"stage" validate:"required"`
		Data  map[string]interface{} `json:"data"` // Optional data
	}
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.onboardingService.AdvanceOnboarding(c.UserContext(), userID, req.Stage, req.Data); err != nil {
		// Handle specific errors (e.g., invalid stage, user not found)
		return respondError(c, http.StatusBadRequest, err) // Or 404, 500 depending on the error
	}

	return respondOK(c, fiber.Map{"message": "Onboarding stage advanced"})
}

func (h *AdminHandler) listProfiles(c *fiber.Ctx) error {
	// Extract query parameters.  Fiber makes this easy.
	role := c.Query("role")
	skill := c.Query("skill")
	location := c.Query("location")
	skipStr := c.Query("skip")
	limitStr := c.Query("limit")
	sort := c.Query("sort", "_id") // Default sort by ID

	// Convert skip and limit to integers, with error handling.
	var skip, limit int64
	var err error
	if skipStr != "" {
		skip, err = strconv.ParseInt(skipStr, 10, 64)
		if err != nil {
			return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid skip value: %w", err))
		}
	}
	if limitStr != "" {
		limit, err = strconv.ParseInt(limitStr, 10, 64)
		if err != nil {
			return respondError(c, http.StatusBadRequest, fmt.Errorf("invalid limit value: %w", err))
		}
	}
	if limit == 0 { // important: sets default limit
		limit = 10
	}
	// Build the filter.
	filter := make(map[string]interface{})
	if role != "" {
		filter["role"] = role
	}
	if skill != "" {
		filter["skills"] = skill // Assuming skills is a string array in your model
	}
	if location != "" {
		filter["location"] = location
	}

	// Call the service method.
	profiles, err := h.profileService.ListProfiles(c.Context(), filter, skip, limit, sort)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}

	return respondOK(c, profiles)
}

// --- Profile CRUD (Admin) ---

func (h *AdminHandler) getProfile(c *fiber.Ctx) error {
	profileIDStr := c.Params("id")
	profileID, err := primitive.ObjectIDFromHex(profileIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid profile ID"))
	}

	profile, err := h.profileService.GetProfileByID(c.Context(), profileID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err) // 404 for not found
		}
		return respondError(c, http.StatusInternalServerError, err)
	}
	return respondOK(c, profile)
}

func (h *AdminHandler) findProfilesBySkill(c *fiber.Ctx) error {
	skill := c.Params("skill")
	profiles, err := h.profileService.FindProfilesBySkill(c.Context(), skill)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}
	return respondOK(c, profiles)
}

func (h *AdminHandler) findProfilesByLocation(c *fiber.Ctx) error {
	location := c.Params("location")
	profiles, err := h.profileService.FindProfilesByLocation(c.Context(), location)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}
	return respondOK(c, profiles)
}

func (h *AdminHandler) countProfilesByRole(c *fiber.Ctx) error {
	role := c.Params("role")
	count, err := h.profileService.CountProfilesByRole(c.Context(), role)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, err)
	}
	return respondOK(c, fiber.Map{"count": count})
}

func (h *AdminHandler) updateActorProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleActor)
}
func (h *AdminHandler) updateProducerProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleProducer)
}
func (h *AdminHandler) updateCrewProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleCrew)
}
func (h *AdminHandler) updateProjectOwnerProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleProjectOwner)
}

func (h *AdminHandler) updateVendorProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleVendor)
}
func (h *AdminHandler) updateNgoProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleNGO)
}
func (h *AdminHandler) updateAdminProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleAdmin)
}
func (h *AdminHandler) updateVolunteerProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleVolunteer)
}

func (h *AdminHandler) updateBeneficiaryProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleBeneficiary)
}
func (h *AdminHandler) updateDonorProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleDonor)
}

func (h *AdminHandler) updatePartnerProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RolePartner)
}

func (h *AdminHandler) updateSellerProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleSeller)
}

func (h *AdminHandler) updateEmployeeProfile(c *fiber.Ctx) error {
	return h.updateSpecificProfile(c, models.RoleEmployee)
}
func (h *AdminHandler) deleteProfile(c *fiber.Ctx) error {
	profileIDStr := c.Params("id")
	profileID, err := primitive.ObjectIDFromHex(profileIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid profile ID"))
	}

	if err := h.profileService.DeleteProfile(c.Context(), profileID); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return respondError(c, http.StatusNotFound, err) // 404
		}
		return respondError(c, http.StatusInternalServerError, err) // 500
	}
	return respondOK(c, fiber.Map{"message": "Profile deleted successfully"})
}

func (h *AdminHandler) updateSpecificProfile(c *fiber.Ctx, role string) error {
	profileIDStr := c.Params("id")
	profileID, err := primitive.ObjectIDFromHex(profileIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid profile ID"))
	}

	// Create the correct profile type based on the role.
	profile, err := models.GenerateProfile(primitive.NewObjectID(), role) // ID doesn't matter here
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid role for update"))
	}

	if err := c.BodyParser(profile); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	// Call the appropriate update method on the service based on the role.
	switch role {
	case models.RoleActor:
		err = h.profileService.UpdateActorProfile(c.UserContext(), profileID, profile.(*models.ActorProfile))
	case models.RoleProducer:
		err = h.profileService.UpdateProducerProfile(c.UserContext(), profileID, profile.(*models.ProducerProfile))
	case models.RoleCrew:
		err = h.profileService.UpdateCrewProfile(c.UserContext(), profileID, profile.(*models.CrewProfile))
	case models.RoleProjectOwner:
		err = h.profileService.UpdateProjectOwnerProfile(c.UserContext(), profileID, profile.(*models.ProjectOwnerProfile))
	case models.RoleVendor:
		err = h.profileService.UpdateVendorProfile(c.UserContext(), profileID, profile.(*models.VendorProfile))
	case models.RoleNGO:
		err = h.profileService.UpdateNgoProfile(c.UserContext(), profileID, profile.(*models.NgoProfile))
	case models.RoleAdmin:
		err = h.profileService.UpdateAdminProfile(c.UserContext(), profileID, profile.(*models.AdminProfile))
	case models.RoleVolunteer:
		err = h.profileService.UpdateVolunteerProfile(c.UserContext(), profileID, profile.(*models.VolunteerProfile))
	case models.RoleBeneficiary:
		err = h.profileService.UpdateBeneficiaryProfile(c.UserContext(), profileID, profile.(*models.BeneficiaryProfile))
	case models.RoleDonor:
		err = h.profileService.UpdateDonorProfile(c.UserContext(), profileID, profile.(*models.DonorProfile))
	case models.RolePartner:
		err = h.profileService.UpdatePartnerProfile(c.UserContext(), profileID, profile.(*models.PartnerProfile))
	case models.RoleSeller:
		err = h.profileService.UpdateSellerProfile(c.UserContext(), profileID, profile.(*models.SellerProfile))
	case models.RoleEmployee:
		err = h.profileService.UpdateEmployeeProfile(c.UserContext(), profileID, profile.(*models.EmployeeProfile))

	default:
		return respondError(c, http.StatusBadRequest, errors.New("invalid role for update"))
	}

	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to update profile"))
	}

	return respondOK(c, fiber.Map{"message": "Profile updated successfully"})
}

func getFilterParams(c *fiber.Ctx) map[string]interface{} {
	filter := make(map[string]interface{})

	// Example: Get filter parameters for "name", "email", "status"
	if name := c.Query("name"); name != "" {
		filter["name"] = name
	}
	if email := c.Query("email"); email != "" {
		filter["email"] = email
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}

	if role := c.Query("roles"); role != "" {
		filter["roles"] = role
	}

	if location := c.Query("location"); location != "" {
		filter["location"] = location
	}

	if createdAt := c.Query("createdAt"); createdAt != "" {
		filter["createdAt"] = createdAt
	}

	if updatedAt := c.Query("updatedAt"); updatedAt != "" {
		filter["updatedAt"] = updatedAt
	}

	// Add more filter parameters as needed.

	return filter
}

func (h *AdminHandler) getUserByID(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	user, err := h.userService.GetUserByID(c.Context(), userID)
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get user"))
	}

	// As an admin, you might return more complete user data.
	return respondOK(c, user)
}

func (h *AdminHandler) updateUser(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	var updateData map[string]interface{}
	if err := c.BodyParser(&updateData); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request body"))
	}

	if err := h.userService.UpdateUserDetails(c.Context(), userID, updateData); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to update user"))
	}

	return respondOK(c, fiber.Map{"message": "User updated successfully"})
}

func (h *AdminHandler) deleteUser(c *fiber.Ctx) error {
	userIDStr := c.Params("id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return respondError(c, http.StatusBadRequest, errors.New("invalid user ID"))
	}

	if err := h.userService.DeleteUser(c.Context(), userID); err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to delete user"))
	}

	return respondOK(c, fiber.Map{"message": "User deleted successfully"})
}
