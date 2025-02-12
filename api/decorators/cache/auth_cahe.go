package cache

import (
	"context"
	"fmt"
	"time"

	"nalevel/cache"
	"nalevel/config"
	"nalevel/models"
	"nalevel/services"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// AuthServiceCacheDecorator decorates AuthService with caching.
type AuthServiceCacheDecorator struct {
	service services.AuthServiceInterface
	cache   cache.Cache[*models.User] // Use the generic cache for *models.User
	logger  *zap.Logger
	ttl     time.Duration       //Added in the decorator
	cfg     *config.RedisConfig //added
}

// NewAuthServiceCacheDecorator creates a new caching decorator.
func NewAuthServiceCacheDecorator(service services.AuthServiceInterface, cache cache.Cache[*models.User], cfg *config.RedisConfig, logger *zap.Logger) *AuthServiceCacheDecorator { //ttl removed from params
	return &AuthServiceCacheDecorator{
		service: service,
		cache:   cache,
		logger:  logger,
		ttl:     cfg.UserCacheTTL, //Use ttl from config
		cfg:     cfg,
	}
}

// GetUserByID is the only method we need to implement at first, other method will come next
func (d *AuthServiceCacheDecorator) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	cacheKey := fmt.Sprintf("auth:user:%s", userID.Hex()) // More specific prefix

	// Try to get the user from the cache.
	cachedUser, err := d.cache.Get(ctx, cacheKey)
	if err == nil { // Cache hit
		d.logger.Debug("Cache hit for user", zap.String("user_id", userID.Hex()))
		return cachedUser, nil
	}

	if err != cache.ErrCacheMiss { // Some other error
		d.logger.Error("Cache error", zap.Error(err), zap.String("user_id", userID.Hex()))
		// In case of a cache error, we *don't* return the error. We fall through
		// to the underlying service. This is important for resilience.
	}

	// Cache miss (or error), fetch from the underlying service.
	user, err := d.service.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err // Return the error from the underlying service.
	}

	// Store the user in the cache. We do this *after* a successful fetch.
	if err := d.cache.Set(ctx, cacheKey, user, d.ttl); err != nil {
		d.logger.Error("Failed to set user in cache", zap.Error(err), zap.String("user_id", userID.Hex()))
		// Again, don't return the cache error. Just log it.
	}

	return user, nil
}

func (d *AuthServiceCacheDecorator) Register(ctx context.Context, req *models.RegistrationRequest) (*models.User, error) {
	user, err := d.service.Register(ctx, req)
	if err != nil {
		return nil, err
	}

	// Cache the newly registered user.
	cacheKey := fmt.Sprintf("auth:user:%s", user.ID.Hex()) // More specific prefix
	if err := d.cache.Set(ctx, cacheKey, user, d.ttl); err != nil {
		// Log error but continue
		d.logger.Error("Failed to set user in cache after registration", zap.Error(err), zap.String("user_id", user.ID.Hex()))
	}
	return user, nil
}

// For Login and other methods, invalidate the cache.
func (d *AuthServiceCacheDecorator) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthTokens, *models.User, error) {
	tokens, user, err := d.service.Login(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	// Invalidate cache on login (in case user data has changed).
	cacheKey := fmt.Sprintf("auth:user:%s", user.ID.Hex()) // More specific prefix
	if err := d.cache.Delete(ctx, cacheKey); err != nil {
		// Log error but proceed
		d.logger.Error("Failed to delete user from cache during login", zap.Error(err), zap.String("user_id", user.ID.Hex()))
	}
	return tokens, user, nil
}

func (d *AuthServiceCacheDecorator) UpdateEmail(ctx context.Context, userID primitive.ObjectID, newEmail string) error {
	if err := d.service.UpdateEmail(ctx, userID, newEmail); err != nil {
		return err
	}
	cacheKey := fmt.Sprintf("auth:user:%s", userID.Hex()) // More specific prefix
	return d.cache.Delete(ctx, cacheKey)
}

func (d *AuthServiceCacheDecorator) RequestPasswordReset(ctx context.Context, email string) error {
	// No caching needed, just call the underlying service.
	return d.service.RequestPasswordReset(ctx, email)
}

func (d *AuthServiceCacheDecorator) ResetPassword(ctx context.Context, token, newPassword string) error {
	//No need to cache this.
	return d.service.ResetPassword(ctx, token, newPassword)
}

func (d *AuthServiceCacheDecorator) RotateTokens(ctx context.Context, refreshToken string) (*models.AuthTokens, error) {
	//No need to cache this.
	return d.service.RotateTokens(ctx, refreshToken)
}

func (d *AuthServiceCacheDecorator) VerifyEmail(ctx context.Context, token string) error {
	//No need to cache this.
	return d.service.VerifyEmail(ctx, token)
}

func (d *AuthServiceCacheDecorator) Logout(ctx context.Context, refreshToken string) error {
	//No need to cache this.
	return d.service.Logout(ctx, refreshToken)
}
func (d *AuthServiceCacheDecorator) ChangePassword(ctx context.Context, userID primitive.ObjectID, oldPassword, newPassword string) error {
	err := d.service.ChangePassword(ctx, userID, oldPassword, newPassword)
	if err != nil {
		return err
	}
	cacheKey := fmt.Sprintf("auth:user:%s", userID.Hex()) // More specific prefix
	return d.cache.Delete(ctx, cacheKey)                  // Invalidate cache
}

func (d *AuthServiceCacheDecorator) ResendVerificationEmail(ctx context.Context, email string) error {
	// No caching needed, just call the underlying service.
	return d.service.ResendVerificationEmail(ctx, email)
}

func (d *AuthServiceCacheDecorator) ForgotPassword(ctx context.Context, req *models.PasswordResetRequest) error {
	// No caching needed.
	return d.service.ForgotPassword(ctx, req)
}
