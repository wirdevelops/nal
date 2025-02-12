package metrics

import (
	"context"
	"time"

	"nalevel/metrics"
	"nalevel/models"
	"nalevel/services"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

const (
	componentName = "auth_service"
)

// AuthServiceMetricsDecorator decorates AuthService with metrics collection.
type AuthServiceMetricsDecorator struct {
	service services.AuthServiceInterface
	metrics *metrics.Metrics
	logger  *zap.Logger
}

// NewAuthServiceMetricsDecorator creates a new metrics decorator.
func NewAuthServiceMetricsDecorator(service services.AuthServiceInterface, metrics *metrics.Metrics, logger *zap.Logger) *AuthServiceMetricsDecorator {
	return &AuthServiceMetricsDecorator{
		service: service,
		metrics: metrics,
		logger:  logger,
	}
}

// Helper function to get resource name (for metrics)
func getResourceName(op string) string {
	return op // For simplicity, use operation name as resource name
}

// --- Implement AuthServiceInterface methods with metrics ---

func (d *AuthServiceMetricsDecorator) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	start := time.Now()
	user, err := d.service.GetUserByID(ctx, userID)
	d.metrics.RecordOperation(componentName, "GetUserByID", getResourceName("GetUserByID"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "GetUserByID", getResourceName("GetUserByID"), getErrorType(err))
	}
	return user, err
}

func (d *AuthServiceMetricsDecorator) Register(ctx context.Context, req *models.RegistrationRequest) (*models.User, error) {
	start := time.Now()
	user, err := d.service.Register(ctx, req)
	d.metrics.RecordOperation(componentName, "Register", getResourceName("Register"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "Register", getResourceName("Register"), getErrorType(err))
	}
	return user, err
}

func (d *AuthServiceMetricsDecorator) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthTokens, *models.User, error) {
	start := time.Now()
	tokens, user, err := d.service.Login(ctx, req)
	d.metrics.RecordOperation(componentName, "Login", getResourceName("Login"), time.Since(start).Seconds(), 0, 0) // No message size/batch size for login
	if err != nil {
		d.metrics.RecordError(componentName, "Login", getResourceName("Login"), getErrorType(err))
	}
	return tokens, user, err
}

func (d *AuthServiceMetricsDecorator) UpdateEmail(ctx context.Context, userID primitive.ObjectID, newEmail string) error {
	start := time.Now()
	err := d.service.UpdateEmail(ctx, userID, newEmail)
	d.metrics.RecordOperation(componentName, "UpdateEmail", getResourceName("UpdateEmail"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "UpdateEmail", getResourceName("UpdateEmail"), getErrorType(err))
	}
	return err
}

func (d *AuthServiceMetricsDecorator) RequestPasswordReset(ctx context.Context, email string) error {
	start := time.Now()
	err := d.service.RequestPasswordReset(ctx, email)
	d.metrics.RecordOperation(componentName, "RequestPasswordReset", getResourceName("RequestPasswordReset"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "RequestPasswordReset", getResourceName("RequestPasswordReset"), getErrorType(err))
	}
	return err
}

func (d *AuthServiceMetricsDecorator) ResetPassword(ctx context.Context, token, newPassword string) error {
	start := time.Now()
	err := d.service.ResetPassword(ctx, token, newPassword)
	d.metrics.RecordOperation(componentName, "ResetPassword", getResourceName("ResetPassword"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "ResetPassword", getResourceName("ResetPassword"), getErrorType(err))
	}
	return err
}

func (d *AuthServiceMetricsDecorator) RotateTokens(ctx context.Context, refreshToken string) (*models.AuthTokens, error) {
	start := time.Now()
	tokens, err := d.service.RotateTokens(ctx, refreshToken)
	d.metrics.RecordOperation(componentName, "RotateTokens", getResourceName("RotateTokens"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "RotateTokens", getResourceName("RotateTokens"), getErrorType(err))
	}
	return tokens, err
}

func (d *AuthServiceMetricsDecorator) VerifyEmail(ctx context.Context, token string) error {
	start := time.Now()
	err := d.service.VerifyEmail(ctx, token)
	d.metrics.RecordOperation(componentName, "VerifyEmail", getResourceName("VerifyEmail"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "VerifyEmail", getResourceName("VerifyEmail"), getErrorType(err))
	}
	return err
}

func (d *AuthServiceMetricsDecorator) Logout(ctx context.Context, refreshToken string) error {
	start := time.Now()
	err := d.service.Logout(ctx, refreshToken)
	d.metrics.RecordOperation(componentName, "Logout", getResourceName("Logout"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "Logout", getResourceName("Logout"), getErrorType(err))
	}
	return err
}
func (d *AuthServiceMetricsDecorator) ChangePassword(ctx context.Context, userID primitive.ObjectID, oldPassword, newPassword string) error {
	start := time.Now()
	err := d.service.ChangePassword(ctx, userID, oldPassword, newPassword)
	d.metrics.RecordOperation(componentName, "ChangePassword", getResourceName("ChangePassword"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "ChangePassword", getResourceName("ChangePassword"), getErrorType(err))
	}
	return err
}

func (d *AuthServiceMetricsDecorator) ResendVerificationEmail(ctx context.Context, email string) error {
	start := time.Now()
	err := d.service.ResendVerificationEmail(ctx, email)
	d.metrics.RecordOperation(componentName, "ResendVerificationEmail", getResourceName("ResendVerificationEmail"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "ResendVerificationEmail", getResourceName("ResendVerificationEmail"), getErrorType(err))
	}
	return err
}
func (d *AuthServiceMetricsDecorator) ForgotPassword(ctx context.Context, req *models.PasswordResetRequest) error {
	start := time.Now()
	err := d.service.ForgotPassword(ctx, req)
	d.metrics.RecordOperation(componentName, "ForgotPassword", getResourceName("ForgotPassword"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(componentName, "ForgotPassword", getResourceName("ForgotPassword"), getErrorType(err))
	}
	return err
}

// Helper function to determine error type (for metrics)
func getErrorType(err error) string {
	if err == nil {
		return "" // No error
	}
	// You might want to use a type switch or errors.As to categorize errors more specifically
	return "other_error"
}
