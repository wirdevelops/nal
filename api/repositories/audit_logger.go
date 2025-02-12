// repositories/audit_log_repository.go

package repositories

import (
	"context"
	"fmt"
	"time"

	"nalevel/models" // Your models package

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AuditLogRepository interface {
	Create(ctx context.Context, logEntry *models.AuditLog) error
	FindByUser(ctx context.Context, userID primitive.ObjectID, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error)
	FindByAction(ctx context.Context, action string, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error)
	FindAll(ctx context.Context, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error)
}

type AuditLogRepositoryImpl struct {
	collection *mongo.Collection
}

func NewAuditLogRepository(db *mongo.Database) (AuditLogRepository, error) {
	collection := db.Collection("auditLogs")

	indexModels := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "timestamp", Value: -1}},
			Options: options.Index().SetName("timestamp_desc"),
		},
		{
			Keys:    bson.D{{Key: "userId", Value: 1}},
			Options: options.Index().SetSparse(true),
		},
		{
			Keys:    bson.D{{Key: "action", Value: 1}}, // Add index for action
			Options: options.Index().SetSparse(true),
		},
	}

	if _, err := collection.Indexes().CreateMany(context.Background(), indexModels); err != nil {
		return nil, fmt.Errorf("failed to create audit log indexes: %w", err)
	}

	return &AuditLogRepositoryImpl{collection: collection}, nil
}

func (r *AuditLogRepositoryImpl) Create(ctx context.Context, logEntry *models.AuditLog) error {
	if logEntry == nil {
		return fmt.Errorf("cannot insert nil audit log entry")
	}

	_, err := r.collection.InsertOne(ctx, logEntry)
	if err != nil {
		return fmt.Errorf("audit repo create failed: %w", err)
	}
	return nil
}

func (r *AuditLogRepositoryImpl) FindByUser(ctx context.Context, userID primitive.ObjectID, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error) {
	filter := bson.M{"userId": userID}
	return r.findWithPagination(ctx, filter, startTime, endTime, page, pageSize, lastID)
}

func (r *AuditLogRepositoryImpl) FindByAction(ctx context.Context, action string, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error) {
	filter := bson.M{"action": action}
	return r.findWithPagination(ctx, filter, startTime, endTime, page, pageSize, lastID)
}

func (r *AuditLogRepositoryImpl) FindAll(ctx context.Context, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error) {
	filter := bson.M{}
	return r.findWithPagination(ctx, filter, startTime, endTime, page, pageSize, lastID)
}

func (r *AuditLogRepositoryImpl) findWithPagination(ctx context.Context, filter bson.M, startTime, endTime *time.Time, page, pageSize int, lastIDString string) ([]models.AuditLog, int64, string, error) {
	if startTime != nil || endTime != nil {
		timeFilter := bson.M{}
		if startTime != nil {
			timeFilter["$gte"] = startTime.UTC()
		}
		if endTime != nil {
			timeFilter["$lte"] = endTime.UTC()
		}
		filter["timestamp"] = timeFilter
	}

	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, "", fmt.Errorf("failed to count documents: %w", err)
	}

	findOpts := options.Find().
		SetSort(bson.D{{Key: "timestamp", Value: -1}, {Key: "_id", Value: -1}}). // Sort by timestamp and _id
		SetLimit(int64(pageSize))

	if lastIDString != "" { // Only filter by _id if lastIDString is provided.
		lastID, err := primitive.ObjectIDFromHex(lastIDString)
		if err != nil {
			return nil, 0, "", fmt.Errorf("invalid lastID: %w", err)
		}
		filter["_id"] = bson.M{"$lt": lastID} // Use $lt for descending order
	}

	cursor, err := r.collection.Find(ctx, filter, findOpts)
	if err != nil {
		return nil, 0, "", fmt.Errorf("query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var logs []models.AuditLog
	if err := cursor.All(ctx, &logs); err != nil {
		return nil, 0, "", fmt.Errorf("decoding failed: %w", err)
	}

	nextLastID := ""
	if len(logs) > 0 {
		nextLastID = logs[len(logs)-1].ID.Hex() // Get Hex representation
	}

	return logs, total, nextLastID, nil
}
