package models

// import (
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // ProjectOwnerProfile represents a project owner's profile.
// type ProjectOwnerProfile struct {
// 	BaseProfile     `bson:",inline"`
// 	Organization    string           `bson:"organization" json:"organization" validate:"required"`
// 	Specialties     []string         `bson:"specialties" json:"specialties"`
// 	IMDBLink        *string          `bson:"imdb_link,omitempty" json:"imdbLink" validate:"omitempty,url"`
// 	CurrentProjects []CurrentProject `bson:"current_projects" json:"currentProjects"`
// 	PastProjects    []PastProject    `bson:"past_projects" json:"pastProjects"`
// 	FundingSources  []string         `bson:"funding_sources" json:"fundingSources"`
// }

// // CurrentProject represents a current project.
// type CurrentProject struct {
// 	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
// 	Title             string             `bson:"title" json:"title" validate:"required"`
// 	Description       string             `bson:"description" json:"description" validate:"required"`
// 	StartDate         time.Time          `bson:"start_date" json:"startDate" validate:"required"`
// 	EndDate           *time.Time         `bson:"end_date,omitempty" json:"endDate"`
// 	RequiredResources []string           `bson:"required_resources" json:"requiredResources"`
// }

// // PastProject represents a past project.
// type PastProject struct {
// 	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
// 	Title         string             `bson:"title" json:"title" validate:"required"`
// 	Outcome       string             `bson:"outcome" json:"outcome" validate:"required"`
// 	ImpactMetrics map[string]float64 `bson:"impact_metrics" json:"impactMetrics"`
// }

// // NewProjectOwnerProfile creates a new ProjectOwnerProfile.
// func NewProjectOwnerProfile(userID primitive.ObjectID, role string) *ProjectOwnerProfile {
// 	return &ProjectOwnerProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		Organization:    "",
// 		Specialties:     []string{},
// 		CurrentProjects: []CurrentProject{},
// 		PastProjects:    []PastProject{},
// 		FundingSources:  []string{},
// 	}
// }
