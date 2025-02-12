package cache

import (
	"context"
	"nalevel/cache"
	"nalevel/config"
	"nalevel/models"
	"nalevel/repositories"
	"nalevel/services"
	"time"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// CachedUserService implements the UserServiceInterface, wrapping the core UserService with caching.
type CachedUserService struct {
	userService services.UserServiceInterface
	userCache   cache.Cache[*models.User]
	logger      *zap.Logger
	cfg         *config.Config // Use application-wide configuration
	ttl         time.Duration
}

const (
	userByIDCachePrefix    = "user:id:"
	userByEmailCachePrefix = "user:email:"
	userListCachePrefix    = "user:list:" // Still be cautious with this one.
	// defaultCacheTTL       = 1 * time.Hour // Moved to config
)

// NewCachedUserService creates a new CachedUserService instance.
func NewCachedUserService(userService services.UserServiceInterface, userCache cache.Cache[*models.User], cfg *config.Config, logger *zap.Logger) *CachedUserService {
	return &CachedUserService{
		userService: userService,
		userCache:   userCache,
		logger:      logger,
		cfg:         cfg,
		ttl:         cfg.Redis.UserCacheTTL, // Get TTL from config
	}
}

// --- Decorated Methods ---

func (s *CachedUserService) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	createdUser, err := s.userService.CreateUser(ctx, user)
	if err != nil {
		return nil, err
	}
	s.cacheUser(ctx, createdUser) // Cache after successful creation.
	return createdUser, nil
}

func (s *CachedUserService) CreateUserWithRoles(ctx context.Context, user *models.User, roles []string) (*models.User, error) {
	createdUser, err := s.userService.CreateUserWithRoles(ctx, user, roles)
	if err != nil {
		return nil, err
	}
	s.cacheUser(ctx, createdUser)
	return createdUser, nil
}

func (s *CachedUserService) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	cacheKey := userByIDCachePrefix + id.Hex()
	user, err := s.userCache.Get(ctx, cacheKey)
	if err == nil {
		s.logger.Debug("Cache hit for user by ID", zap.String("user_id", id.Hex()))
		return user, nil
	}
	if !errors.Is(err, cache.ErrCacheMiss) {
		s.logger.Error("Cache get error", zap.Error(err), zap.String("cache_key", cacheKey))
	}

	user, err = s.userService.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}

	s.cacheUser(ctx, user) // Cache on successful fetch.
	return user, nil
}

func (s *CachedUserService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	cacheKey := userByEmailCachePrefix + email
	user, err := s.userCache.Get(ctx, cacheKey)
	if err == nil {
		s.logger.Debug("Cache hit for user by email", zap.String("email", email))
		return user, nil
	}
	if !errors.Is(err, cache.ErrCacheMiss) {
		s.logger.Error("Cache get error", zap.Error(err), zap.String("cache_key", cacheKey))
	}

	user, err = s.userService.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	s.cacheUser(ctx, user)
	return user, nil
}

func (s *CachedUserService) UpdateUserDetails(ctx context.Context, userID primitive.ObjectID, updateData map[string]interface{}) error {
	err := s.userService.UpdateUserDetails(ctx, userID, updateData)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID) // Invalidate on any update.
	return nil
}

func (s *CachedUserService) UpdateUserRoles(ctx context.Context, id primitive.ObjectID, roles []string) error {
	err := s.userService.UpdateUserRoles(ctx, id, roles)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, id)
	return nil
}

func (s *CachedUserService) UpdateUserStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	err := s.userService.UpdateUserStatus(ctx, id, status)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, id)
	return nil
}

func (s *CachedUserService) UpdateUserSettings(ctx context.Context, userID primitive.ObjectID, settings models.UserSettings) error {
	err := s.userService.UpdateUserSettings(ctx, userID, settings)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID)
	return nil
}

func (s *CachedUserService) DeleteUser(ctx context.Context, id primitive.ObjectID) error {
	err := s.userService.DeleteUser(ctx, id)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, id)
	return nil
}

func (s *CachedUserService) ListUsers(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
	// NO CACHING (as discussed).  Implement a strategy if needed, but be careful.
	users, totalCount, err := s.userService.ListUsers(ctx, filter, page, limit)
	if err != nil {
		return nil, 0, err
	}
	s.logger.Info("List users with no cache", zap.Any("filter", filter), zap.Int("page", page), zap.Int("limit", limit))
	return users, totalCount, nil
}

func (s *CachedUserService) SetUserActiveRole(ctx context.Context, userID primitive.ObjectID, role string) error {
	err := s.userService.SetUserActiveRole(ctx, userID, role)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID)
	return nil
}

func (s *CachedUserService) AddUserRole(ctx context.Context, userID primitive.ObjectID, newRole string) error {
	err := s.userService.AddUserRole(ctx, userID, newRole)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID)
	return nil
}

func (s *CachedUserService) RemoveUserRole(ctx context.Context, userID primitive.ObjectID, roleToRemove string) error {
	err := s.userService.RemoveUserRole(ctx, userID, roleToRemove)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID)
	return nil
}

func (s *CachedUserService) ActivateUser(ctx context.Context, userID primitive.ObjectID) error {
	err := s.userService.ActivateUser(ctx, userID)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID)
	return nil
}

func (s *CachedUserService) DeactivateUser(ctx context.Context, userID primitive.ObjectID) error {
	err := s.userService.DeactivateUser(ctx, userID)
	if err != nil {
		return err
	}
	s.invalidateUserCache(ctx, userID)
	return nil
}

// --- Helper Functions ---

func (s *CachedUserService) cacheUser(ctx context.Context, user *models.User) {
	if user == nil {
		return
	}

	idKey := userByIDCachePrefix + user.ID.Hex()
	if err := s.userCache.Set(ctx, idKey, user, s.ttl); err != nil { // Use s.ttl
		s.logger.Error("Failed to cache user by ID", zap.Error(err), zap.String("user_id", user.ID.Hex()))
	}

	emailKey := userByEmailCachePrefix + user.Email
	if err := s.userCache.Set(ctx, emailKey, user, s.ttl); err != nil { // Use s.ttl
		s.logger.Error("Failed to cache user by email", zap.Error(err), zap.String("email", user.Email))
	}
}

func (s *CachedUserService) invalidateUserCache(ctx context.Context, userID primitive.ObjectID) {
	// We *could* try to fetch the user here to get the email, but it's simpler
	// and safer to just delete *both* keys.  The user might not exist anymore.
	idKey := userByIDCachePrefix + userID.Hex()
	if err := s.userCache.Delete(ctx, idKey); err != nil {
		s.logger.Error("Failed to delete user cache by ID", zap.Error(err), zap.String("user_id", userID.Hex()))
	}

	// We don't know the email, so we can't form the email key reliably.
	// Instead, we rely on GetUserByID to be cached, so if the user is retrieved
	// again, it will be cached with the correct email.  This is a good trade-off.

	// OPTIONALLY:  Fetch the user to get the email, but handle errors!
	// This is less efficient, but more precise.
	user, err := s.userService.GetUserByID(ctx, userID)
	if err == nil && user != nil { // Only if NO error AND user exists
		emailKey := userByEmailCachePrefix + user.Email
		if err := s.userCache.Delete(ctx, emailKey); err != nil {
			s.logger.Error("Failed to delete user cache by email", zap.Error(err), zap.String("email", user.Email))
		}
	} else if err != nil && !errors.Is(err, repositories.ErrNotFound) && !errors.Is(err, services.ErrUserNotFound) {
		s.logger.Error("error while getting user to invalidate cache", zap.Error(err))
	}
}
