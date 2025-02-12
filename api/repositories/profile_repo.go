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

var (
	ErrInvalidProfile = errors.New("invalid profile")
	ErrDuplicateKey   = errors.New("duplicate key")
)

type ProfileRepository interface {
	Create(ctx context.Context, profile *models.BaseProfile) error
	GetByUserIDAndRole(ctx context.Context, userID primitive.ObjectID, role string) (*models.BaseProfile, error)
	GetByID(ctx context.Context, profileID primitive.ObjectID) (*models.BaseProfile, error)    // Added GetByID
	GetByUserID(ctx context.Context, userID primitive.ObjectID) ([]*models.BaseProfile, error) // Added GetByUserID
	Update(ctx context.Context, profile *models.BaseProfile) error
	Delete(ctx context.Context, profileID primitive.ObjectID) error
	List(ctx context.Context, filter map[string]interface{}, skip, limit int64, sort string) ([]*models.BaseProfile, error) // Added List
	FindBySkill(ctx context.Context, skill string) ([]*models.BaseProfile, error)                                           // Added FindBySkill
	FindByLocation(ctx context.Context, location string) ([]*models.BaseProfile, error)                                     // Added FindByLocation
	CountByRole(ctx context.Context, role string) (int64, error)                                                            // Added CountByRole
}

type ProfileRepositoryImpl struct {
	collection *mongo.Collection
}

func NewProfileRepository(ctx context.Context, db *mongo.Database) (ProfileRepository, error) {
	collection := db.Collection("profiles")
	if err := createProfileIndexes(ctx, collection); err != nil {
		return nil, err
	}
	return &ProfileRepositoryImpl{collection: collection}, nil
}

func createProfileIndexes(ctx context.Context, coll *mongo.Collection) error {
	indexModels := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "userid", Value: 1}, {Key: "role", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "skills", Value: 1}}, // Index for searching by skills
			Options: options.Index().SetSparse(true),   // Allow documents without skills
		},
		{
			Keys:    bson.D{{Key: "location", Value: 1}}, // Index for searching by location
			Options: options.Index().SetSparse(true),     // Allow documents without location
		},
		// Add other indexes (e.g., on role for CountByRole optimization)
		{
			Keys:    bson.D{{Key: "role", Value: 1}}, // Index for counting by role
			Options: options.Index().SetSparse(true), // Allow profiles without a role (shouldn't happen, but good practice)
		},
	}
	_, err := coll.Indexes().CreateMany(ctx, indexModels)
	return err
}

func (r *ProfileRepositoryImpl) Create(ctx context.Context, profile *models.BaseProfile) error {

	_, err := r.collection.InsertOne(ctx, profile)
	if mongo.IsDuplicateKeyError(err) {
		return ErrDuplicateKey
	}
	return err
}

func (r *ProfileRepositoryImpl) GetByUserIDAndRole(ctx context.Context, userID primitive.ObjectID, role string) (*models.BaseProfile, error) {
	var profile models.BaseProfile
	filter := bson.M{"userid": userID, "role": role}
	err := r.collection.FindOne(ctx, filter).Decode(&profile)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, ErrNotFound
	}
	return &profile, err
}

func (r *ProfileRepositoryImpl) GetByID(ctx context.Context, profileID primitive.ObjectID) (*models.BaseProfile, error) {
	var profile models.BaseProfile
	err := r.collection.FindOne(ctx, bson.M{"_id": profileID}).Decode(&profile)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, ErrNotFound
	}
	return &profile, err
}

func (r *ProfileRepositoryImpl) GetByUserID(ctx context.Context, userID primitive.ObjectID) ([]*models.BaseProfile, error) {
	var profiles []*models.BaseProfile
	filter := bson.M{"userid": userID}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &profiles); err != nil {
		return nil, err
	}
	return profiles, nil
}

func (r *ProfileRepositoryImpl) Update(ctx context.Context, profile *models.BaseProfile) error {

	filter := bson.M{"_id": profile.ID}
	update := bson.M{"$set": profile}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *ProfileRepositoryImpl) Delete(ctx context.Context, profileID primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": profileID})
	return err
}

func (r *ProfileRepositoryImpl) List(ctx context.Context, filter map[string]interface{}, skip, limit int64, sort string) ([]*models.BaseProfile, error) {
	var profiles []*models.BaseProfile

	// Convert the filter map to a BSON document
	bsonFilter := bson.M{}
	for key, value := range filter {
		bsonFilter[key] = value
	}
	findOptions := options.Find()
	if skip > 0 {
		findOptions.SetSkip(skip)
	}
	if limit > 0 {
		findOptions.SetLimit(limit)
	}
	if sort != "" {
		// Determine sort order (ascending or descending)
		sortOrder := 1 // Default to ascending
		if sort[0] == '-' {
			sortOrder = -1
			sort = sort[1:] // Remove the '-' prefix
		}
		findOptions.SetSort(bson.D{{Key: sort, Value: sortOrder}})
	}

	cursor, err := r.collection.Find(ctx, bsonFilter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &profiles); err != nil {
		return nil, err
	}
	return profiles, nil
}

func (r *ProfileRepositoryImpl) FindBySkill(ctx context.Context, skill string) ([]*models.BaseProfile, error) {
	var profiles []*models.BaseProfile
	filter := bson.M{"skills": skill} // Matches any profile with the skill in the skills array
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &profiles); err != nil {
		return nil, err
	}
	return profiles, nil
}

func (r *ProfileRepositoryImpl) FindByLocation(ctx context.Context, location string) ([]*models.BaseProfile, error) {
	var profiles []*models.BaseProfile
	filter := bson.M{"location": location}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	if err := cursor.All(ctx, &profiles); err != nil {
		return nil, err
	}

	return profiles, nil
}

func (r *ProfileRepositoryImpl) CountByRole(ctx context.Context, role string) (int64, error) {
	count, err := r.collection.CountDocuments(ctx, bson.M{"role": role})
	return count, err
}
