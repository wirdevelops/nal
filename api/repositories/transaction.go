package repositories

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
)

// TransactionExecutor defines an interface for executing transactions
type TransactionExecutor interface {
	WithTransaction(ctx context.Context, fn func(sessCtx mongo.SessionContext) error) error
}

// MongoTransactionExecutor implements TransactionExecutor for MongoDB
type MongoTransactionExecutor struct {
	client *mongo.Client
}

func NewTransactionExecutor(client *mongo.Client) TransactionExecutor {
	return &MongoTransactionExecutor{client: client}
}

func (m *MongoTransactionExecutor) WithTransaction(ctx context.Context, fn func(sessCtx mongo.SessionContext) error) error {
	return m.client.UseSession(ctx, func(sessionContext mongo.SessionContext) error {
		err := sessionContext.StartTransaction()
		if err != nil {
			return fmt.Errorf("failed to start transaction: %w", err)
		}
		defer sessionContext.EndSession(ctx) // Ensure session is always closed

		err = fn(sessionContext)
		if err != nil {
			log.Printf("Transaction function returned error: %v", err)
			if abortErr := sessionContext.AbortTransaction(sessionContext); abortErr != nil {
				// Log both the original error and the abort error
				log.Printf("Failed to abort transaction: %v (original error: %v)", abortErr, err)
				return fmt.Errorf("failed to abort transaction: %w (original error: %v)", abortErr, err)
			}
			return err // Return the original error from fn
		}

		err = sessionContext.CommitTransaction(sessionContext)
		if err != nil {
			return fmt.Errorf("failed to commit transaction: %w", err)
		}
		return nil
	})
}
