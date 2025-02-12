package models

// import (
// 	"crypto/rand"
// 	"encoding/base64"
// 	"fmt"
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // --- Constants (for enums) ---
// const (
// 	RoleActor        = "actor"
// 	RoleProducer     = "producer"
// 	RoleCrew         = "crew"
// 	RoleProjectOwner = "project-owner"
// 	RoleVendor       = "vendor"
// 	RoleNGO          = "ngo"
// 	RoleAdmin        = "admin"

// 	StageRoleSelection = "role-selection"
// 	StageBasicInfo     = "basic-info"
// 	StageRoleDetails   = "role-details"
// 	StagePortfolio     = "portfolio"
// 	StageVerification  = "verification"
// 	StageCompleted     = "completed"

// 	// Other constants (ProductionType, Status, etc.)
// 	ProductionTypeFilm       = "film"
// 	ProductionTypeTV         = "tv"
// 	ProductionTypeCommercial = "commercial"
// 	ProductionTypeTheater    = "theater"

// 	StatusDevelopment    = "development"
// 	StatusPreProduction  = "pre-production"
// 	StatusProduction     = "production"
// 	StatusPostProduction = "post-production"
// 	StatusReleased       = "released"

// 	// ...Add all the Literal type to const for easy usage
// )

// // --- Helper Functions ---

// // GenerateVerificationToken generates a new verification token.
// func GenerateVerificationToken() (*VerificationToken, error) {
// 	tokenBytes, err := generateRandomBytes(32) // 32 bytes = 256 bits of entropy
// 	if err != nil {
// 		return nil, err
// 	}
// 	token := base64.URLEncoding.EncodeToString(tokenBytes)

// 	// Set expiration (e.g., 24 hours)
// 	expiresAt := time.Now().Add(24 * time.Hour)

// 	return &VerificationToken{
// 		Token:     token,
// 		ExpiresAt: expiresAt,
// 	}, nil
// }

// // generateRandomBytes generates secure random bytes.
// func generateRandomBytes(n int) ([]byte, error) {
// 	b := make([]byte, n)
// 	_, err := rand.Read(b)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return b, nil
// }

// // GenerateProfile is a factory function that creates a new profile based on the provided role.
// func GenerateProfile(userID primitive.ObjectID, role string) (interface{}, error) {
// 	switch role {
// 	case RoleActor:
// 		return NewActorProfile(userID, role), nil
// 	case RoleProducer:
// 		return NewProducerProfile(userID, role), nil
// 	case RoleCrew:
// 		return NewCrewProfile(userID, role), nil
// 	case RoleProjectOwner:
// 		return NewProjectOwnerProfile(userID, role), nil
// 	case RoleVendor:
// 		return NewVendorProfile(userID, role), nil
// 	case RoleNGO:
// 		return NewNgoProfile(userID, role), nil
// 	case RoleAdmin:
// 		return NewAdminProfile(userID, role), nil
// 	default:
// 		return nil, fmt.Errorf("invalid role: %s", role)
// 	}
// }
