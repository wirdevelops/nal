package models

// import (
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // ActorProfile represents an actor's profile.
// type ActorProfile struct {
// 	BaseProfile  `bson:",inline"`
// 	ActingStyles []string `bson:"acting_styles" json:"actingStyles"`
// 	Reels        []string `bson:"reels" json:"reels" validate:"dive,url"`
// 	UnionStatus  *string  `bson:"union_status,omitempty" json:"unionStatus"`
// }

// // NewActorProfile creates a new ActorProfile instance.
// func NewActorProfile(userID primitive.ObjectID, role string) *ActorProfile {
// 	return &ActorProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		ActingStyles: []string{},
// 		Reels:        []string{},
// 	}
// }
