package repositories

import (
	"context"
	"errors"
	"fmt"
	"nalevel/models"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/patrickmn/go-cache"
)

var (
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrNotFound          = errors.New("not found")
	ErrInvalidResetToken = errors.New("invalid reset token")
	ErrStaleData         = errors.New("stale data version")
)

type UserRepository interface {
	Create(context.Context, *models.User) (*models.User, error)
	FindByEmail(context.Context, string) (*models.User, error)
	FindByID(context.Context, primitive.ObjectID) (*models.User, error)
	UpdateLastLogin(context.Context, primitive.ObjectID) error
	UpdatePassword(ctx context.Context, userID primitive.ObjectID, hashedPassword string) error
	LockAccount(ctx context.Context, userID primitive.ObjectID, until time.Time) error
	IncrementFailedAttempts(ctx context.Context, userID primitive.ObjectID) error
	ResetFailedAttempts(ctx context.Context, userID primitive.ObjectID) error
	StoreRefreshToken(ctx context.Context, userID primitive.ObjectID, token string) error
	UpdateFailedLogin(ctx context.Context, userID primitive.ObjectID, attempts int, lockDuration time.Duration) error
	StoreResetToken(ctx context.Context, email, hashedToken string, expiresAt time.Time) error
	DeleteResetToken(ctx context.Context, userID primitive.ObjectID) error
	RotateRefreshToken(ctx context.Context, userID primitive.ObjectID, newToken string) error
	UpdateVerificationStatus(ctx context.Context, email string, verified bool) error
	FindByRefreshToken(ctx context.Context, token string) (*models.User, error)
	FindByResetToken(ctx context.Context, hashedToken string) (*models.User, error)

	Find(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error)
	FindByVerificationToken(ctx context.Context, token string) (*models.Verification, error)
	DeleteVerificationToken(ctx context.Context, id primitive.ObjectID) error

	UpdateUser(ctx context.Context, user *models.User) error // General user update
	Update(ctx context.Context, user *models.User) error
	Delete(ctx context.Context, userID primitive.ObjectID) error
	CreateVerificationToken(ctx context.Context, verification *models.Verification) error
}

type UserRepositoryImpl struct {
	db         *mongo.Database
	collection *mongo.Collection
	cache      *cache.Cache
	mu         sync.RWMutex // Mutex for cache access
}

func NewUserRepository(ctx context.Context, db *mongo.Database) (UserRepository, error) {
	collection := db.Collection("users")
	if err := createIndexes(ctx, collection); err != nil {
		return nil, err
	}

	verificationCollection := db.Collection("verificationTokens")
	if err := createVerificationIndexes(ctx, verificationCollection); err != nil {
		return nil, err
	}

	// Initialize the cache.  5m expiration, 10m cleanup interval.
	c := cache.New(5*time.Minute, 10*time.Minute)

	return &UserRepositoryImpl{db: db, collection: collection, cache: c}, nil
}

// ... (createIndexes and createVerificationIndexes remain unchanged) ...
func createIndexes(ctx context.Context, coll *mongo.Collection) error {
	indexModels := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "refreshToken", Value: 1}},
			Options: options.Index().SetSparse(true),
		},
		{
			Keys:    bson.D{{Key: "resetToken.token", Value: 1}},
			Options: options.Index().SetExpireAfterSeconds(3600), // Auto-expire after 1 hour
		},
	}
	_, err := coll.Indexes().CreateMany(ctx, indexModels)
	return err
}

func createVerificationIndexes(ctx context.Context, coll *mongo.Collection) error {

	// Create new indexes
	indexModels := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "token", Value: 1}},
			Options: options.Index().SetUnique(true).SetSparse(true).SetName("unique_token_index"),
		},
		{
			Keys:    bson.D{{Key: "expiresAt", Value: 1}},
			Options: options.Index().SetExpireAfterSeconds(0).SetName("expiresAt_ttl_index"),
		},
	}
	_, err := coll.Indexes().CreateMany(ctx, indexModels)
	return err
}

func (r *UserRepositoryImpl) Find(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	skip := (page - 1) * limit
	bsonFilter := bson.M{}
	for k, v := range filter {
		bsonFilter[k] = v
	}
	bsonFilter["status"] = bson.M{"$ne": models.StatusSuspended}

	// Construct a cache key.  Be *very* careful with cache keys.
	cacheKey := fmt.Sprintf("find:filter:%v:page:%d:limit:%d", bsonFilter, page, limit)

	// Try to get the results from the cache.
	r.mu.RLock()
	cachedResults, found := r.cache.Get(cacheKey)
	r.mu.RUnlock()

	if found {
		if results, ok := cachedResults.(struct {
			Users      []*models.User
			TotalCount int64
		}); ok {
			return results.Users, results.TotalCount, nil
		}
	}

	cursor, err := r.collection.Find(ctx, bsonFilter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)))
	if err != nil {
		return nil, 0, fmt.Errorf("failed to find users: %w", err)
	}
	defer cursor.Close(ctx)

	var users []*models.User
	if err := cursor.All(ctx, &users); err != nil {
		return nil, 0, fmt.Errorf("failed to decode users: %w", err)
	}

	totalCount, err := r.collection.CountDocuments(ctx, bsonFilter)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	// Store the results in the cache.
	r.mu.Lock()
	r.cache.Set(cacheKey, struct {
		Users      []*models.User
		TotalCount int64
	}{users, totalCount}, cache.DefaultExpiration)
	r.mu.Unlock()

	return users, totalCount, nil
}

func (r *UserRepositoryImpl) Create(ctx context.Context, user *models.User) (*models.User, error) {
	result, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, ErrUserAlreadyExists
		}
		return nil, fmt.Errorf("failed to insert user: %w", err)
	}

	insertedID, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, errors.New("failed to get inserted ID")
	}
	user.ID = insertedID

	// Invalidate relevant cache entries (e.g., Find queries).
	r.invalidateCache("find:*")
	return user, nil
}

func (r *UserRepositoryImpl) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	cacheKey := fmt.Sprintf("user:email:%s", email)

	// Try to get the user from the cache.
	r.mu.RLock()
	cachedUser, found := r.cache.Get(cacheKey)
	r.mu.RUnlock()

	if found {
		if user, ok := cachedUser.(*models.User); ok {
			return user, nil
		}
	}

	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	// Store the user in the cache.
	r.mu.Lock()
	r.cache.Set(cacheKey, &user, cache.DefaultExpiration)
	r.mu.Unlock()

	return &user, nil
}

func (r *UserRepositoryImpl) FindByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	cacheKey := fmt.Sprintf("user:id:%s", userID.Hex())

	// Try to get the user from the cache.
	r.mu.RLock()
	cachedUser, found := r.cache.Get(cacheKey)
	r.mu.RUnlock()

	if found {
		if user, ok := cachedUser.(*models.User); ok {
			return user, nil
		}
	}

	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to find user by ID: %w", err)
	}

	// Store the user in the cache.
	r.mu.Lock()
	r.cache.Set(cacheKey, &user, cache.DefaultExpiration)
	r.mu.Unlock()

	return &user, nil
}

func (r *UserRepositoryImpl) UpdateLastLogin(ctx context.Context, userID primitive.ObjectID) error {
	now := time.Now()
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$set": bson.M{
			"lastLogin": now,
			"updatedAt": now,
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to update last login: %w", err)
	}

	// Invalidate the cache for this user.
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}
func (r *UserRepositoryImpl) UpdatePassword(ctx context.Context, userID primitive.ObjectID, hashedPassword string) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": userID},
		bson.M{"$set": bson.M{
			"password":  hashedPassword,
			"updatedAt": time.Now(),
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}
	// Invalidate cache
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) ResetFailedAttempts(ctx context.Context, userID primitive.ObjectID) error {
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$set": bson.M{
			"failedAttempts": 0,
			"lockUntil":      nil,
			"updatedAt":      time.Now(),
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to reset failed attempts: %w", err)
	}
	// Invalidate cache
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) IncrementFailedAttempts(ctx context.Context, userID primitive.ObjectID) error {
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$inc": bson.M{"failedAttempts": 1}},
	)
	if err != nil {
		return fmt.Errorf("failed to increment failed attempts: %w", err)
	}
	// Invalidate cache
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) LockAccount(ctx context.Context, userID primitive.ObjectID, until time.Time) error {
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$set": bson.M{
			"lockUntil": until,
			"updatedAt": time.Now(),
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to lock account: %w", err)
	}
	// Invalidate cache
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) StoreRefreshToken(ctx context.Context, userID primitive.ObjectID, token string) error {
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$set": bson.M{
			"refreshToken": models.RefreshToken{Token: token, ExpiresAt: time.Now().Add(time.Hour * 24 * 7)}, // Example expiration
			"updatedAt":    time.Now(),
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to store refresh token: %w", err)
	}
	// Invalidate cache
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}
func (r *UserRepositoryImpl) UpdateFailedLogin(ctx context.Context, userID primitive.ObjectID, attempts int, lockDuration time.Duration) error {
	now := time.Now()
	set := bson.M{
		"failedLogin.attempts":  attempts,
		"failedLogin.lastTry":   now,
		"failedLogin.lockUntil": nil, //Initialize
		"updatedAt":             now,
	}

	if lockDuration > 0 {
		set["failedLogin.lockUntil"] = now.Add(lockDuration)
	}

	_, err := r.collection.UpdateByID(ctx, userID, bson.M{"$set": set})
	if err != nil {
		return fmt.Errorf("failed to update failed login: %w", err)
	}
	// Invalidate cache
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")

	return nil
}

func (r *UserRepositoryImpl) StoreResetToken(ctx context.Context, email, hashedToken string, expiresAt time.Time) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": bson.M{
			"resetToken": bson.M{
				"token":     hashedToken,
				"expiresAt": expiresAt,
			},
			"updatedAt": time.Now(),
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to store reset token: %w", err)
	}
	// Find the user by email to get the ID for cache invalidation
	user, findErr := r.FindByEmail(ctx, email)
	if findErr == nil && user != nil {
		r.invalidateUserCache(user.ID) // Invalidate by ID
	}
	r.invalidateCache(fmt.Sprintf("user:email:%s", email)) //Also invalidate the email
	r.invalidateCache("find:*")
	return nil
}
func (r *UserRepositoryImpl) FindByResetToken(ctx context.Context, hashedToken string) (*models.User, error) {
	cacheKey := fmt.Sprintf("user:resetToken:%s", hashedToken)

	r.mu.RLock()
	cachedUser, found := r.cache.Get(cacheKey)
	r.mu.RUnlock()

	if found {
		if user, ok := cachedUser.(*models.User); ok {
			return user, nil
		}
	}

	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"resetToken.token": hashedToken}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to find user by reset token: %w", err)
	}
	if user.ResetToken == nil {
		return nil, ErrInvalidResetToken
	}
	if time.Now().After(user.ResetToken.ExpiresAt) {
		return nil, ErrInvalidResetToken
	}

	r.mu.Lock()
	r.cache.Set(cacheKey, &user, cache.DefaultExpiration)
	r.mu.Unlock()

	return &user, nil
}

func (r *UserRepositoryImpl) DeleteResetToken(ctx context.Context, userID primitive.ObjectID) error {
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$unset": bson.M{"resetToken": ""}, "$set": bson.M{"updatedAt": time.Now()}},
	)
	if err != nil {
		return fmt.Errorf("failed to delete reset token: %w", err)
	}
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) RotateRefreshToken(ctx context.Context, userID primitive.ObjectID, newToken string) error {
	_, err := r.collection.UpdateByID(
		ctx,
		userID,
		bson.M{"$set": bson.M{
			"refreshToken": newToken,
			"updatedAt":    time.Now(),
		}},
	)
	if err != nil {
		return fmt.Errorf("failed to rotate refresh token: %w", err)
	}
	r.invalidateUserCache(userID)
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) FindByRefreshToken(ctx context.Context, token string) (*models.User, error) {
	cacheKey := fmt.Sprintf("user:refreshToken:%s", token)

	r.mu.RLock()
	cachedUser, found := r.cache.Get(cacheKey)
	r.mu.RUnlock()

	if found {
		if user, ok := cachedUser.(*models.User); ok {
			return user, nil
		}
	}

	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"refreshToken": token}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to find user by refresh token: %w", err)
	}

	r.mu.Lock()
	r.cache.Set(cacheKey, &user, cache.DefaultExpiration)
	r.mu.Unlock()

	return &user, nil
}

// --- Verification-related methods ---

func (r *UserRepositoryImpl) CreateVerificationToken(ctx context.Context, verification *models.Verification) error {
	collection := r.db.Collection("verificationTokens")
	_, err := collection.InsertOne(ctx, verification)
	if err != nil {
		return fmt.Errorf("failed to insert verification token: %w", err)
	}
	// Invalidate any cached queries related to verification tokens
	r.invalidateCache("verificationToken:*")

	return nil
}

func (r *UserRepositoryImpl) FindByVerificationToken(ctx context.Context, token string) (*models.Verification, error) {
	cacheKey := fmt.Sprintf("verificationToken:%s", token)

	r.mu.RLock()
	cachedVerification, found := r.cache.Get(cacheKey)
	r.mu.RUnlock()

	if found {
		if verification, ok := cachedVerification.(*models.Verification); ok {
			return verification, nil
		}
	}

	collection := r.db.Collection("verificationTokens")
	var verification models.Verification
	err := collection.FindOne(ctx, bson.M{"token": token}).Decode(&verification)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to find verification token: %w", err)
	}

	r.mu.Lock()
	r.cache.Set(cacheKey, &verification, cache.DefaultExpiration)
	r.mu.Unlock()
	return &verification, nil
}

func (r *UserRepositoryImpl) DeleteVerificationToken(ctx context.Context, id primitive.ObjectID) error {
	collection := r.db.Collection("verificationTokens")
	_, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete verification token: %w", err)
	}

	// Invalidate cache entries related to verification tokens.
	r.invalidateCache(fmt.Sprintf("verificationToken:%s", id.Hex()))
	r.invalidateCache("verificationToken:*") // Invalidate any list caches, etc.
	return nil
}

func (r *UserRepositoryImpl) UpdateVerificationStatus(ctx context.Context, email string, verified bool) error {
	filter := bson.M{"email": email}
	update := bson.M{"$set": bson.M{"isVerified": verified, "updatedAt": time.Now()}}

	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update verification status: %w", err)
	}
	if result.MatchedCount == 0 {
		return ErrNotFound
	}
	// Invalidate cache entries related to the user
	user, findErr := r.FindByEmail(ctx, email)
	if findErr == nil && user != nil {
		r.invalidateUserCache(user.ID) // Invalidate by ID
	}

	r.invalidateCache(fmt.Sprintf("user:email:%s", email)) //Also invalidate the email
	r.invalidateCache("find:*")

	return nil
}

// --- General user update methods ---

func (r *UserRepositoryImpl) UpdateUser(ctx context.Context, user *models.User) error {
	filter := bson.M{"_id": user.ID}
	update := bson.M{
		"$set": bson.M{
			"name":                   user.Name,
			"email":                  user.Email,
			"roles":                  user.Roles,
			"updatedAt":              time.Now(),
			"hasCompletedOnboarding": user.HasCompletedOnboarding,
		},
	}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	r.invalidateUserCache(user.ID)
	r.invalidateCache(fmt.Sprintf("user:email:%s", user.Email)) //Also invalidate the email
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) Update(ctx context.Context, user *models.User) error {
	filter := bson.M{"_id": user.ID}
	update := bson.M{"$set": user}

	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update user generally: %w", err)
	}

	if result.MatchedCount == 0 {
		return ErrNotFound
	}

	r.invalidateUserCache(user.ID)
	r.invalidateCache(fmt.Sprintf("user:email:%s", user.Email))
	r.invalidateCache("find:*")
	return nil
}

func (r *UserRepositoryImpl) Delete(ctx context.Context, userID primitive.ObjectID) error {
	filter := bson.M{"_id": userID}
	update := bson.M{
		"$set": bson.M{
			"status":    models.StatusSuspended,
			"updatedAt": time.Now(),
		},
	}

	result, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to soft delete user: %w", err)
	}

	if result.MatchedCount == 0 {
		return ErrNotFound
	}

	r.invalidateUserCache(userID)
	r.invalidateCache("find:*") // Invalidate any potential "find" queries
	return nil
}

// invalidateUserCache invalidates the cache for a specific user.
func (r *UserRepositoryImpl) invalidateUserCache(userID primitive.ObjectID) {
	cacheKey := fmt.Sprintf("user:id:%s", userID.Hex())
	r.mu.Lock()
	r.cache.Delete(cacheKey)
	r.mu.Unlock()
}

// invalidateCache invalidates cache entries based on a prefix.
func (r *UserRepositoryImpl) invalidateCache(prefix string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for key := range r.cache.Items() {
		if len(key) >= len(prefix) && key[:len(prefix)] == prefix {
			r.cache.Delete(key)
		}
	}
}

// package repositories

// import (
// 	"context"
// 	"errors"
// 	"fmt"
// 	"nalevel/models"
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// )

// var (
// 	ErrUserAlreadyExists = errors.New("user already exists")
// 	ErrNotFound          = errors.New("not found")
// 	ErrInvalidResetToken = errors.New("invalid reset token")
// 	ErrStaleData         = errors.New("stale data version")
// )

// type UserRepository interface {
// 	Create(context.Context, *models.User) (*models.User, error)
// 	FindByEmail(context.Context, string) (*models.User, error)
// 	FindByID(context.Context, primitive.ObjectID) (*models.User, error)
// 	UpdateLastLogin(context.Context, primitive.ObjectID) error
// 	UpdatePassword(ctx context.Context, userID primitive.ObjectID, hashedPassword string) error
// 	LockAccount(ctx context.Context, userID primitive.ObjectID, until time.Time) error
// 	IncrementFailedAttempts(ctx context.Context, userID primitive.ObjectID) error
// 	ResetFailedAttempts(ctx context.Context, userID primitive.ObjectID) error
// 	StoreRefreshToken(ctx context.Context, userID primitive.ObjectID, token string) error
// 	UpdateFailedLogin(ctx context.Context, userID primitive.ObjectID, attempts int, lockDuration time.Duration) error
// 	StoreResetToken(ctx context.Context, email, hashedToken string, expiresAt time.Time) error
// 	DeleteResetToken(ctx context.Context, userID primitive.ObjectID) error
// 	RotateRefreshToken(ctx context.Context, userID primitive.ObjectID, newToken string) error
// 	UpdateVerificationStatus(ctx context.Context, email string, verified bool) error
// 	FindByRefreshToken(ctx context.Context, token string) (*models.User, error)
// 	FindByResetToken(ctx context.Context, hashedToken string) (*models.User, error)

// 	Find(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error)
// 	FindByVerificationToken(ctx context.Context, token string) (*models.Verification, error)
// 	DeleteVerificationToken(ctx context.Context, id primitive.ObjectID) error

// 	UpdateUser(ctx context.Context, user *models.User) error // General user update
// 	Update(ctx context.Context, user *models.User) error
// 	Delete(ctx context.Context, userID primitive.ObjectID) error
// 	CreateVerificationToken(ctx context.Context, verification *models.Verification) error
// }

// type UserRepositoryImpl struct {
// 	db         *mongo.Database // Store the database, not just the users collection
// 	collection *mongo.Collection
// }

// func NewUserRepository(ctx context.Context, db *mongo.Database) (UserRepository, error) {
// 	collection := db.Collection("users")
// 	if err := createIndexes(ctx, collection); err != nil {
// 		return nil, err
// 	}
// 	// Create indexes for verificationTokens collection as well
// 	verificationCollection := db.Collection("verificationTokens")
// 	if err := createVerificationIndexes(ctx, verificationCollection); err != nil {
// 		return nil, err
// 	}
// 	return &UserRepositoryImpl{db: db, collection: collection}, nil // Store the database
// }

// func createIndexes(ctx context.Context, coll *mongo.Collection) error {
// 	indexModels := []mongo.IndexModel{
// 		{
// 			Keys:    bson.D{{Key: "email", Value: 1}},
// 			Options: options.Index().SetUnique(true),
// 		},
// 		{
// 			Keys:    bson.D{{Key: "refreshToken", Value: 1}},
// 			Options: options.Index().SetSparse(true),
// 		},
// 		{
// 			Keys:    bson.D{{Key: "resetToken.token", Value: 1}},
// 			Options: options.Index().SetExpireAfterSeconds(3600), // Auto-expire after 1 hour
// 		},
// 	}
// 	_, err := coll.Indexes().CreateMany(ctx, indexModels)
// 	return err
// }

// func createVerificationIndexes(ctx context.Context, coll *mongo.Collection) error {

// 	// Create new indexes
// 	indexModels := []mongo.IndexModel{
// 		{
// 			Keys:    bson.D{{Key: "token", Value: 1}},
// 			Options: options.Index().SetUnique(true).SetSparse(true).SetName("unique_token_index"),
// 		},
// 		{
// 			Keys:    bson.D{{Key: "expiresAt", Value: 1}},
// 			Options: options.Index().SetExpireAfterSeconds(0).SetName("expiresAt_ttl_index"),
// 		},
// 	}
// 	_, err := coll.Indexes().CreateMany(ctx, indexModels)
// 	return err
// }

// // --- User-related methods ---
// func (r *UserRepositoryImpl) Find(ctx context.Context, filter map[string]interface{}, page, limit int) ([]*models.User, int64, error) {
// 	if page <= 0 {
// 		page = 1
// 	}
// 	if limit <= 0 {
// 		limit = 10 // Default limit
// 	}

// 	skip := (page - 1) * limit

// 	// Convert the filter map to a bson.M object.  This is now done in the repository.
// 	bsonFilter := bson.M{}
// 	for k, v := range filter {
// 		bsonFilter[k] = v
// 	}

// 	// Add soft-delete filter.  Exclude users with status "suspended".
// 	bsonFilter["status"] = bson.M{"$ne": models.StatusSuspended}

// 	// Find with pagination options
// 	cursor, err := r.collection.Find(ctx, bsonFilter, options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)))
// 	if err != nil {
// 		return nil, 0, fmt.Errorf("failed to find users: %w", err)
// 	}
// 	defer cursor.Close(ctx)

// 	var users []*models.User
// 	if err := cursor.All(ctx, &users); err != nil {
// 		return nil, 0, fmt.Errorf("failed to decode users: %w", err)
// 	}

// 	// Get total count (without pagination)
// 	totalCount, err := r.collection.CountDocuments(ctx, bsonFilter)
// 	if err != nil {
// 		return nil, 0, fmt.Errorf("failed to count users: %w", err)
// 	}

// 	return users, totalCount, nil
// }

// func (r *UserRepositoryImpl) Create(ctx context.Context, user *models.User) (*models.User, error) {
// 	result, err := r.collection.InsertOne(ctx, user)
// 	if err != nil {
// 		// Handle duplicate key error (email already exists)
// 		if mongo.IsDuplicateKeyError(err) {
// 			return nil, ErrUserAlreadyExists
// 		}
// 		return nil, fmt.Errorf("failed to insert user: %w", err)
// 	}

// 	// Get the inserted ID and set it on the user object.  IMPORTANT!
// 	insertedID, ok := result.InsertedID.(primitive.ObjectID)
// 	if !ok {
// 		return nil, errors.New("failed to get inserted ID")
// 	}
// 	user.ID = insertedID
// 	return user, nil // Return the updated user object with the ID.

// }

// func (r *UserRepositoryImpl) FindByEmail(ctx context.Context, email string) (*models.User, error) {
// 	var user models.User
// 	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, ErrNotFound
// 		}
// 		return nil, fmt.Errorf("failed to find user by email: %w", err)
// 	}
// 	return &user, nil
// }

// func (r *UserRepositoryImpl) FindByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
// 	var user models.User
// 	err := r.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, ErrNotFound
// 		}
// 		return nil, fmt.Errorf("failed to find user by ID: %w", err)
// 	}
// 	return &user, nil
// }

// func (r *UserRepositoryImpl) UpdateLastLogin(ctx context.Context, userID primitive.ObjectID) error {
// 	now := time.Now()
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$set": bson.M{
// 			"lastLogin": now,
// 			"updatedAt": now,
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to update last login: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) UpdatePassword(ctx context.Context, userID primitive.ObjectID, hashedPassword string) error {
// 	_, err := r.collection.UpdateOne(
// 		ctx,
// 		bson.M{"_id": userID},
// 		bson.M{"$set": bson.M{
// 			"password":  hashedPassword,
// 			"updatedAt": time.Now(),
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to update password: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) ResetFailedAttempts(ctx context.Context, userID primitive.ObjectID) error {
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$set": bson.M{
// 			"failedAttempts": 0,
// 			"lockUntil":      nil,
// 			"updatedAt":      time.Now(),
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to reset failed attempts: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) IncrementFailedAttempts(ctx context.Context, userID primitive.ObjectID) error {
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$inc": bson.M{"failedAttempts": 1}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to increment failed attempts: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) LockAccount(ctx context.Context, userID primitive.ObjectID, until time.Time) error {
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$set": bson.M{
// 			"lockUntil": until,
// 			"updatedAt": time.Now(),
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to lock account: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) StoreRefreshToken(ctx context.Context, userID primitive.ObjectID, token string) error {
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$set": bson.M{
// 			"refreshToken": models.RefreshToken{Token: token, ExpiresAt: time.Now().Add(time.Hour * 24 * 7)}, // Example expiration
// 			"updatedAt":    time.Now(),
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to store refresh token: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) UpdateFailedLogin(ctx context.Context, userID primitive.ObjectID, attempts int, lockDuration time.Duration) error {
// 	now := time.Now()
// 	set := bson.M{
// 		"failedLogin.attempts":  attempts,
// 		"failedLogin.lastTry":   now,
// 		"failedLogin.lockUntil": nil, //Initialize
// 		"updatedAt":             now,
// 	}

// 	if lockDuration > 0 {
// 		set["failedLogin.lockUntil"] = now.Add(lockDuration)
// 	}

// 	_, err := r.collection.UpdateByID(ctx, userID, bson.M{"$set": set})
// 	if err != nil {
// 		return fmt.Errorf("failed to update failed login: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) StoreResetToken(ctx context.Context, email, hashedToken string, expiresAt time.Time) error {
// 	_, err := r.collection.UpdateOne(
// 		ctx,
// 		bson.M{"email": email},
// 		bson.M{"$set": bson.M{
// 			"resetToken": bson.M{
// 				"token":     hashedToken,
// 				"expiresAt": expiresAt,
// 			},
// 			"updatedAt": time.Now(),
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to store reset token: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) FindByResetToken(ctx context.Context, hashedToken string) (*models.User, error) {
// 	var user models.User
// 	err := r.collection.FindOne(ctx, bson.M{"resetToken.token": hashedToken}).Decode(&user)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, ErrNotFound
// 		}
// 		return nil, fmt.Errorf("failed to find user by reset token: %w", err)
// 	}
// 	if user.ResetToken == nil {
// 		return nil, ErrInvalidResetToken
// 	}
// 	// Check for token expiration
// 	if time.Now().After(user.ResetToken.ExpiresAt) {
// 		return nil, ErrInvalidResetToken // Or a specific ErrTokenExpired
// 	}
// 	return &user, nil
// }

// func (r *UserRepositoryImpl) DeleteResetToken(ctx context.Context, userID primitive.ObjectID) error {
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$unset": bson.M{"resetToken": ""}, "$set": bson.M{"updatedAt": time.Now()}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to delete reset token: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) RotateRefreshToken(ctx context.Context, userID primitive.ObjectID, newToken string) error {
// 	_, err := r.collection.UpdateByID(
// 		ctx,
// 		userID,
// 		bson.M{"$set": bson.M{
// 			"refreshToken": newToken,
// 			"updatedAt":    time.Now(),
// 		}},
// 	)
// 	if err != nil {
// 		return fmt.Errorf("failed to rotate refresh token: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) FindByRefreshToken(ctx context.Context, token string) (*models.User, error) {
// 	var user models.User
// 	err := r.collection.FindOne(ctx, bson.M{"refreshToken": token}).Decode(&user)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, ErrNotFound
// 		}
// 		return nil, fmt.Errorf("failed to find user by refresh token: %w", err)
// 	}
// 	return &user, nil
// }

// // --- Verification-related methods ---

// func (r *UserRepositoryImpl) CreateVerificationToken(ctx context.Context, verification *models.Verification) error {
// 	collection := r.db.Collection("verificationTokens") // Use the database, not the users collection
// 	_, err := collection.InsertOne(ctx, verification)
// 	if err != nil {
// 		return fmt.Errorf("failed to insert verification token: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) FindByVerificationToken(ctx context.Context, token string) (*models.Verification, error) {
// 	collection := r.db.Collection("verificationTokens") // Use the database
// 	var verification models.Verification
// 	err := collection.FindOne(ctx, bson.M{"token": token}).Decode(&verification)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, ErrNotFound
// 		}
// 		return nil, fmt.Errorf("failed to find verification token: %w", err)
// 	}
// 	return &verification, nil
// }

// func (r *UserRepositoryImpl) DeleteVerificationToken(ctx context.Context, id primitive.ObjectID) error {
// 	collection := r.db.Collection("verificationTokens") // Use the database
// 	_, err := collection.DeleteOne(ctx, bson.M{"_id": id})
// 	if err != nil {
// 		return fmt.Errorf("failed to delete verification token: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) UpdateVerificationStatus(ctx context.Context, email string, verified bool) error {
// 	filter := bson.M{"email": email}
// 	update := bson.M{"$set": bson.M{"isVerified": verified, "updatedAt": time.Now()}}

// 	result, err := r.collection.UpdateOne(ctx, filter, update)
// 	if err != nil {
// 		return fmt.Errorf("failed to update verification status: %w", err)
// 	}
// 	if result.MatchedCount == 0 {
// 		return ErrNotFound // User with the given email not found
// 	}
// 	return nil
// }

// // --- General user update methods ---

// func (r *UserRepositoryImpl) UpdateUser(ctx context.Context, user *models.User) error {
// 	// Ensure you're updating based on the user's ID
// 	filter := bson.M{"_id": user.ID}

// 	// Create an update document that includes only the fields you want to update
// 	update := bson.M{
// 		"$set": bson.M{
// 			"name":                   user.Name,
// 			"email":                  user.Email,
// 			"roles":                  user.Roles,
// 			"updatedAt":              time.Now(), // Always update the updatedAt field
// 			"hasCompletedOnboarding": user.HasCompletedOnboarding,
// 			// Add other fields you want to be updateable here
// 		},
// 	}

// 	_, err := r.collection.UpdateOne(ctx, filter, update)
// 	if err != nil {
// 		return fmt.Errorf("failed to update user: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) Update(ctx context.Context, user *models.User) error {

// 	filter := bson.M{"_id": user.ID}

// 	update := bson.M{
// 		"$set": user, //Set the whole user object
// 	}

// 	result, err := r.collection.UpdateOne(ctx, filter, update)
// 	if err != nil {
// 		return fmt.Errorf("failed to update user generally: %w", err)
// 	}

// 	if result.MatchedCount == 0 {
// 		return ErrNotFound // User not found
// 	}
// 	return nil
// }

// func (r *UserRepositoryImpl) Delete(ctx context.Context, userID primitive.ObjectID) error {

// 	filter := bson.M{"_id": userID}

// 	update := bson.M{
// 		"$set": bson.M{
// 			"status":    models.StatusSuspended, //Use soft delete
// 			"updatedAt": time.Now(),
// 		},
// 	}

// 	result, err := r.collection.UpdateOne(ctx, filter, update)
// 	if err != nil {
// 		return fmt.Errorf("failed to soft delete user: %w", err)
// 	}

// 	if result.MatchedCount == 0 {
// 		return ErrNotFound // User not found
// 	}
// 	return nil
// }
