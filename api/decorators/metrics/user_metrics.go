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
	userComponentName = "user_service" // Consistent component name
)

// UserServiceMetricsDecorator decorates UserService with metrics collection.
type UserServiceMetricsDecorator struct {
	service services.UserServiceInterface
	metrics *metrics.Metrics
	logger  *zap.Logger
}

// NewUserServiceMetricsDecorator creates a new metrics decorator for UserService.
func NewUserServiceMetricsDecorator(service services.UserServiceInterface, metrics *metrics.Metrics, logger *zap.Logger) *UserServiceMetricsDecorator {
	return &UserServiceMetricsDecorator{
		service: service,
		metrics: metrics,
		logger:  logger,
	}
}

// getUserResourceName helper function (consistent with Auth)
func getUserResourceName(op string) string {
	return op
}

// --- Decorated Methods ---

func (d *UserServiceMetricsDecorator) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	start := time.Now()
	createdUser, err := d.service.CreateUser(ctx, user)
	d.metrics.RecordOperation(userComponentName, "CreateUser", getUserResourceName("CreateUser"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "CreateUser", getUserResourceName("CreateUser"), getErrorType(err))
	}
	return createdUser, nil
}

func (d *UserServiceMetricsDecorator) CreateUserWithRoles(ctx context.Context, user *models.User, roles []string) (*models.User, error) {
	start := time.Now()
	createdUser, err := d.service.CreateUserWithRoles(ctx, user, roles)
	d.metrics.RecordOperation(userComponentName, "CreateUserWithRoles", getUserResourceName("CreateUserWithRoles"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "CreateUserWithRoles", getUserResourceName("CreateUserWithRoles"), getErrorType(err))
	}
	return createdUser, nil
}

func (d *UserServiceMetricsDecorator) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	start := time.Now()
	user, err := d.service.GetUserByID(ctx, id)
	d.metrics.RecordOperation(userComponentName, "GetUserByID", getUserResourceName("GetUserByID"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "GetUserByID", getUserResourceName("GetUserByID"), getErrorType(err))
	}
	return user, nil
}

func (d *UserServiceMetricsDecorator) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	start := time.Now()
	user, err := d.service.GetUserByEmail(ctx, email)
	d.metrics.RecordOperation(userComponentName, "GetUserByEmail", getUserResourceName("GetUserByEmail"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "GetUserByEmail", getUserResourceName("GetUserByEmail"), getErrorType(err))
	}
	return user, nil
}

func (d *UserServiceMetricsDecorator) UpdateUserDetails(ctx context.Context, userID primitive.ObjectID, updateData map[string]interface{}) error {
	start := time.Now()
	err := d.service.UpdateUserDetails(ctx, userID, updateData)
	d.metrics.RecordOperation(userComponentName, "UpdateUserDetails", getUserResourceName("UpdateUserDetails"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "UpdateUserDetails", getUserResourceName("UpdateUserDetails"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) UpdateUserRoles(ctx context.Context, id primitive.ObjectID, roles []string) error {
	start := time.Now()
	err := d.service.UpdateUserRoles(ctx, id, roles)
	d.metrics.RecordOperation(userComponentName, "UpdateUserRoles", getUserResourceName("UpdateUserRoles"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "UpdateUserRoles", getUserResourceName("UpdateUserRoles"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) UpdateUserStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	start := time.Now()
	err := d.service.UpdateUserStatus(ctx, id, status)
	d.metrics.RecordOperation(userComponentName, "UpdateUserStatus", getUserResourceName("UpdateUserStatus"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "UpdateUserStatus", getUserResourceName("UpdateUserStatus"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) UpdateUserSettings(ctx context.Context, userID primitive.ObjectID, settings models.UserSettings) error {
	start := time.Now()
	err := d.service.UpdateUserSettings(ctx, userID, settings)
	d.metrics.RecordOperation(userComponentName, "UpdateUserSettings", getUserResourceName("UpdateUserSettings"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "UpdateUserSettings", getUserResourceName("UpdateUserSettings"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) DeleteUser(ctx context.Context, id primitive.ObjectID) error {
	start := time.Now()
	err := d.service.DeleteUser(ctx, id)
	d.metrics.RecordOperation(userComponentName, "DeleteUser", getUserResourceName("DeleteUser"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "DeleteUser", getUserResourceName("DeleteUser"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) ListUsers(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
	start := time.Now()
	users, totalCount, err := d.service.ListUsers(ctx, filter, page, limit)
	d.metrics.RecordOperation(userComponentName, "ListUsers", getUserResourceName("ListUsers"), time.Since(start).Seconds(), 0, int(totalCount)) // Use totalCount as a proxy for batch size
	if err != nil {
		d.metrics.RecordError(userComponentName, "ListUsers", getUserResourceName("ListUsers"), getErrorType(err))
	}
	return users, totalCount, err
}

func (d *UserServiceMetricsDecorator) SetUserActiveRole(ctx context.Context, userID primitive.ObjectID, role string) error {
	start := time.Now()
	err := d.service.SetUserActiveRole(ctx, userID, role)
	d.metrics.RecordOperation(userComponentName, "SetUserActiveRole", getUserResourceName("SetUserActiveRole"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "SetUserActiveRole", getUserResourceName("SetUserActiveRole"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) AddUserRole(ctx context.Context, userID primitive.ObjectID, newRole string) error {
	start := time.Now()
	err := d.service.AddUserRole(ctx, userID, newRole)
	d.metrics.RecordOperation(userComponentName, "AddUserRole", getUserResourceName("AddUserRole"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "AddUserRole", getUserResourceName("AddUserRole"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) RemoveUserRole(ctx context.Context, userID primitive.ObjectID, roleToRemove string) error {
	start := time.Now()
	err := d.service.RemoveUserRole(ctx, userID, roleToRemove)
	d.metrics.RecordOperation(userComponentName, "RemoveUserRole", getUserResourceName("RemoveUserRole"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "RemoveUserRole", getUserResourceName("RemoveUserRole"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) ActivateUser(ctx context.Context, userID primitive.ObjectID) error {
	start := time.Now()
	err := d.service.ActivateUser(ctx, userID)
	d.metrics.RecordOperation(userComponentName, "ActivateUser", getUserResourceName("ActivateUser"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "ActivateUser", getUserResourceName("ActivateUser"), getErrorType(err))
	}
	return err
}

func (d *UserServiceMetricsDecorator) DeactivateUser(ctx context.Context, userID primitive.ObjectID) error {
	start := time.Now()
	err := d.service.DeactivateUser(ctx, userID)
	d.metrics.RecordOperation(userComponentName, "DeactivateUser", getUserResourceName("DeactivateUser"), time.Since(start).Seconds(), 0, 0)
	if err != nil {
		d.metrics.RecordError(userComponentName, "DeactivateUser", getUserResourceName("DeactivateUser"), getErrorType(err))
	}
	return err
}
