package audit

import (
	"context"

	"nalevel/models"
	"nalevel/services"
	"nalevel/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// AuthServiceAuditDecorator decorates services.AuthService with audit logging.
type AuthServiceAuditDecorator struct {
	service services.AuthServiceInterface
	audit   services.AuditLogServiceInterface
	logger  *zap.Logger
}

// NewAuthServiceAuditDecorator creates a new audit logging decorator.
func NewAuthServiceAuditDecorator(service services.AuthServiceInterface, auditService services.AuditLogServiceInterface, logger *zap.Logger) *AuthServiceAuditDecorator {
	return &AuthServiceAuditDecorator{
		service: service,
		audit:   auditService,
		logger:  logger,
	}
}

func (d *AuthServiceAuditDecorator) Register(ctx context.Context, req *models.RegistrationRequest) (*models.User, error) {
	user, err := d.service.Register(ctx, req)

	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)

	details := map[string]interface{}{
		"email": req.Email,
	}
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "user_registration_failed", nil, details, ip) // No userID yet
		return nil, err
	}
	userID := user.ID // Now we have a user ID
	details["userID"] = userID.Hex()

	d.audit.Log(ctx, "user_registered", &userID, details, ip)
	return user, nil
}

func (d *AuthServiceAuditDecorator) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthTokens, *models.User, error) {
	tokens, user, err := d.service.Login(ctx, req)

	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	details := map[string]interface{}{
		"email": req.Email,
	}

	if err != nil {
		details["error"] = err.Error()
		// Attempt to get the user ID, even on failure. This helps with debugging.
		if user != nil {
			details["userID"] = user.ID.Hex()
			d.audit.Log(ctx, "user_login_failed", &user.ID, details, ip)
		} else {
			d.audit.Log(ctx, "user_login_failed", nil, details, ip)
		}
		return nil, nil, err
	}
	userID := user.ID
	details["userID"] = userID.Hex()
	d.audit.Log(ctx, "user_logged_in", &userID, details, ip)
	return tokens, user, nil
}

func (d *AuthServiceAuditDecorator) UpdateEmail(ctx context.Context, userID primitive.ObjectID, newEmail string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	details := map[string]interface{}{
		"userID":   userID.Hex(),
		"newEmail": newEmail,
	}

	err := d.service.UpdateEmail(ctx, userID, newEmail)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "update_email_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "email_updated", &userID, details, ip)
	return nil
}

func (d *AuthServiceAuditDecorator) RequestPasswordReset(ctx context.Context, email string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)

	details := map[string]interface{}{
		"email": email,
	}

	err := d.service.RequestPasswordReset(ctx, email)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "password_reset_request_failed", nil, details, ip) // Email, but no user ID.
		return err
	}
	d.audit.Log(ctx, "password_reset_requested", nil, details, ip)
	return nil
}

func (d *AuthServiceAuditDecorator) ResetPassword(ctx context.Context, token, newPassword string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	// Find user by token (even though it's not part of the interface, we need it for the audit log).
	user, err := d.service.(*services.AuthService).UserRepo.FindByResetToken(ctx, utils.HashString(token)) // Direct access, bypass interface
	if err != nil {
		// Can't find user, log what we can.
		d.audit.Log(ctx, "password_reset_failed", nil, map[string]interface{}{"token_prefix": token[:10], "error": "invalid_token"}, ip)
		return err // Return the original error.
	}
	userID := user.ID
	details := map[string]interface{}{
		"userID": userID.Hex(),
		"token":  token[:10] + "...",
	}
	err = d.service.ResetPassword(ctx, token, newPassword) // Call the *decorated* service!
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "password_reset_failed", &userID, details, ip) // Log with userID
		return err
	}
	d.audit.Log(ctx, "password_reset", &userID, details, ip)
	return nil
}

func (d *AuthServiceAuditDecorator) RotateTokens(ctx context.Context, refreshToken string) (*models.AuthTokens, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)

	// Find user by refresh token, similar to ResetPassword
	user, err := d.service.(*services.AuthService).UserRepo.FindByRefreshToken(ctx, refreshToken)
	if err != nil {
		d.audit.Log(ctx, "token_rotation_failed", nil, map[string]interface{}{"token_prefix": refreshToken[:10], "error": "invalid_token"}, ip)
		return nil, err
	}
	userID := user.ID
	details := map[string]interface{}{
		"userID":       userID.Hex(),
		"refreshToken": refreshToken[:10] + "...",
	}

	tokens, err := d.service.RotateTokens(ctx, refreshToken)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "token_rotation_failed", &userID, details, ip) // Log with userID
		return nil, err
	}

	d.audit.Log(ctx, "tokens_rotated", &userID, details, ip)
	return tokens, nil
}

func (d *AuthServiceAuditDecorator) VerifyEmail(ctx context.Context, token string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	// Find the verification record by the *hashed* token
	verification, err := d.service.(*services.AuthService).UserRepo.FindByVerificationToken(ctx, utils.HashString(token))
	if err != nil {
		d.audit.Log(ctx, "email_verification_failed", nil, map[string]interface{}{"token_prefix": token[:10], "error": "invalid_token"}, ip)
		return err
	}

	userID := verification.UserID
	details := map[string]interface{}{
		"userID": userID.Hex(),
		"email":  verification.Email, // Log the email from the verification record
		"token":  token[:10] + "...",
	}
	err = d.service.VerifyEmail(ctx, token) // Call the *decorated* service.
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "email_verification_failed", &userID, details, ip)
		return err
	}

	d.audit.Log(ctx, "email_verified", &userID, details, ip)
	return nil
}

func (d *AuthServiceAuditDecorator) Logout(ctx context.Context, refreshToken string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)

	// Find user by refresh token, similar to ResetPassword/RotateTokens
	user, err := d.service.(*services.AuthService).UserRepo.FindByRefreshToken(ctx, refreshToken)
	details := map[string]interface{}{
		"refreshToken": refreshToken[:10] + "...",
	}
	if err == nil && user != nil {
		userID := user.ID
		details["userID"] = userID.Hex()
		d.audit.Log(ctx, "user_logged_out", &userID, details, ip) // Audit log *before* the action, more reliable
	} else {
		d.audit.Log(ctx, "user_logged_out", nil, details, ip) // Log even if user is not found.
	}

	err = d.service.Logout(ctx, refreshToken) // Now call the actual Logout (order is important!).
	if err != nil {
		if user != nil {
			userID := user.ID
			details["error"] = err.Error()
			d.audit.Log(ctx, "logout_failed", &userID, details, ip) // Log with userID
		} else {
			d.audit.Log(ctx, "logout_failed", nil, details, ip) // Log without
		}

		return err
	}

	return nil
}

func (d *AuthServiceAuditDecorator) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	details := map[string]interface{}{
		"userID": userID.Hex(),
	}
	user, err := d.service.GetUserByID(ctx, userID)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "get_user_by_id_failed", &userID, details, ip)
		return nil, err
	}
	d.audit.Log(ctx, "get_user_by_id", &userID, details, ip) // Don't log sensitive user data.
	return user, nil
}

func (d *AuthServiceAuditDecorator) ChangePassword(ctx context.Context, userID primitive.ObjectID, oldPassword, newPassword string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	details := map[string]interface{}{
		"userID": userID.Hex(),
	}
	err := d.service.ChangePassword(ctx, userID, oldPassword, newPassword)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "change_password_failed", &userID, details, ip)
		return err
	}
	d.audit.Log(ctx, "password_changed", &userID, details, ip)
	return nil
}

func (d *AuthServiceAuditDecorator) ResendVerificationEmail(ctx context.Context, email string) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	details := map[string]interface{}{
		"email": email,
	}

	// Try to get the user ID for the audit log, even if the operation fails.
	user, _ := d.service.(*services.AuthService).UserRepo.FindByEmail(ctx, email) // Note: We ignore the error here, we just want the user if possible.
	var userID *primitive.ObjectID
	if user != nil {
		details["userID"] = user.ID.Hex()
		userID = &user.ID
	}

	err := d.service.ResendVerificationEmail(ctx, email)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "resend_verification_email_failed", userID, details, ip) // userID might be nil
		return err
	}

	d.audit.Log(ctx, "verification_email_resent", userID, details, ip)
	return nil
}

func (d *AuthServiceAuditDecorator) ForgotPassword(ctx context.Context, req *models.PasswordResetRequest) error {
	ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string)
	details := map[string]interface{}{
		"email": req.Email,
	}
	err := d.service.ForgotPassword(ctx, req)
	if err != nil {
		details["error"] = err.Error()
		d.audit.Log(ctx, "forgot_password_failed", nil, details, ip) // No user ID available.
		return err
	}
	d.audit.Log(ctx, "forgot_password_requested", nil, details, ip) // Consistent action name.
	return nil
}
