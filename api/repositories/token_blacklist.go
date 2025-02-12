package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type BlacklistedToken struct {
	Token     string        `bson:"token"`
	ExpiresAt time.Duration `bson:"expires_at"`
	CreatedAt time.Time     `bson:"created_at"`
}

type TokenBlacklist interface {
	Add(ctx context.Context, token string, expiresAt time.Duration) error
	IsBlacklisted(ctx context.Context, token string) (bool, error)
	Cleanup(ctx context.Context) error
}

type TokenBlacklistImpl struct {
	collection *mongo.Collection
}

func NewTokenBlacklist(ctx context.Context, db *mongo.Database) (TokenBlacklist, error) {
	collection := db.Collection("blacklisted_tokens")

	// Create TTL index
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "expires_at", Value: 1}},
		Options: options.Index().SetExpireAfterSeconds(0),
	}

	if _, err := collection.Indexes().CreateOne(ctx, indexModel); err != nil {
		return nil, err
	}

	return &TokenBlacklistImpl{collection: collection}, nil
}

func (tb *TokenBlacklistImpl) Add(ctx context.Context, token string, expiresAt time.Duration) error {
	blacklistedToken := BlacklistedToken{
		Token:     token,
		ExpiresAt: expiresAt,
		CreatedAt: time.Now(),
	}

	_, err := tb.collection.InsertOne(ctx, blacklistedToken)
	return err
}

func (tb *TokenBlacklistImpl) IsBlacklisted(ctx context.Context, token string) (bool, error) {
	count, err := tb.collection.CountDocuments(ctx, bson.M{"token": token})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (tb *TokenBlacklistImpl) Cleanup(ctx context.Context) error {
	_, err := tb.collection.DeleteMany(ctx, bson.M{
		"expires_at": bson.M{"$lt": time.Now()},
	})
	return err
}
