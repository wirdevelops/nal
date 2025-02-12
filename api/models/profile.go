package models

// import (
// 	"time"

// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// // BaseProfile represents the common fields for all profiles.
// type BaseProfile struct {
// 	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id"`
// 	UserID           primitive.ObjectID `bson:"user_id" json:"userId" validate:"required"`                                                     // Reference to User
// 	Role             string             `bson:"role" json:"role" validate:"required,oneof=actor producer crew project-owner vendor ngo admin"` // Denormalized for easier querying
// 	Skills           []string           `bson:"skills" json:"skills"`
// 	Experience       []Experience       `bson:"experience" json:"experience"`
// 	Portfolio        []string           `bson:"portfolio" json:"portfolio" validate:"dive,url"`
// 	Availability     *time.Time         `bson:"availability,omitempty" json:"availability"`
// 	Location         *string            `bson:"location,omitempty" json:"location"`
// 	Bio              *string            `bson:"bio,omitempty" json:"bio"`
// 	Website          *string            `bson:"website,omitempty" json:"website" validate:"omitempty,url"`
// 	SocialMedia      *SocialMedia       `bson:"socialMedia,omitempty" json:"socialMedia"`
// 	Phone            *string            `bson:"phone,omitempty" json:"phone"`
// 	VerificationData *VerificationData  `bson:"verification_data,omitempty" json:"verificationData,omitempty"`
// }

// // Experience represents a work experience entry.
// type Experience struct {
// 	Title       string  `bson:"title" json:"title" validate:"required"`
// 	Role        string  `bson:"role" json:"role" validate:"required"`
// 	Duration    string  `bson:"duration" json:"duration" validate:"required"`
// 	Description *string `bson:"description,omitempty" json:"description"`
// }

// // SocialMedia represents social media links.
// type SocialMedia struct {
// 	LinkedIn  *string `bson:"linkedin,omitempty" json:"linkedin" validate:"omitempty,url"`
// 	Twitter   *string `bson:"twitter,omitempty" json:"twitter"`
// 	Instagram *string `bson:"instagram,omitempty" json:"instagram" validate:"omitempty,url"`
// }

// // VerificationData represents verification information.
// type VerificationData struct {
// 	IdentificationType   *string `bson:"identification_type,omitempty" json:"identificationType"`
// 	IdentificationNumber *string `bson:"identification_number,omitempty" json:"identificationNumber"`
// 	IssuingAuthority     *string `bson:"issuing_authority,omitempty" json:"issuingAuthority"`
// 	DateOfIssue          *string `bson:"date_of_issue,omitempty" json:"dateOfIssue"`
// 	ExpiryDate           *string `bson:"expiry_date,omitempty" json:"expiryDate"`
// 	ProofOfAddress       *string `bson:"proof_of_address,omitempty" json:"proofOfAddress"`
// }
