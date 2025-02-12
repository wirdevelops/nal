// services/audit_log_service.go
package services

import (
	"context"
	"encoding/json"
	"fmt"
	"nalevel/config"
	"nalevel/models"
	"nalevel/repositories" // Your repositories package
	"time"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

type AuditLogServiceInterface interface {
	Log(ctx context.Context, action string, userID *primitive.ObjectID, details map[string]interface{}, ipAddress string) error
	GetLogsByUser(ctx context.Context, userID primitive.ObjectID, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error)
	GetLogsByAction(ctx context.Context, action string, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error)
	GetAllLogs(ctx context.Context, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error)
	Shutdown()
}

type AuditLogService struct {
	auditRepo   repositories.AuditLogRepository
	logChan     chan models.AuditLog
	stopChan    chan struct{}
	fallbackLog repositories.AuditLogRepository // For critical failures
	logger      *zap.Logger                     // Structured logger
	config      *config.AuditConfig             // Configuration struct
}

func DefaultConfig() *config.AuditConfig {
	return &config.AuditConfig{
		AsyncBufferSize: 1000,
		MaxRetries:      3,
		DBTimeout:       5 * time.Second,
	}
}

func NewAuditLogService(auditRepo repositories.AuditLogRepository, fallback repositories.AuditLogRepository, logger *zap.Logger, cfg *config.AuditConfig) (AuditLogServiceInterface, error) {
	if logger == nil {
		return nil, fmt.Errorf("logger cannot be nil")
	}
	if cfg == nil {
		cfg = DefaultConfig()
	}
	svc := &AuditLogService{
		auditRepo:   auditRepo,
		logChan:     make(chan models.AuditLog, cfg.AsyncBufferSize),
		stopChan:    make(chan struct{}),
		fallbackLog: fallback,
		logger:      logger,
		config:      cfg,
	}
	go svc.processLogs()
	return svc, nil
}

func (s *AuditLogService) Log(ctx context.Context, action string, userID *primitive.ObjectID, details map[string]interface{}, ipAddress string) error {

	if action == "" {
		return errors.New("audit log action cannot be empty")
	}
	if ipAddress == "" {
		return errors.New("ipAddress is required for audit logging")
	}

	logEntry := models.AuditLog{
		UserID:    userID,
		Action:    action,
		Details:   "",
		IPAddress: ipAddress,
		Timestamp: time.Now().UTC(),
	}

	if details != nil {
		if sanitized, err := sanitizeDetails(details); err == nil {
			detailsBytes, err := json.Marshal(sanitized)
			if err != nil {
				s.logger.Error("Failed to marshal audit details", zap.Error(err))
				return errors.Wrap(err, "failed to marshal audit details")
			}
			logEntry.Details = string(detailsBytes)
		} else {
			s.logger.Error("Failed to sanitize details", zap.Error(err))
		}
	}
	select {
	case s.logChan <- logEntry:
		// Successfully sent to channel
	default:
		s.logger.Warn("Audit log buffer full, falling back to direct write") // Log the fallback
		// Buffer full - fallback to direct write with timeout
		ctx, cancel := context.WithTimeout(ctx, s.config.DBTimeout)
		defer cancel()
		if err := s.auditRepo.Create(ctx, &logEntry); err != nil {
			s.logger.Error("Failed to write audit log directly", zap.Error(err))
			// Last-resort fallback with timeout
			ctx, cancel := context.WithTimeout(context.Background(), s.config.DBTimeout)
			defer cancel()
			if fbErr := s.fallbackLog.Create(ctx, &logEntry); fbErr != nil {
				s.logger.Error("CRITICAL: Audit log fallback failed", zap.Error(fbErr)) // Critical error!
			}
		}
	}
	return nil
}

func (s *AuditLogService) processLogs() {
	// ... (rest of processLogs, using s.logger and s.config) ...
	for {
		select {
		case entry := <-s.logChan:
			s.retryCreate(context.Background(), &entry)
		case <-s.stopChan:
			close(s.logChan)
			// Drain the channel before exiting
			for entry := range s.logChan {
				s.retryCreate(context.Background(), &entry)
			}
			return
		}
	}
}

func (s *AuditLogService) retryCreate(ctx context.Context, entry *models.AuditLog) {
	for i := 0; i < s.config.MaxRetries; i++ {
		ctx, cancel := context.WithTimeout(ctx, s.config.DBTimeout)
		err := s.auditRepo.Create(ctx, entry)
		cancel() // Cancel the context after each attempt
		if err == nil {
			return // Success
		}
		// Use structured logging:
		s.logger.Error("Failed to create audit log", zap.Error(err), zap.Int("attempt", i+1))
		time.Sleep(time.Duration(i*100) * time.Millisecond) // Backoff
	}

	// Final fallback with timeout
	ctx, cancel := context.WithTimeout(context.Background(), s.config.DBTimeout)
	defer cancel()
	if err := s.fallbackLog.Create(ctx, entry); err != nil {
		// Use structured logging:
		s.logger.Error("CRITICAL: Audit log fallback failed", zap.Error(err))
	}
}

func (s *AuditLogService) Shutdown() {
	s.stopChan <- struct{}{} // Signal the goroutine to stop.
	<-s.stopChan             // Wait for processLogs to finish by attempting a second receive.  Safe because we close stopChan in processLogs.
	close(s.stopChan)
}
func sanitizeDetails(details map[string]interface{}) (map[string]interface{}, error) {
	// Create a copy to avoid modifying the original map
	sanitized := make(map[string]interface{})
	for k, v := range details {
		sanitized[k] = v
	}

	// Redact sensitive fields
	if _, exists := sanitized["password"]; exists {
		sanitized["password"] = "[REDACTED]"
	}
	// Add more redactions as needed (e.g., credit card numbers, API keys, etc.)

	return sanitized, nil
}

func (s *AuditLogService) GetLogsByUser(ctx context.Context, userID primitive.ObjectID, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error) {
	ctx, cancel := context.WithTimeout(ctx, s.config.DBTimeout)
	defer cancel()
	logs, total, nextLastID, err := s.auditRepo.FindByUser(ctx, userID, startTime, endTime, page, pageSize, lastID)
	return logs, total, nextLastID, err
}
func (s *AuditLogService) GetLogsByAction(ctx context.Context, action string, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error) {
	ctx, cancel := context.WithTimeout(ctx, s.config.DBTimeout)
	defer cancel()
	logs, total, nextLastID, err := s.auditRepo.FindByAction(ctx, action, startTime, endTime, page, pageSize, lastID)
	return logs, total, nextLastID, err
}

func (s *AuditLogService) GetAllLogs(ctx context.Context, startTime, endTime *time.Time, page, pageSize int, lastID string) ([]models.AuditLog, int64, string, error) {
	ctx, cancel := context.WithTimeout(ctx, s.config.DBTimeout)
	defer cancel()
	logs, total, nextLastID, err := s.auditRepo.FindAll(ctx, startTime, endTime, page, pageSize, lastID)
	return logs, total, nextLastID, err
}
