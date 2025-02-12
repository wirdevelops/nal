package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"nalevel/config"
	"nalevel/models"
	"nalevel/repositories"
	"nalevel/utils"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load configuration (including database connection details).
	cfg := config.LoadConfig() // Assuming you have a LoadConfig function

	// Get admin credentials from environment variables (REQUIRED).
	adminEmail := os.Getenv("ADMIN_EMAIL")
	adminPassword := os.Getenv("ADMIN_PASSWORD")

	if adminEmail == "" || adminPassword == "" {
		log.Fatal("ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set.")
	}

	// Connect to MongoDB.
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer func() {
		if err = client.Disconnect(context.Background()); err != nil {
			log.Println("Failed to disconnect from MongoDB:", err) // Use Println, not Fatal
		}
	}()

	db := client.Database(cfg.DBName)
	userRepo, err := repositories.NewUserRepository(context.Background(), db) // Assuming you have this

	// Create the admin user object.
	hashedPassword, err := utils.HashPassword(adminPassword, cfg.Auth.BcryptCost) // Hash the password
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	adminUser := &models.User{
		Name:       "Admin User", // Or get from environment variable
		Email:      adminEmail,
		Password:   hashedPassword,
		IsVerified: true, // Important: Admins should be verified by default.
		Roles:      []string{models.RoleAdmin},
		Status:     models.StatusActive, // Important: Admin should be active.
		// ... set other required fields ...
	}

	// Check if the admin user already exists.
	existingUser, err := userRepo.FindByEmail(context.Background(), adminEmail)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		log.Fatal("Error checking for existing admin user:", err)
	}
	if existingUser != nil {
		log.Println("Admin user already exists.  Skipping creation.")
		return // Exit if the admin already exists.
	}

	// Create the admin user in the database.
	_, err = userRepo.Create(context.Background(), adminUser)
	if err != nil {
		log.Fatal("Failed to create admin user:", err)
	}

	fmt.Println("Admin user created successfully.")
}
