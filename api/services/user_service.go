package services

import (
	"context"
	"fmt"
	"nalevel/models"
	"nalevel/repositories"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// Custom Errors
var (
	ErrUserNotFound       = errors.New("user not found")
	ErrRoleAlreadyExists  = errors.New("user already has this role")
	ErrInvalidRole        = errors.New("invalid role")
	ErrCannotRemoveRole   = errors.New("cannot remove role") // e.g., if it's the last role
	ErrInvalidFilterField = errors.New("invalid filter field")
	ErrInvalidDateFormat  = errors.New("invalid date format")
)

// UserServiceInterface defines the interface for user-related operations.
type UserServiceInterface interface {
	CreateUser(ctx context.Context, user *models.User) (*models.User, error)
	CreateUserWithRoles(ctx context.Context, user *models.User, roles []string) (*models.User, error)
	GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	UpdateUserDetails(ctx context.Context, userID primitive.ObjectID, updateData map[string]interface{}) error
	UpdateUserRoles(ctx context.Context, id primitive.ObjectID, roles []string) error
	UpdateUserStatus(ctx context.Context, id primitive.ObjectID, status string) error
	UpdateUserSettings(ctx context.Context, userID primitive.ObjectID, settings models.UserSettings) error
	DeleteUser(ctx context.Context, id primitive.ObjectID) error
	ListUsers(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error)
	SetUserActiveRole(ctx context.Context, userID primitive.ObjectID, role string) error
	AddUserRole(ctx context.Context, userID primitive.ObjectID, newRole string) error
	RemoveUserRole(ctx context.Context, userID primitive.ObjectID, roleToRemove string) error
	ActivateUser(ctx context.Context, userID primitive.ObjectID) error
	DeactivateUser(ctx context.Context, userID primitive.ObjectID) error
}

// UserService implements the UserServiceInterface.
type UserService struct {
	userRepo  repositories.UserRepository
	validator *validator.Validate // Use a validator instance
	logger    *zap.Logger         // Added logger
}

// NewUserService creates a new UserService instance.
func NewUserService(userRepo repositories.UserRepository, logger *zap.Logger) UserServiceInterface {
	return &UserService{
		userRepo:  userRepo,
		validator: validator.New(),
		logger:    logger, // Inject the logger
	}
}

// CreateUser creates a new user (without authentication logic).
func (s *UserService) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	// Validate user data (excluding auth-related fields)
	if err := s.validator.StructExcept(user, "Password", "RefreshToken", "ResetToken", "VerificationToken", "FailedLogin"); err != nil {
		s.logger.Error("Invalid user data", zap.Error(err)) // Log validation errors
		return nil, errors.Wrap(ErrInvalidUserData, err.Error())
	}

	// Check if user with the same email already exists
	existingUser, err := s.userRepo.FindByEmail(ctx, user.Email)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		s.logger.Error("Failed to check for existing user", zap.Error(err), zap.String("email", user.Email))
		return nil, errors.Wrap(err, "failed to check for existing user")
	}
	if existingUser != nil {
		s.logger.Info("User with email already exists", zap.String("email", user.Email))
		return nil, ErrUserAlreadyExists
	}

	user.ID = primitive.NewObjectID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.IsVerified = true            // Assume created users are verified (adjust as needed)
	user.Status = models.StatusActive // Default status
	createdUser, err := s.userRepo.Create(ctx, user)
	if err != nil {
		s.logger.Error("Failed to create user", zap.Error(err), zap.String("email", user.Email))
		return nil, errors.Wrap(err, "failed to create user")
	}

	s.logger.Info("User created", zap.String("user_id", createdUser.ID.Hex()), zap.String("email", createdUser.Email))
	return createdUser, nil
}

// CreateUserWithRoles creates a user and assigns roles.
func (s *UserService) CreateUserWithRoles(ctx context.Context, user *models.User, roles []string) (*models.User, error) {
	// Validate roles
	for _, role := range roles {
		if !isValidRole(role) {
			s.logger.Warn("Invalid role provided", zap.String("role", role))
			return nil, ErrInvalidRole
		}
	}

	// Create the user
	createdUser, err := s.CreateUser(ctx, user)
	if err != nil {
		return nil, err // Error is already wrapped in CreateUser and logged
	}

	// Assign roles
	if len(roles) > 0 {
		if err := s.UpdateUserRoles(ctx, createdUser.ID, roles); err != nil {
			//  Rollback user creation if role assignment fails?  Consider a transaction here.
			s.logger.Error("Failed to assign initial roles, rolling back user creation", zap.Error(err), zap.String("user_id", createdUser.ID.Hex()))
			// Example of rollback (you'll need to implement Delete in your repository)
			if delErr := s.userRepo.Delete(ctx, createdUser.ID); delErr != nil {
				s.logger.Error("Failed to rollback user creation", zap.Error(delErr), zap.String("user_id", createdUser.ID.Hex()))
			}
			return nil, errors.Wrap(err, "failed to assign initial roles")
		}
	}

	s.logger.Info("User created with roles", zap.String("user_id", createdUser.ID.Hex()), zap.Strings("roles", roles))
	return createdUser, nil
}

// UpdateUserDetails updates specific user details (excluding sensitive fields).
func (s *UserService) UpdateUserDetails(ctx context.Context, userID primitive.ObjectID, updatedData map[string]interface{}) error {
	// 1. Fetch the existing user.
	existingUser, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for update", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for update", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	// 2. Update *only* allowed fields.  Protect critical fields.
	if name, ok := updatedData["name"].(string); ok {
		existingUser.Name = name
	}
	if avatar, ok := updatedData["avatar"].(string); ok {
		existingUser.Avatar = &avatar
	}
	if location, ok := updatedData["location"].(string); ok {
		existingUser.Location = &location
	}
	if phone, ok := updatedData["phone"].(string); ok {
		existingUser.Phone = &phone
	}

	// Email update requires additional care (verification, etc.). Handle in a separate method.
	if email, ok := updatedData["email"].(string); ok && existingUser.Email != email {
		s.logger.Warn("Attempted to update email via incorrect method", zap.String("user_id", userID.Hex()))
		return errors.New("email updates not allowed via this method; use dedicated email update flow")
	}

	existingUser.UpdatedAt = time.Now()

	// 3. Validate the *updated* user object, ensuring data integrity.
	if err := s.validator.Struct(existingUser); err != nil {
		s.logger.Error("Invalid user data after update", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}

	// 4. Save the updated user.
	if err := s.userRepo.Update(ctx, existingUser); err != nil {
		s.logger.Error("Failed to update user", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to update user")
	}

	s.logger.Info("User details updated", zap.String("user_id", userID.Hex()))
	return nil
}

// GetUserByID retrieves a user by their ID.
func (s *UserService) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Debug("User not found", zap.String("user_id", userID.Hex())) // Debug level for not found
			return nil, ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user by ID", zap.Error(err), zap.String("user_id", userID.Hex()))
		return nil, errors.Wrap(err, "failed to retrieve user")
	}
	return user, nil
}

// GetUserByEmail retrieves a user by their email address.
func (s *UserService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Debug("User not found by email", zap.String("email", email)) // Debug level
			return nil, ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user by email", zap.Error(err), zap.String("email", email))
		return nil, errors.Wrap(err, "failed to retrieve user by email")
	}
	return user, nil
}

// AddUserRole adds a role to a user.
func (s *UserService) AddUserRole(ctx context.Context, userID primitive.ObjectID, newRole string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for role addition", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for role addition", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	if !isValidRole(newRole) {
		s.logger.Warn("Invalid role provided for addition", zap.String("user_id", userID.Hex()), zap.String("role", newRole))
		return ErrInvalidRole
	}

	for _, role := range user.Roles {
		if role == newRole {
			s.logger.Info("User already has role", zap.String("user_id", userID.Hex()), zap.String("role", newRole))
			return ErrRoleAlreadyExists
		}
	}

	user.Roles = append(user.Roles, newRole)
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after role addition", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}

	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user roles", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to update user roles")
	}

	s.logger.Info("Role added to user", zap.String("user_id", userID.Hex()), zap.String("role", newRole))
	return nil
}

// UpdateUserRoles sets the user's roles to the provided list.
func (s *UserService) UpdateUserRoles(ctx context.Context, id primitive.ObjectID, roles []string) error {
	for _, role := range roles {
		if !isValidRole(role) {
			s.logger.Warn("Invalid role provided in role update", zap.String("user_id", id.Hex()), zap.String("role", role))
			return ErrInvalidRole
		}
	}

	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for role update", zap.String("user_id", id.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for role update", zap.Error(err), zap.String("user_id", id.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	user.Roles = roles
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after role update", zap.Error(err), zap.String("user_id", id.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user roles", zap.Error(err), zap.String("user_id", id.Hex()))
		return errors.Wrap(err, "failed to update user roles")
	}

	s.logger.Info("User roles updated", zap.String("user_id", id.Hex()), zap.Strings("roles", roles))
	return nil
}

// RemoveUserRole removes a role from a user.
func (s *UserService) RemoveUserRole(ctx context.Context, userID primitive.ObjectID, roleToRemove string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for role removal", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for role removal", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	found := false
	roleIndex := -1
	for i, role := range user.Roles {
		if role == roleToRemove {
			found = true
			roleIndex = i
			break
		}
	}
	if !found {
		s.logger.Info("User does not have role to remove", zap.String("user_id", userID.Hex()), zap.String("role", roleToRemove))
		return ErrInvalidRole // Or perhaps ErrRoleNotFound
	}
	if len(user.Roles) == 1 {
		s.logger.Warn("Cannot remove the last role from user", zap.String("user_id", userID.Hex()), zap.String("role", roleToRemove))
		return ErrCannotRemoveRole
	}

	user.Roles = append(user.Roles[:roleIndex], user.Roles[roleIndex+1:]...)
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after role removal", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user roles after removal", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to update user roles")
	}

	s.logger.Info("Role removed from user", zap.String("user_id", userID.Hex()), zap.String("role", roleToRemove))
	return nil
}

// UpdateUserStatus updates the status of a user.
func (s *UserService) UpdateUserStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	if !isValidStatus(status) {
		s.logger.Warn("Invalid user status provided", zap.String("user_id", id.Hex()), zap.String("status", status))
		return errors.New("invalid user status")
	}

	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for status update", zap.String("user_id", id.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for status update", zap.Error(err), zap.String("user_id", id.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	user.Status = status
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after status update", zap.Error(err), zap.String("user_id", id.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user status", zap.Error(err), zap.String("user_id", id.Hex()))
		return errors.Wrap(err, "failed to update user status")
	}

	s.logger.Info("User status updated", zap.String("user_id", id.Hex()), zap.String("status", status))
	return nil
}

// isValidStatus checks if a given status is valid.
func isValidStatus(status string) bool {
	switch status {
	case models.StatusActive, models.StatusInactive, models.StatusPending, models.StatusSuspended:
		return true
	default:
		return false
	}
}

// UpdateUserSettings updates the settings of a user.
func (s *UserService) UpdateUserSettings(ctx context.Context, userID primitive.ObjectID, settings models.UserSettings) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for settings update", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for settings update", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	user.Settings = settings
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after settings update", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user settings", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to update user settings")
	}

	s.logger.Info("User settings updated", zap.String("user_id", userID.Hex()))
	return nil
}

// ActivateUser activates a user.
func (s *UserService) ActivateUser(ctx context.Context, userID primitive.ObjectID) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for activation", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for activation", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	user.Status = models.StatusActive
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after activation", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to activate user", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to activate user")
	}

	s.logger.Info("User activated", zap.String("user_id", userID.Hex()))
	return nil
}

// DeactivateUser deactivates a user.
func (s *UserService) DeactivateUser(ctx context.Context, userID primitive.ObjectID) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for deactivation", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for deactivation", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	user.Status = models.StatusInactive
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after deactivation", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}

	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to deactivate user", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to deactivate user")
	}
	s.logger.Info("User deactivated", zap.String("user_id", userID.Hex()))
	return nil
}

// ListUsers retrieves a list of users with filtering and pagination.
func (s *UserService) ListUsers(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
	allowedFields := map[string]bool{
		"name":      true,
		"email":     true,
		"status":    true,
		"roles":     true,
		"location":  true,
		"createdAt": true,
		"updatedAt": true,
	}

	for k := range filter {
		if !allowedFields[k] {
			s.logger.Warn("Invalid filter field", zap.String("field", k))
			return nil, 0, errors.Wrap(ErrInvalidFilterField, k) // Wrap with specific error
		}
	}
	for key, value := range filter {
		if key == "createdAt" || key == "updatedAt" {
			dateStr, ok := value.(string)
			if !ok {
				s.logger.Warn("Invalid date format in filter", zap.String("field", key), zap.Any("value", value))
				return nil, 0, errors.Wrapf(ErrInvalidDateFormat, "invalid date format for field %s", key) //Wrap
			}
			dateValue, err := time.Parse(time.RFC3339, dateStr)
			if err != nil {
				s.logger.Warn("Invalid date format in filter", zap.String("field", key), zap.String("value", dateStr), zap.Error(err))
				return nil, 0, errors.Wrapf(ErrInvalidDateFormat, "invalid date format for %s: %v", key, err) //Wrap
			}

			filter[key] = dateValue
		}
	}
	users, totalCount, err := s.userRepo.Find(ctx, filter, page, limit)
	if err != nil {
		s.logger.Error("Failed to list users", zap.Error(err), zap.Any("filter", filter))
		return nil, 0, errors.Wrap(err, "failed to list users")
	}
	return users, totalCount, nil
}

// SetUserActiveRole sets the active role for a user.
func (s *UserService) SetUserActiveRole(ctx context.Context, userID primitive.ObjectID, role string) error {
	if !isValidRole(role) {
		s.logger.Warn("Invalid role provided for active role setting", zap.String("user_id", userID.Hex()), zap.String("role", role))
		return ErrInvalidRole
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for active role setting", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for active role setting", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	hasRole := false
	for _, r := range user.Roles {
		if r == role {
			hasRole = true
			break
		}
	}

	if !hasRole {
		s.logger.Warn("User does not have the specified role", zap.String("user_id", userID.Hex()), zap.String("role", role))
		return fmt.Errorf("user does not have a role '%s'", role)
	}

	user.ActiveRole = &role
	user.UpdatedAt = time.Now()

	if err := s.validator.Struct(user); err != nil {
		s.logger.Error("Invalid user data after active role setting", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}
	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to update user after active role setting", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to update user")
	}

	s.logger.Info("User active role set", zap.String("user_id", userID.Hex()), zap.String("role", role))
	return nil
}

// DeleteUser soft-deletes a user (sets status to suspended).
func (s *UserService) DeleteUser(ctx context.Context, userID primitive.ObjectID) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("User not found for deletion", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to find user for deletion", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to find user for deletion")
	}

	for _, role := range user.Roles {
		if role == models.RoleAdmin {
			s.logger.Warn("Cannot delete an admin user", zap.String("user_id", userID.Hex()))
			return errors.New("cannot delete an admin user")
		}
	}

	user.Status = models.StatusSuspended
	user.UpdatedAt = time.Now()

	if err := s.userRepo.Update(ctx, user); err != nil {
		s.logger.Error("Failed to soft delete user", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to soft delete user")
	}

	s.logger.Info("User soft-deleted", zap.String("user_id", userID.Hex()))
	return nil
}
