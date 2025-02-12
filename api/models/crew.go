package models

// import (
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // CrewProfile represents a crew member's profile.
// type CrewProfile struct {
// 	BaseProfile    `bson:",inline"`
// 	Department     string   `bson:"department" json:"department" validate:"required"`
// 	Certifications []string `bson:"certifications" json:"certifications"`
// 	Equipment      []string `bson:"equipment" json:"equipment"`
// }

// // NewCrewProfile creates a new CrewProfile instance.
// func NewCrewProfile(userID primitive.ObjectID, role string) *CrewProfile {
// 	return &CrewProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		Department:     "",
// 		Certifications: []string{},
// 		Equipment:      []string{},
// 	}
// }
