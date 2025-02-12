package models

// import (
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // ProducerProfile represents a producer's profile.
// type ProducerProfile struct {
// 	BaseProfile          `bson:",inline"`
// 	CompanyName          string          `bson:"company_name" json:"companyName" validate:"required"`
// 	Projects             []Project       `bson:"projects" json:"projects"`
// 	Collaborations       []Collaboration `bson:"collaborations" json:"collaborations"`
// 	UnionAffiliations    []string        `bson:"union_affiliations" json:"unionAffiliations"`
// 	InsuranceInformation *string         `bson:"insurance_information,omitempty" json:"insuranceInformation"`
// }

// // Project represents a project in a producer's profile.
// type Project struct {
// 	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
// 	Title            string             `bson:"title" json:"title" validate:"required"`
// 	Genre            string             `bson:"genre" json:"genre" validate:"required"`
// 	ProductionType   string             `bson:"production_type" json:"productionType" validate:"oneof=film tv commercial theater"`
// 	Status           string             `bson:"status" json:"status" validate:"oneof=development pre-production production post-production released"`
// 	BudgetRange      *string            `bson:"budget_range,omitempty" json:"budgetRange"`
// 	FilmingLocations []string           `bson:"filming_locations" json:"filmingLocations"`
// }

// // Collaboration represents a collaboration in a producer's profile.
// type Collaboration struct {
// 	CollaboratorID primitive.ObjectID `bson:"collaborator_id" json:"collaboratorId" validate:"required"`
// 	Role           string             `bson:"role" json:"role" validate:"required"`
// 	ProjectID      primitive.ObjectID `bson:"project_id" json:"projectId" validate:"required"`
// }

// // NewProducerProfile creates a new ProducerProfile.
// func NewProducerProfile(userID primitive.ObjectID, role string) *ProducerProfile {
// 	return &ProducerProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		CompanyName:       "",
// 		Projects:          []Project{},
// 		Collaborations:    []Collaboration{},
// 		UnionAffiliations: []string{},
// 	}
// }
