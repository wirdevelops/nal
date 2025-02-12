package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PasswordEntry struct {
	Hash      string    `bson:"hash"`
	CreatedAt time.Time `bson:"created_at"`
}

type PasswordHistoryStore interface {
	Add(ctx context.Context, userID primitive.ObjectID, passwordHash string) error
	HasBeenUsed(ctx context.Context, userID primitive.ObjectID, passwordHash string) (bool, error)
	GetHistory(ctx context.Context, userID primitive.ObjectID, limit int) ([]PasswordEntry, error)
	Cleanup(ctx context.Context, userID primitive.ObjectID, keepLast int) error
}

type PasswordHistoryImpl struct {
	collection *mongo.Collection
}

func NewPasswordHistory(db *mongo.Database) PasswordHistoryStore {
	return &PasswordHistoryImpl{
		collection: db.Collection("password_history"),
	}
}

func (ph *PasswordHistoryImpl) Add(ctx context.Context, userID primitive.ObjectID, passwordHash string) error {
	entry := bson.M{
		"user_id":    userID,
		"hash":       passwordHash,
		"created_at": time.Now(),
	}

	_, err := ph.collection.InsertOne(ctx, entry)
	return err
}

func (ph *PasswordHistoryImpl) HasBeenUsed(ctx context.Context, userID primitive.ObjectID, passwordHash string) (bool, error) {
	count, err := ph.collection.CountDocuments(ctx, bson.M{
		"user_id": userID,
		"hash":    passwordHash,
	})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (ph *PasswordHistoryImpl) GetHistory(ctx context.Context, userID primitive.ObjectID, limit int) ([]PasswordEntry, error) {
	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetLimit(int64(limit))

	cursor, err := ph.collection.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var entries []PasswordEntry
	if err := cursor.All(ctx, &entries); err != nil {
		return nil, err
	}
	return entries, nil
}

func (ph *PasswordHistoryImpl) Cleanup(ctx context.Context, userID primitive.ObjectID, keepLast int) error {
	// Get the date of the nth most recent password
	var entries []PasswordEntry
	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetSkip(int64(keepLast)).
		SetLimit(1)

	cursor, err := ph.collection.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &entries); err != nil {
		return err
	}

	if len(entries) > 0 {
		// Delete all entries older than the nth password
		_, err = ph.collection.DeleteMany(ctx, bson.M{
			"user_id":    userID,
			"created_at": bson.M{"$lt": entries[0].CreatedAt},
		})
		return err
	}
	return nil
}
