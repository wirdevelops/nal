package services

import (
	"context"
	"fmt"
	"nalevel/models"
	"nalevel/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RolePermissionServiceInterface interface {
	CreateRole(ctx context.Context, roleName string, permissions []string) error
	GetRolePermissions(ctx context.Context, roleName string) ([]string, error)
	AddPermissionsToRole(ctx context.Context, roleName string, permissions []string) error
	RemovePermissionsFromRole(ctx context.Context, roleName string, permissions []string) error
	CheckPermission(ctx context.Context, userID primitive.ObjectID, permission string) (bool, error)
	GetAllRoles(ctx context.Context) ([]string, error)
	DisableRole(ctx context.Context, roleName string) error // New method
	EnableRole(ctx context.Context, roleName string) error  // New method
}

type RolePermissionService struct {
	roleRepo repositories.RoleRepository
	userRepo repositories.UserRepository
	validate *validator.Validate
}

func NewRolePermissionService(roleRepo repositories.RoleRepository, userRepo repositories.UserRepository) *RolePermissionService {
	validate := validator.New()
	return &RolePermissionService{
		roleRepo: roleRepo,
		userRepo: userRepo,
		validate: validate,
	}
}

func (s *RolePermissionService) CreateRole(ctx context.Context, roleName string, permissions []string) error {
	// 1. Validate inputs.
	if roleName == "" {
		return errors.New("role name cannot be empty")
	}
	if err := s.validate.Var(roleName, "alphanum"); err != nil { // Example: Alphanumeric role names
		return fmt.Errorf("invalid role name: %w", err)
	}

	// 2. Check if the role already exists.
	existingRole, err := s.roleRepo.GetRoleByName(ctx, roleName)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		return fmt.Errorf("error checking for existing role: %w", err)
	}
	if existingRole != nil {
		return fmt.Errorf("role '%s' already exists", roleName)
	}

	// 3. Create the new role.
	role := &models.Role{
		Name:        roleName,
		Permissions: permissions,
	}

	// 4. Validate the new role (using the validator).
	if err := s.validate.Struct(role); err != nil {
		return fmt.Errorf("invalid role data: %w", err)
	}

	// 5. Save the role.
	return s.roleRepo.CreateRole(ctx, role)
}

func (s *RolePermissionService) GetRolePermissions(ctx context.Context, roleName string) ([]string, error) {
	// 1. Validate roleName.
	if roleName == "" {
		return nil, errors.New("role name cannot be empty")
	}

	// 2. Fetch the role.
	role, err := s.roleRepo.GetRoleByName(ctx, roleName)
	if err != nil {
		return nil, err // Could be ErrNotFound or a database error.
	}

	// 3. Return the permissions.
	return role.Permissions, nil
}

func (s *RolePermissionService) AddPermissionsToRole(ctx context.Context, roleName string, permissions []string) error {
	// 1. Validate inputs.
	if roleName == "" {
		return errors.New("role name cannot be empty")
	}
	if len(permissions) == 0 {
		return errors.New("no permissions provided")
	}

	// 2. Fetch the existing role.
	role, err := s.roleRepo.GetRoleByName(ctx, roleName)
	if err != nil {
		return err
	}

	// 3. Add the new permissions (avoiding duplicates).
	existingPermissions := make(map[string]bool)
	for _, p := range role.Permissions {
		existingPermissions[p] = true
	}
	for _, p := range permissions {
		if !existingPermissions[p] {
			role.Permissions = append(role.Permissions, p)
		}
	}

	// 4. Save the updated role.
	return s.roleRepo.UpdateRole(ctx, role)
}

func (s *RolePermissionService) RemovePermissionsFromRole(ctx context.Context, roleName string, permissions []string) error {
	// 1. Validate inputs.
	if roleName == "" {
		return errors.New("role name cannot be empty")
	}

	// 2. Fetch the existing role.
	role, err := s.roleRepo.GetRoleByName(ctx, roleName)
	if err != nil {
		return err
	}

	// 3. Remove the specified permissions.
	newPermissions := []string{}
	for _, existingPermission := range role.Permissions {
		remove := false
		for _, permissionToRemove := range permissions {
			if existingPermission == permissionToRemove {
				remove = true
				break
			}
		}
		if !remove {
			newPermissions = append(newPermissions, existingPermission)
		}
	}
	role.Permissions = newPermissions

	// 4. Save the updated role.
	return s.roleRepo.UpdateRole(ctx, role)
}

func (s *RolePermissionService) CheckPermission(ctx context.Context, userID primitive.ObjectID, permission string) (bool, error) {
	// 1. Validate inputs.
	if permission == "" {
		return false, errors.New("permission cannot be empty")
	}

	// 2. Fetch the user.
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return false, err // Could be ErrNotFound or a database error.
	}

	// 3. Check each of the user's roles for the permission.
	for _, roleName := range user.Roles {
		role, err := s.roleRepo.GetRoleByName(ctx, roleName)
		if err != nil {
			if errors.Is(err, repositories.ErrNotFound) {
				continue // Role not found, try the next one.
			}
			return false, err // Other database error.
		}

		// Check if the role is active
		if !role.IsActive {
			continue // Skip inactive roles
		}

		for _, p := range role.Permissions {
			if p == permission {
				return true, nil // Found the permission!
			}
		}
	}

	// 4. Permission not found in any of the user's roles.
	return false, nil
}

func (s *RolePermissionService) GetAllRoles(ctx context.Context) ([]string, error) {
	roles, err := s.roleRepo.GetAllRoles(ctx)
	if err != nil {
		return nil, err
	}

	roleNames := make([]string, len(roles))
	for i, role := range roles {
		roleNames[i] = role.Name
	}
	return roleNames, nil
}

func (s *RolePermissionService) DisableRole(ctx context.Context, roleName string) error {
	if roleName == "" {
		return errors.New("role name cannot be empty")
	}
	return s.roleRepo.DisableRole(ctx, roleName) // Call the repository method
}

func (s *RolePermissionService) EnableRole(ctx context.Context, roleName string) error {
	if roleName == "" {
		return errors.New("role name cannot be empty")
	}
	return s.roleRepo.EnableRole(ctx, roleName) // Call the repository method
}
