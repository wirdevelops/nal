package models

// import (
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // NgoProfile represents an NGO's profile.
// type NgoProfile struct {
// 	BaseProfile        `bson:",inline"`
// 	OrganizationName   string             `bson:"organization_name" json:"organizationName" validate:"required"`
// 	RegistrationNumber string             `bson:"registration_number" json:"registrationNumber" validate:"required"`
// 	FocusAreas         []string           `bson:"focus_areas" json:"focusAreas" validate:"dive,oneof=education environment healthcare human-rights community-development"`
// 	Partners           []Partner          `bson:"partners" json:"partners"`
// 	ImpactMetrics      map[string]float64 `bson:"impact_metrics" json:"impactMetrics"`
// 	HoursLogged        float64            `bson:"hours_logged" json:"hoursLogged"`
// 	Background         string             `bson:"background" json:"background"`
// 	Website            *string            `bson:"website,omitempty" json:"website" validate:"omitempty,url"`
// 	AnnualBudget       *float64           `bson:"annual_budget,omitempty" json:"annualBudget"`
// }

// // Partner represents a partner of an NGO.
// type Partner struct {
// 	Name             string `bson:"name" json:"name" validate:"required"`
// 	Type             string `bson:"type" json:"type" validate:"oneof=corporate government non-profit"`
// 	PartnershipLevel string `bson:"partnership_level" json:"partnershipLevel" validate:"oneof=strategic financial operational"`
// }

// // NewNgoProfile creates a new NgoProfile.
// func NewNgoProfile(userID primitive.ObjectID, role string) *NgoProfile {
// 	return &NgoProfile{
// 		BaseProfile: BaseProfile{
// 			UserID:     userID,
// 			Role:       role,
// 			Skills:     []string{},
// 			Experience: []Experience{},
// 			Portfolio:  []string{},
// 		},
// 		OrganizationName:   "",
// 		RegistrationNumber: "",
// 		FocusAreas:         []string{},
// 		Partners:           []Partner{},
// 		ImpactMetrics:      make(map[string]float64), // Initialize the map
// 		Website:            nil,
// 		AnnualBudget:       nil,
// 	}
// }
