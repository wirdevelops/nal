package audit

import (
	"context"
	"nalevel/models"
	"nalevel/services"
	"nalevel/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// UserServiceAuditDecorator decorates UserService with audit logging.
type UserServiceAuditDecorator struct {
	service services.UserServiceInterface
	audit   services.AuditLogServiceInterface
	logger  *zap.Logger
}

// NewUserServiceAuditDecorator creates a new audit logging decorator for UserService.
func NewUserServiceAuditDecorator(service services.UserServiceInterface, auditService services.AuditLogServiceInterface, logger *zap.Logger) *UserServiceAuditDecorator {
	return &UserServiceAuditDecorator{
		service: service,
		audit:   auditService,
		logger:  logger,
	}
}

// --- Decorated Methods ---

func (d *UserServiceAuditDecorator) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string) // Get IP from context
	createdUser, err := d.service.CreateUser(ctx, user)

	details := map[string]interface{}{
		"email": user.Email, // Log the email from the *input* user
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "create_user_failed", nil, details, ip) // No userID yet
		return nil, err
	}

	userID := createdUser.ID
	details["userID"] = userID.Hex() // Log created user ID
	d.audit.Log(ctx, "user_created", &userID, details, ip)
	return createdUser, nil
}

func (d *UserServiceAuditDecorator) CreateUserWithRoles(ctx context.Context, user *models.User, roles []string) (*models.User, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	createdUser, err := d.service.CreateUserWithRoles(ctx, user, roles)

	details := map[string]interface{}{
		"email": user.Email,
		"roles": roles,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "create_user_with_roles_failed", nil, details, ip)
		return nil, err
	}

	userID := createdUser.ID
	details["userID"] = userID.Hex()
	d.audit.Log(ctx, "user_created_with_roles", &userID, details, ip)
	return createdUser, nil
}

func (d *UserServiceAuditDecorator) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	user, err := d.service.GetUserByID(ctx, id)

	details := map[string]interface{}{
		"userID": id.Hex(),
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "get_user_by_id_failed", &id, details, ip) // Log the ID even on failure
		return nil, err
	}

	// Do NOT log the entire user object.  Just log the ID.
	d.audit.Log(ctx, "get_user_by_id", &id, details, ip)
	return user, nil
}

func (d *UserServiceAuditDecorator) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	user, err := d.service.GetUserByEmail(ctx, email)

	details := map[string]interface{}{
		"email": email, // Log the email used for the lookup
	}
	if err != nil {
		details["error"] = err.Error()
		// Try to get the userID, if available
		if user != nil {
			userID := user.ID
			details["userID"] = userID.Hex()
			d.audit.Log(ctx, "get_user_by_email_failed", &userID, details, ip)

		} else {
			d.audit.Log(ctx, "get_user_by_email_failed", nil, details, ip) // No userID available.
		}
		return nil, err
	}
	userID := user.ID
	details["userID"] = userID.Hex()
	d.audit.Log(ctx, "get_user_by_email", &userID, details, ip)
	return user, nil
}

func (d *UserServiceAuditDecorator) UpdateUserDetails(ctx context.Context, userID primitive.ObjectID, updateData map[string]interface{}) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.UpdateUserDetails(ctx, userID, updateData)

	details := map[string]interface{}{
		"userID":     userID.Hex(),
		"updateData": updateData, // Log the update data, but be mindful of sensitive fields
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "update_user_details_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_details_updated", &userID, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) UpdateUserRoles(ctx context.Context, id primitive.ObjectID, roles []string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.UpdateUserRoles(ctx, id, roles)
	details := map[string]interface{}{
		"userID": id.Hex(),
		"roles":  roles,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "update_user_roles_failed", &id, details, ip)
		return err
	}
	d.audit.Log(ctx, "user_roles_updated", &id, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) UpdateUserStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.UpdateUserStatus(ctx, id, status)

	details := map[string]interface{}{
		"userID": id.Hex(),
		"status": status,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "update_user_status_failed", &id, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_status_updated", &id, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) UpdateUserSettings(ctx context.Context, userID primitive.ObjectID, settings models.UserSettings) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.UpdateUserSettings(ctx, userID, settings)
	details := map[string]interface{}{
		"userID":   userID.Hex(),
		"settings": settings, // Be careful logging the entire settings object. Consider logging only specific, non-sensitive settings.
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "update_user_settings_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_settings_updated", &userID, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) DeleteUser(ctx context.Context, id primitive.ObjectID) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.DeleteUser(ctx, id)
	details := map[string]interface{}{
		"userID": id.Hex(),
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "delete_user_failed", &id, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_deleted", &id, details, ip) // Log before the deletion, more reliable.
	return nil
}

func (d *UserServiceAuditDecorator) ListUsers(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string) // Get IP

	users, totalCount, err := d.service.ListUsers(ctx, filter, page, limit)
	details := map[string]interface{}{
		"filter":     filter,
		"page":       page,
		"limit":      limit,
		"totalCount": totalCount,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "list_users_failed", nil, details, ip) // No user IDs in this case.
		return nil, 0, err
	}

	// Log the *number* of users returned, not the user data itself.
	details["returnedCount"] = len(users)
	d.audit.Log(ctx, "list_users", nil, details, ip) // No specific user ID
	return users, totalCount, nil
}

func (d *UserServiceAuditDecorator) SetUserActiveRole(ctx context.Context, userID primitive.ObjectID, role string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.SetUserActiveRole(ctx, userID, role)

	details := map[string]interface{}{
		"userID": userID.Hex(),
		"role":   role,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "set_user_active_role_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_active_role_set", &userID, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) AddUserRole(ctx context.Context, userID primitive.ObjectID, newRole string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.AddUserRole(ctx, userID, newRole)

	details := map[string]interface{}{
		"userID":  userID.Hex(),
		"newRole": newRole,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "add_user_role_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_role_added", &userID, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) RemoveUserRole(ctx context.Context, userID primitive.ObjectID, roleToRemove string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.RemoveUserRole(ctx, userID, roleToRemove)

	details := map[string]interface{}{
		"userID":       userID.Hex(),
		"roleToRemove": roleToRemove,
	}

	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "remove_user_role_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_role_removed", &userID, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) ActivateUser(ctx context.Context, userID primitive.ObjectID) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.ActivateUser(ctx, userID)
	details := map[string]interface{}{
		"userID": userID.Hex(),
	}
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "activate_user_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_activated", &userID, details, ip)
	return nil
}

func (d *UserServiceAuditDecorator) DeactivateUser(ctx context.Context, userID primitive.ObjectID) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	err := d.service.DeactivateUser(ctx, userID)

	details := map[string]interface{}{
		"userID": userID.Hex(),
	}
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "deactivate_user_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "user_deactivated", &userID, details, ip)
	return nil
}
