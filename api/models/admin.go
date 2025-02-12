package models

// import (
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // AdminProfile represents an admin's profile.
// type AdminProfile struct {
// 	BaseProfile     `bson:",inline"`
// 	AccessLevel     string            `bson:"access_level" json:"accessLevel" validate:"oneof=super-admin content-admin user-admin financial-admin"`
// 	ManagedSections []string          `bson:"managed_sections" json:"managedSections" validate:"dive,oneof=users content projects financial"`
// 	LastAudit       *time.Time        `bson:"last_audit,omitempty" json:"lastAudit"`
// 	Permissions     map[string]string `bson:"permissions" json:"permissions"` // Consider a more structured permission model
// }

// // NewAdminProfile creates a new AdminProfile.
// func NewAdminProfile(userID primitive.ObjectID, role string) *AdminProfile {
// 	return &AdminProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		AccessLevel:     "content-admin", // Or a default value
// 		ManagedSections: []string{},
// 		Permissions:     make(map[string]string), // Initialize
// 	}
// }
