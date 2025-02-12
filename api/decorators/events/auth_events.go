package events

import (
	"context"

	"nalevel/events"
	"nalevel/models"
	"nalevel/services"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// AuthServiceEventDecorator logs events for AuthService operations.
type AuthServiceEventDecorator struct {
	service      services.AuthServiceInterface
	eventManager *events.KafkaEventManager
	logger       *zap.Logger
}

// NewAuthServiceEventDecorator creates a new event logging decorator.
func NewAuthServiceEventDecorator(service services.AuthServiceInterface, eventManager *events.KafkaEventManager, logger *zap.Logger) *AuthServiceEventDecorator {
	return &AuthServiceEventDecorator{
		service:      service,
		eventManager: eventManager,
		logger:       logger,
	}
}

// --- Implement AuthServiceInterface methods with event logging ---

func (d *AuthServiceEventDecorator) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {

	user, err := d.service.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err // Return the error directly from the underlying service.
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.retrieved",
		Data: map[string]interface{}{
			"user_id": user.ID.Hex(),
		},
		Metadata: events.Metadata{ // You can add TraceID here if available in ctx
			UserID: user.ID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish event", zap.Error(publishErr), zap.String("event_type", event.Type))
		// Decide if you want to return the error or not.  For logging, usually not.
	}

	return user, err
}

func (d *AuthServiceEventDecorator) Register(ctx context.Context, req *models.RegistrationRequest) (*models.User, error) {
	user, err := d.service.Register(ctx, req)
	if err != nil {
		return nil, err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.registered",
		Data: map[string]interface{}{
			"user_id":    user.ID.Hex(),
			"user_email": user.Email, // Consider data sensitivity
			// Add other relevant fields
		},
		Metadata: events.Metadata{
			UserID: user.ID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.registered' event", zap.Error(publishErr))
	}
	return user, err
}

// Login Implementation
func (d *AuthServiceEventDecorator) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthTokens, *models.User, error) {
	tokens, user, err := d.service.Login(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	eventData := map[string]interface{}{
		"user_id": user.ID.Hex(),
	}

	event := events.Event{
		Source:   "auth_service",
		Type:     "user.login",
		Data:     eventData,
		Metadata: events.Metadata{},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}

	return tokens, user, nil
}

func (d *AuthServiceEventDecorator) UpdateEmail(ctx context.Context, userID primitive.ObjectID, newEmail string) error {
	err := d.service.UpdateEmail(ctx, userID, newEmail)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.email_updated",
		Data: map[string]interface{}{
			"user_id":   userID.Hex(),
			"new_email": newEmail,
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.email_updated' event", zap.Error(publishErr))
	}

	return nil
}

// Implement the methods for RequestPasswordReset, ResetPassword
func (d *AuthServiceEventDecorator) RequestPasswordReset(ctx context.Context, email string) error {
	err := d.service.RequestPasswordReset(ctx, email)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.password_reset_requested",
		Data: map[string]interface{}{
			"email": email,
		},
		Metadata: events.Metadata{},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}

	return nil
}

func (d *AuthServiceEventDecorator) ResetPassword(ctx context.Context, token, newPassword string) error {
	err := d.service.ResetPassword(ctx, token, newPassword)
	if err != nil {
		return err
	}
	event := events.Event{
		Source: "auth-service",
		Type:   "user.password.reset",
		Data: map[string]interface{}{
			"token": token,
		},
		Metadata: events.Metadata{},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}

	return nil
}

//Implement the methods for RotateTokens, VerifyEmail, Logout, ChangePassword, ResendVerificationEmail, and ForgotPassword

func (d *AuthServiceEventDecorator) RotateTokens(ctx context.Context, refreshToken string) (*models.AuthTokens, error) {
	tokens, err := d.service.RotateTokens(ctx, refreshToken)
	if err != nil {
		return nil, err
	}
	event := events.Event{
		Source: "auth-service",
		Type:   "user.tokens.rotated",
		Data: map[string]interface{}{
			"refresh_token": refreshToken,
		},
		Metadata: events.Metadata{},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}

	return tokens, nil
}

func (d *AuthServiceEventDecorator) VerifyEmail(ctx context.Context, token string) error {
	err := d.service.VerifyEmail(ctx, token)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.email_verified",
		Data: map[string]interface{}{
			"token": token, // Include relevant data
		},
		Metadata: events.Metadata{}, // Add metadata if needed
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}
	return nil
}

func (d *AuthServiceEventDecorator) Logout(ctx context.Context, refreshToken string) error {
	err := d.service.Logout(ctx, refreshToken)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.logout",
		Data: map[string]interface{}{
			"refresh_token": refreshToken,
		},
		Metadata: events.Metadata{}, // You might add a user ID here if available in the context
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}

	return nil
}
func (d *AuthServiceEventDecorator) ChangePassword(ctx context.Context, userID primitive.ObjectID, oldPassword, newPassword string) error {
	err := d.service.ChangePassword(ctx, userID, oldPassword, newPassword)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.password_changed",
		Data: map[string]interface{}{
			"user_id": userID.Hex(),
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.password_changed' event", zap.Error(publishErr))
	}

	return nil
}
func (d *AuthServiceEventDecorator) ResendVerificationEmail(ctx context.Context, email string) error {
	err := d.service.ResendVerificationEmail(ctx, email)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "auth_service",
		Type:   "user.verification_email_resent",
		Data: map[string]interface{}{
			"email": email,
		},
		Metadata: events.Metadata{}, // Add metadata if needed
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish event", zap.Error(publishErr), zap.String("event_type", event.Type))
	}

	return nil
}
func (d *AuthServiceEventDecorator) ForgotPassword(ctx context.Context, req *models.PasswordResetRequest) error {
	err := d.service.ForgotPassword(ctx, req)
	if err != nil {
		return err
	}

	event := events.Event{
		Source:   "auth_service",
		Type:     "user.forgot_password",
		Data:     map[string]interface{}{"email": req.Email},
		Metadata: events.Metadata{},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("failed to publish event", zap.Error(publishErr), zap.Any("event", event))
	}
	return nil
}
