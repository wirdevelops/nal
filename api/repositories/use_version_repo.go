// repositories/user_version_repository.go

package repositories

import (
	"context"
	"errors"
	"nalevel/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ErrVersionNotFound is returned when a user version is not found.
var ErrVersionNotFound = errors.New("user version not found")

// UserVersionRepository manages user versions for token invalidation.
type UserVersionRepository interface {
	Create(ctx context.Context, version *models.UserVersion) (*models.UserVersion, error)
	GetVersion(ctx context.Context, userID primitive.ObjectID) (int, error)
	IncrementVersion(ctx context.Context, userID primitive.ObjectID) (int, error)
}

// UserVersionRepositoryImpl is the MongoDB implementation of UserVersionRepository.
type UserVersionRepositoryImpl struct {
	collection *mongo.Collection
}

// NewUserVersionRepository creates a new UserVersionRepository.
func NewUserVersionRepository(db *mongo.Database) UserVersionRepository {
	return &UserVersionRepositoryImpl{collection: db.Collection("user_versions")}
}

// Create creates a new user version.
func (r *UserVersionRepositoryImpl) Create(ctx context.Context, version *models.UserVersion) (*models.UserVersion, error) {
	_, err := r.collection.InsertOne(ctx, version)
	if err != nil {
		return nil, err
	}

	return version, nil //Return the complete version
}

// GetVersion gets the current version for a user.
func (r *UserVersionRepositoryImpl) GetVersion(ctx context.Context, userID primitive.ObjectID) (int, error) {
	var version models.UserVersion
	err := r.collection.FindOne(ctx, bson.M{"userid": userID}).Decode(&version)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return 0, ErrVersionNotFound // Or return 0, nil, depending on your needs
		}
		return 0, err
	}
	return version.Version, nil
}

// IncrementVersion increments the user's version, invalidating old tokens.
func (r *UserVersionRepositoryImpl) IncrementVersion(ctx context.Context, userID primitive.ObjectID) (int, error) {
	filter := bson.M{"userid": userID}
	update := bson.M{"$inc": bson.M{"version": 1}}
	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)

	var updatedVersion models.UserVersion
	err := r.collection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&updatedVersion)
	if err != nil {
		return 0, err
	}
	return updatedVersion.Version, nil
}
