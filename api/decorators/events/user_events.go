package events

import (
	"context"
	"nalevel/events"
	"nalevel/models"
	"nalevel/services"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// UserServiceEventDecorator logs events for UserService operations.
type UserServiceEventDecorator struct {
	service      services.UserServiceInterface
	eventManager *events.KafkaEventManager
	logger       *zap.Logger
}

// NewUserServiceEventDecorator creates a new event logging decorator for UserService.
func NewUserServiceEventDecorator(service services.UserServiceInterface, eventManager *events.KafkaEventManager, logger *zap.Logger) *UserServiceEventDecorator {
	return &UserServiceEventDecorator{
		service:      service,
		eventManager: eventManager,
		logger:       logger,
	}
}

// --- Decorated Methods ---

func (d *UserServiceEventDecorator) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	createdUser, err := d.service.CreateUser(ctx, user)
	if err != nil {
		return nil, err // Return errors from the underlying service.
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.created",
		Data: map[string]interface{}{
			"user_id":    createdUser.ID.Hex(), // Log created user ID
			"user_email": createdUser.Email,    // Log the email.  Consider data sensitivity.
		},
		Metadata: events.Metadata{
			UserID: createdUser.ID.Hex(), // Add user ID to metadata
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.created' event", zap.Error(publishErr))
		// Usually, don't return event publishing errors.
	}
	return createdUser, nil
}

func (d *UserServiceEventDecorator) CreateUserWithRoles(ctx context.Context, user *models.User, roles []string) (*models.User, error) {
	createdUser, err := d.service.CreateUserWithRoles(ctx, user, roles)
	if err != nil {
		return nil, err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.created_with_roles",
		Data: map[string]interface{}{
			"user_id":    createdUser.ID.Hex(),
			"user_email": createdUser.Email,
			"roles":      roles, // Log the assigned roles.
		},
		Metadata: events.Metadata{
			UserID: createdUser.ID.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.created_with_roles' event", zap.Error(publishErr))
	}

	return createdUser, nil
}

func (d *UserServiceEventDecorator) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	user, err := d.service.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.retrieved",
		Data: map[string]interface{}{
			"user_id": user.ID.Hex(), // Log retrieved user ID
		},
		Metadata: events.Metadata{
			UserID: user.ID.Hex(), // Add user ID to metadata.
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish event", zap.Error(publishErr), zap.String("event_type", event.Type))
	}

	return user, nil
}

func (d *UserServiceEventDecorator) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	user, err := d.service.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.retrieved_by_email",
		Data: map[string]interface{}{
			"user_id":    user.ID.Hex(), // Log the user ID
			"user_email": email,         // Log the email used for the lookup.
		},
		Metadata: events.Metadata{
			UserID: user.ID.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish event", zap.Error(publishErr), zap.String("event_type", event.Type))
	}

	return user, nil
}

func (d *UserServiceEventDecorator) UpdateUserDetails(ctx context.Context, userID primitive.ObjectID, updateData map[string]interface{}) error {
	err := d.service.UpdateUserDetails(ctx, userID, updateData)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.details_updated",
		Data: map[string]interface{}{
			"user_id":     userID.Hex(),
			"update_data": updateData, // Be mindful of sensitive data here!
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.details_updated' event", zap.Error(publishErr))
	}

	return nil
}

func (d *UserServiceEventDecorator) UpdateUserRoles(ctx context.Context, id primitive.ObjectID, roles []string) error {
	err := d.service.UpdateUserRoles(ctx, id, roles)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.roles_updated",
		Data: map[string]interface{}{
			"user_id": id.Hex(),
			"roles":   roles, // Log the new roles.
		},
		Metadata: events.Metadata{
			UserID: id.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.roles_updated' event", zap.Error(publishErr))
	}

	return nil
}

func (d *UserServiceEventDecorator) UpdateUserStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	err := d.service.UpdateUserStatus(ctx, id, status)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.status_updated",
		Data: map[string]interface{}{
			"user_id": id.Hex(),
			"status":  status, // Log the new status.
		},
		Metadata: events.Metadata{
			UserID: id.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.status_updated' event", zap.Error(publishErr))
	}
	return nil
}

func (d *UserServiceEventDecorator) UpdateUserSettings(ctx context.Context, userID primitive.ObjectID, settings models.UserSettings) error {
	err := d.service.UpdateUserSettings(ctx, userID, settings)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.settings_updated",
		Data: map[string]interface{}{
			"user_id":  userID.Hex(),
			"settings": settings, //  Be careful about logging the entire settings object.
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.settings_updated' event", zap.Error(publishErr))
	}

	return nil
}

func (d *UserServiceEventDecorator) DeleteUser(ctx context.Context, id primitive.ObjectID) error {
	err := d.service.DeleteUser(ctx, id)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.deleted",
		Data: map[string]interface{}{
			"user_id": id.Hex(),
		},
		Metadata: events.Metadata{
			UserID: id.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.deleted' event", zap.Error(publishErr))
	}

	return nil
}

func (d *UserServiceEventDecorator) ListUsers(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
	users, totalCount, err := d.service.ListUsers(ctx, filter, page, limit)
	if err != nil {
		return nil, 0, err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "users.listed",
		Data: map[string]interface{}{
			"filter":       filter,
			"page":         page,
			"limit":        limit,
			"total_count":  totalCount,
			"return_count": len(users), // Log the number of users returned.
		},
		Metadata: events.Metadata{}, // Metadata might not be as relevant here
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'users.listed' event", zap.Error(publishErr))
	}

	return users, totalCount, nil
}

func (d *UserServiceEventDecorator) SetUserActiveRole(ctx context.Context, userID primitive.ObjectID, role string) error {
	err := d.service.SetUserActiveRole(ctx, userID, role)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.active_role_set",
		Data: map[string]interface{}{
			"user_id": userID.Hex(),
			"role":    role, // Log the active role.
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}
	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.active_role_set' event", zap.Error(publishErr))
	}
	return nil
}

func (d *UserServiceEventDecorator) AddUserRole(ctx context.Context, userID primitive.ObjectID, newRole string) error {
	err := d.service.AddUserRole(ctx, userID, newRole)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.role_added",
		Data: map[string]interface{}{
			"user_id":  userID.Hex(),
			"new_role": newRole, // Log the added role.
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.role_added' event", zap.Error(publishErr))
	}
	return nil
}

func (d *UserServiceEventDecorator) RemoveUserRole(ctx context.Context, userID primitive.ObjectID, roleToRemove string) error {
	err := d.service.RemoveUserRole(ctx, userID, roleToRemove)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.role_removed",
		Data: map[string]interface{}{
			"user_id":      userID.Hex(),
			"role_removed": roleToRemove, // Log the removed role.
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.role_removed' event", zap.Error(publishErr))
	}

	return nil
}

func (d *UserServiceEventDecorator) ActivateUser(ctx context.Context, userID primitive.ObjectID) error {
	err := d.service.ActivateUser(ctx, userID)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.activated",
		Data: map[string]interface{}{
			"user_id": userID.Hex(),
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.activated' event", zap.Error(publishErr))
	}
	return nil
}

func (d *UserServiceEventDecorator) DeactivateUser(ctx context.Context, userID primitive.ObjectID) error {
	err := d.service.DeactivateUser(ctx, userID)
	if err != nil {
		return err
	}

	event := events.Event{
		Source: "user_service",
		Type:   "user.deactivated",
		Data: map[string]interface{}{
			"user_id": userID.Hex(),
		},
		Metadata: events.Metadata{
			UserID: userID.Hex(),
		},
	}

	if publishErr := d.eventManager.Publish(ctx, event); publishErr != nil {
		d.logger.Error("Failed to publish 'user.deactivated' event", zap.Error(publishErr))
	}

	return nil
}
