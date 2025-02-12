// main.go
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"nalevel/config"
	"nalevel/events"
	"nalevel/handlers"
	"nalevel/middleware"
	"nalevel/models"
	"nalevel/repositories"
	"nalevel/services"
	"nalevel/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"golang.org/x/time/rate"
)

func main() {
	// --- Logging ---
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	// --- Environment Variables ---
	err := godotenv.Load()
	if err != nil {
		logger.Fatal("Error loading .env file", zap.Error(err))
	}

	// --- Configuration ---
	cfg := config.LoadConfig()

	// --- MongoDB Connection ---
	clientOptions := options.Client().ApplyURI(cfg.MongoURI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		logger.Fatal("Failed to connect to MongoDB", zap.Error(err))
	}
	db := client.Database(cfg.DBName)

	// --- Repositories ---
	userRepo, err := repositories.NewUserRepository(context.Background(), db)
	if err != nil {
		logger.Fatal("Failed to create user repository", zap.Error(err))
	}
	profileRepo, err := repositories.NewProfileRepository(context.Background(), db)
	if err != nil {
		logger.Fatal("Failed to create profile repository", zap.Error(err))
	}
	tokenBlacklist, err := repositories.NewTokenBlacklist(context.Background(), db)
	if err != nil {
		logger.Fatal("Failed to create token blacklist repository", zap.Error(err))
	}
	passwordHistory := repositories.NewPasswordHistory(db)
	auditRepo, err := repositories.NewAuditLogRepository(db)
	if err != nil {
		logger.Fatal("Failed to create audit log repository", zap.Error(err))
	}
	userVersionRepo := repositories.NewUserVersionRepository(db)
	roleRepo := repositories.NewRoleRepository(db)

	// --- Rate Limiter ---
	rateLimitConfig := utils.RateLimitConfig{
		DefaultRate:  rate.Limit(10),
		DefaultBurst: 20,
		CleanupIntvl: 5 * time.Minute,
		Expiration:   10 * time.Minute,
	}
	rateLimiter := utils.NewRateLimiter(rateLimitConfig)

	// --- Token Service ---
	tokenConfig := utils.TokenConfig{
		AccessTokenDuration:  15 * time.Minute,
		RefreshTokenDuration: 7 * 24 * time.Hour,
		Issuer:               "nalevel-empire",
		Audience:             "users",
	}
	jwtSecret := []byte(cfg.Auth.JWTSecret)

	tokenService, err := utils.NewTokenService(tokenConfig, jwtSecret, userVersionRepo)
	if err != nil {
		logger.Fatal("Failed to create token service", zap.Error(err))
	}

	// --- Email Service ---
	emailConfig := utils.EmailConfig{
		ProviderType:   "smtp",
		RetryCount:     3,
		RetryDelay:     2 * time.Second,
		RateLimit:      rate.Limit(5),
		FromName:       "Nalevel Empire",
		FromEmail:      cfg.EmailFrom,
		SendGridAPIKey: os.Getenv("SENDGRID_API_KEY"),
		SMTPConfig: utils.SMTPConfig{
			Host:     cfg.SMTPHost,
			Port:     587,
			Username: cfg.SMTPUser,
			Password: cfg.SMTPPassword,
		},
		AppURL: cfg.AppURL,
	}
	emailService, err := utils.NewEmailService(emailConfig)
	if err != nil {
		logger.Fatal("Failed to create email service", zap.Error(err))
	}

	// --- Kafka Event Manager ---
	kafkaConfig := &config.KafkaConfig{
		Brokers:         []string{"localhost:9092"},
		Topic:           "user-events", // Use the topic from .env
		GroupID:         "my-consumer-group",
		RequiredAcks:    int(kafka.RequireAll), // Corrected: Cast to int
		MaxRetries:      3,
		RetryBackoff:    1 * time.Second,
		DLQTopic:        "my-events-dlq", //  Make configurable in .env too
		AutoOffsetReset: "latest",
		CommitInterval:  1 * time.Second,
		BatchSize:       100,
		BatchTimeout:    1 * time.Second,
		ReadTimeout:     10 * time.Second,
	}

	eventManager, err := events.NewKafkaEventManager(kafkaConfig, logger)
	if err != nil {
		logger.Fatal("Failed to create event manager", zap.Error(err))
	}
	defer eventManager.Close()

	// --- Services ---
	authService, err := services.NewAuthService(
		cfg,
		userRepo,
		tokenService,
		emailService,
		rateLimiter,
		tokenBlacklist,
		passwordHistory,
		logger,
	)
	if err != nil {
		logger.Fatal("Failed to create auth service", zap.Error(err))
	}
	profileService := services.NewProfileService(profileRepo, userRepo)
	onboardingService := services.NewOnboardingService(userRepo, profileRepo, profileService)
	userService := services.NewUserService(userRepo, logger)
	auditService, err := services.NewAuditLogService(auditRepo, auditRepo, logger, &cfg.Audit)
	if err != nil {
		logger.Fatal("Failed to create audit log service", zap.Error(err))
	}
	roleService := services.NewRolePermissionService(roleRepo, userRepo)

	// --- Middleware ---
	authMiddleware := middleware.NewAuthMiddleware(tokenService, userRepo, rateLimiter, roleService)

	// --- Handlers ---
	authHandler := handlers.NewAuthHandler(authService, userService, authMiddleware)
	userHandler := handlers.NewUserHandler(userService, authMiddleware)
	adminHandler := handlers.NewAdminHandler(userService, auditService, roleService, onboardingService, profileService)
	onboardingHandler := handlers.NewOnboardingHandler(onboardingService, userService, authMiddleware)
	profileHandler := handlers.NewProfileHandler(profileService, authMiddleware)

	// --- Fiber App ---
	app := fiber.New()

	// --- Global Middleware ---
	app.Use(recover.New()) // Add recover middleware
	app.Use(middleware.IPAddressMiddleware())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		ExposeHeaders:    "Authorization",
	}))

	// --- Route Groups ---
	api := app.Group("/api/v1")

	// --- Apply Routes ---
	authHandler.ApplyRoutes(app)
	onboardingHandler.ApplyRoutes(app)
	profileHandler.ApplyRoutes(app)
	userHandler.ApplyRoutes(app)
	adminHandler.ApplyRoutes(app)

	// --- Protected Route Example ---
	api.Get("/protected", authMiddleware.JWTProtected(), func(c *fiber.Ctx) error {
		userID, _ := c.Locals("userID").(primitive.ObjectID)
		user, _ := c.Locals("user").(*models.User)

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message":    "Protected route accessed successfully",
			"userID":     userID.Hex(),
			"email":      user.Email,
			"isVerified": user.IsVerified,
			"status":     user.Status,
		})
	})

	// --- Graceful Shutdown ---
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
		<-sig

		logger.Info("Shutting down server...")
		if err := app.Shutdown(); err != nil {
			logger.Error("Error during server shutdown", zap.Error(err))
		}

		// --- Close MongoDB Connection ---
		if err := client.Disconnect(context.Background()); err != nil {
			logger.Error("Failed to disconnect from MongoDB", zap.Error(err))
		}

		logger.Info("Server gracefully stopped")
	}()

	// --- Start Server ---
	port := cfg.ServerPort
	if port == "" {
		port = "8080"
	}
	fmt.Println("Server is running on port:", port)
	if err := app.Listen(":" + port); err != nil {
		logger.Fatal("Server error", zap.Error(err))
	}
}
