package repositories

import (
	"context"
	"fmt"
	"nalevel/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RoleRepository interface {
	CreateRole(ctx context.Context, role *models.Role) error
	GetRoleByName(ctx context.Context, roleName string) (*models.Role, error)
	UpdateRole(ctx context.Context, role *models.Role) error
	GetAllRoles(ctx context.Context) ([]*models.Role, error) // Added for completeness
	DisableRole(ctx context.Context, roleName string) error  // New method
	EnableRole(ctx context.Context, roleName string) error   // New method
}

type RoleRepositoryImpl struct {
	collection *mongo.Collection
}

func NewRoleRepository(db *mongo.Database) *RoleRepositoryImpl {
	collection := db.Collection("roles") // Use a "roles" collection
	return &RoleRepositoryImpl{collection: collection}
}

func (r *RoleRepositoryImpl) CreateRole(ctx context.Context, role *models.Role) error {
	role.IsActive = true // Set IsActive to true by default for new roles
	_, err := r.collection.InsertOne(ctx, role)
	if err != nil {
		// Handle potential duplicate key error (role name already exists)
		if mongo.IsDuplicateKeyError(err) {
			return fmt.Errorf("role '%s' already exists: %w", role.Name, err)
		}
		return fmt.Errorf("failed to create role: %w", err)
	}
	return nil
}

func (r *RoleRepositoryImpl) GetRoleByName(ctx context.Context, roleName string) (*models.Role, error) {
	var role models.Role
	err := r.collection.FindOne(ctx, bson.M{"name": roleName}).Decode(&role)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, ErrNotFound // Use the exported ErrNotFound
		}
		return nil, fmt.Errorf("failed to get role by name: %w", err)
	}
	return &role, nil
}

func (r *RoleRepositoryImpl) UpdateRole(ctx context.Context, role *models.Role) error {
	filter := bson.M{"name": role.Name} // Update based on the role name (assuming it's unique)
	update := bson.M{"$set": role}      // Use $set to update specific fields

	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update role: %w", err)
	}
	if result.MatchedCount == 0 {
		return ErrNotFound // Role with the given name not found
	}
	return nil
}

func (r *RoleRepositoryImpl) GetAllRoles(ctx context.Context) ([]*models.Role, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to get all roles: %w", err)
	}
	defer cursor.Close(ctx)

	var roles []*models.Role
	if err := cursor.All(ctx, &roles); err != nil {
		return nil, fmt.Errorf("failed to decode roles: %w", err)
	}
	return roles, nil
}

func (r *RoleRepositoryImpl) DisableRole(ctx context.Context, roleName string) error {
	filter := bson.M{"name": roleName}
	update := bson.M{"$set": bson.M{"isActive": false}}

	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to disable role: %w", err)
	}
	if result.MatchedCount == 0 {
		return ErrNotFound // Role not found
	}
	return nil
}

func (r *RoleRepositoryImpl) EnableRole(ctx context.Context, roleName string) error {
	filter := bson.M{"name": roleName}
	update := bson.M{"$set": bson.M{"isActive": true}}

	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to enable role: %w", err)
	}
	if result.MatchedCount == 0 {
		return ErrNotFound // Role not found
	}
	return nil
}
