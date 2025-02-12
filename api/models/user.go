package models

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// --- Constants (for enums) ---
const (
	// Roles
	RoleActor        = "actor"
	RoleProducer     = "producer"
	RoleCrew         = "crew"
	RoleProjectOwner = "project-owner"
	RoleVendor       = "vendor"
	RoleNGO          = "ngo"
	RoleAdmin        = "admin"
	RoleVolunteer    = "volunteer"   // Added based on your description
	RoleBeneficiary  = "beneficiary" // Added
	RoleDonor        = "donor"       // Added
	RolePartner      = "partner"     // Added for NGO partners, *and* general partnerships
	RoleSeller       = "seller"      // Added
	RoleEmployee     = "employee"    // Added

	// Onboarding Stages
	StageSetup         = "setup" //Initial stage for basic info
	StageRoleSelection = "role-selection"
	StageBasicInfo     = "basic-info"
	StageRoleDetails   = "role-details"
	StagePortfolio     = "portfolio"
	StageVerification  = "verification"
	StageCompleted     = "completed"

	// Production Types
	ProductionTypeFilm       = "film"
	ProductionTypeTV         = "tv"
	ProductionTypeCommercial = "commercial"
	ProductionTypeTheater    = "theater"
	ProductionTypeWebSeries  = "web-series" // Added
	ProductionTypePodcast    = "podcast"    // Added
	ProductionTypeOther      = "other"      // Added

	// Project Statuses (and User Status)
	StatusDevelopment    = "development"
	StatusPreProduction  = "pre-production"
	StatusProduction     = "production"
	StatusPostProduction = "post-production"
	StatusReleased       = "released"
	StatusActive         = "active"
	StatusInactive       = "inactive"
	StatusPending        = "pending"
	StatusSuspended      = "suspended" // Added

	// Privacy Settings
	PrivacyPublic      = "public"
	PrivacyPrivate     = "private"
	PrivacyConnections = "connections"

	// NGO Focus Areas
	FocusAreaEducation            = "education"
	FocusAreaEnvironment          = "environment"
	FocusAreaHealthcare           = "healthcare"
	FocusAreaHumanRights          = "human-rights"
	FocusAreaCommunityDevelopment = "community-development"
	FocusAreaTechnology           = "technology"       // Added
	FocusAreaEmergency            = "emergency"        //Added
	FocusAreaWomenEmpowering      = "women-empowering" // Added
	FocusAreaChild                = "child"            // Added

	// Partner Types (for NGO and general)
	PartnerTypeCorporate  = "corporate"
	PartnerTypeGovernment = "government"
	PartnerTypeNonProfit  = "non-profit"
	PartnerTypeIndividual = "individual" // Added

	// Partnership Levels (for NGO)
	PartnershipLevelStrategic   = "strategic"
	PartnershipLevelFinancial   = "financial"
	PartnershipLevelOperational = "operational"

	// Admin Access Levels
	AdminAccessSuperAdmin     = "super-admin"
	AdminAccessContentAdmin   = "content-admin"
	AdminAccessUserAdmin      = "user-admin"
	AdminAccessFinancialAdmin = "financial-admin"

	// Admin Managed Sections
	AdminSectionUsers       = "users"
	AdminSectionContent     = "content"
	AdminSectionProjects    = "projects"
	AdminSectionFinancial   = "financial"
	AdminSectionMarketplace = "marketplace" // Added
	AdminSectionBlog        = "blog"        // Added
	AdminSectionPodcast     = "podcast"     // Added

	//Verification
	VerificationTypeIDCard        = "id-card"
	VerificationTypePassport      = "passport"
	VerificationTypeDriverLicense = "driver-license"
)

// --- Helper Functions ---

// GenerateVerificationToken generates a new verification token.
func GenerateVerificationToken() (*VerificationToken, error) {
	tokenBytes, err := generateRandomBytes(32) // 32 bytes = 256 bits of entropy
	if err != nil {
		return nil, err
	}
	token := base64.URLEncoding.EncodeToString(tokenBytes)

	// Set expiration (e.g., 24 hours)
	expiresAt := time.Now().Add(24 * time.Hour)

	return &VerificationToken{
		Token:     token,
		ExpiresAt: expiresAt,
	}, nil
}

// generateRandomBytes generates secure random bytes.
func generateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}
	return b, nil
}

// --- Models ---

// BaseProfile represents the common fields for all profiles.
type BaseProfile struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID           primitive.ObjectID `bson:"user_id" json:"userId" validate:"required"`                                                                                                         // Reference to User
	Role             string             `bson:"role" json:"role" validate:"required,oneof=actor producer crew project-owner vendor ngo admin volunteer beneficiary donor partner seller employee"` // Denormalized for easier querying
	Skills           []string           `bson:"skills,omitempty" json:"skills,omitempty"`
	Experience       []Experience       `bson:"experience,omitempty" json:"experience,omitempty"`
	Portfolio        []string           `bson:"portfolio,omitempty" json:"portfolio,omitempty" validate:"dive,url"`
	Availability     *time.Time         `bson:"availability,omitempty" json:"availability,omitempty"`
	Location         *string            `bson:"location,omitempty" json:"location,omitempty"`
	Bio              *string            `bson:"bio,omitempty" json:"bio,omitempty"`
	Website          *string            `bson:"website,omitempty" json:"website,omitempty" validate:"omitempty,url"`
	SocialMedia      *SocialMedia       `bson:"socialMedia,omitempty" json:"socialMedia,omitempty"`
	Phone            *string            `bson:"phone,omitempty" json:"phone,omitempty"`
	VerificationData *VerificationData  `bson:"verification_data,omitempty" json:"verificationData,omitempty"`
}

// Experience represents a work experience entry.
type Experience struct {
	Title       string  `bson:"title" json:"title" validate:"required"`
	Role        string  `bson:"role" json:"role" validate:"required"`
	Duration    string  `bson:"duration" json:"duration" validate:"required"`
	Description *string `bson:"description,omitempty" json:"description,omitempty"`
}

// SocialMedia represents social media links.
type SocialMedia struct {
	LinkedIn  *string `bson:"linkedin,omitempty" json:"linkedin,omitempty" validate:"omitempty,url"`
	Twitter   *string `bson:"twitter,omitempty" json:"twitter,omitempty" validate:"omitempty,url"`
	Instagram *string `bson:"instagram,omitempty" json:"instagram,omitempty" validate:"omitempty,url"`
	Facebook  *string `bson:"facebook,omitempty" json:"facebook,omitempty" validate:"omitempty,url"` // Added
}

// VerificationData represents verification information.  This is a separate struct for flexibility.
type VerificationData struct {
	IdentificationType   *string `bson:"identification_type,omitempty" json:"identificationType,omitempty" validate:"omitempty,oneof=id-card passport driver-license"`
	IdentificationNumber *string `bson:"identification_number,omitempty" json:"identificationNumber,omitempty"`
	IssuingAuthority     *string `bson:"issuing_authority,omitempty" json:"issuingAuthority,omitempty"`
	DateOfIssue          *string `bson:"date_of_issue,omitempty" json:"dateOfIssue,omitempty"` // Could be *time.Time
	ExpiryDate           *string `bson:"expiry_date,omitempty" json:"expiryDate,omitempty"`    // Could be *time.Time
	ProofOfAddress       *string `bson:"proof_of_address,omitempty" json:"proofOfAddress,omitempty"`
}

// ActorProfile represents an actor's profile.
type ActorProfile struct {
	BaseProfile  `bson:",inline"`
	ActingStyles []string `bson:"acting_styles,omitempty" json:"actingStyles,omitempty"`
	Reels        []string `bson:"reels,omitempty" json:"reels,omitempty" validate:"dive,url"`
	UnionStatus  *string  `bson:"union_status,omitempty" json:"unionStatus,omitempty"`
	Headshot     *string  `bson:"headshot,omitempty" json:"headshot,omitempty" validate:"omitempty,url"` // Added
}

// NewActorProfile creates a new ActorProfile instance.
func NewActorProfile(userID primitive.ObjectID, role string) *ActorProfile {
	return &ActorProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		ActingStyles: []string{},
		Reels:        []string{},
	}
}

// AdminProfile represents an admin's profile.
type AdminProfile struct {
	BaseProfile     `bson:",inline"`
	AccessLevel     string            `bson:"access_level" json:"accessLevel" validate:"oneof=super-admin content-admin user-admin financial-admin"`
	ManagedSections []string          `bson:"managed_sections,omitempty" json:"managedSections,omitempty" validate:"dive,oneof=users content projects financial marketplace blog podcast"`
	LastAudit       *time.Time        `bson:"last_audit,omitempty" json:"lastAudit,omitempty"`
	Permissions     map[string]string `bson:"permissions,omitempty" json:"permissions,omitempty"` // Consider a more structured permission model
}

// NewAdminProfile creates a new AdminProfile.
func NewAdminProfile(userID primitive.ObjectID, role string) *AdminProfile {
	return &AdminProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		AccessLevel:     AdminAccessContentAdmin, // Or a default value
		ManagedSections: []string{},
		Permissions:     make(map[string]string), // Initialize
	}
}

// CrewProfile represents a crew member's profile.
type CrewProfile struct {
	BaseProfile    `bson:",inline"`
	Department     string   `bson:"department" json:"department" validate:"required"`
	Certifications []string `bson:"certifications,omitempty" json:"certifications,omitempty"`
	Equipment      []string `bson:"equipment,omitempty" json:"equipment,omitempty"`
}

// NewCrewProfile creates a new CrewProfile instance.
func NewCrewProfile(userID primitive.ObjectID, role string) *CrewProfile {
	return &CrewProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		Department:     "",
		Certifications: []string{},
		Equipment:      []string{},
	}
}

// NgoProfile represents an NGO's profile.
type NgoProfile struct {
	BaseProfile        `bson:",inline"`
	OrganizationName   string             `bson:"organization_name" json:"organizationName" validate:"required"`
	RegistrationNumber string             `bson:"registration_number" json:"registrationNumber" validate:"required"`
	FocusAreas         []string           `bson:"focus_areas,omitempty" json:"focusAreas,omitempty" validate:"dive,oneof=education environment healthcare human-rights community-development technology emergency women-empowering child"`
	Partners           []Partner          `bson:"partners,omitempty" json:"partners,omitempty"`
	ImpactMetrics      map[string]float64 `bson:"impact_metrics,omitempty" json:"impactMetrics,omitempty"`
	HoursLogged        float64            `bson:"hours_logged,omitempty" json:"hoursLogged,omitempty"`
	Background         string             `bson:"background,omitempty" json:"background,omitempty"`
	Website            *string            `bson:"website,omitempty" json:"website,omitempty" validate:"omitempty,url"`
	AnnualBudget       *float64           `bson:"annual_budget,omitempty" json:"annualBudget,omitempty"`
}

// Partner represents a partner of an NGO (or a general business partner).
type Partner struct {
	Name             string  `bson:"name" json:"name" validate:"required"`
	Type             string  `bson:"type" json:"type" validate:"oneof=corporate government non-profit individual"`
	PartnershipLevel *string `bson:"partnership_level,omitempty" json:"partnershipLevel,omitempty" validate:"omitempty,oneof=strategic financial operational"` // Optional for general partners
	ContactPerson    *string `bson:"contact_person,omitempty" json:"contactPerson,omitempty"`                                                                  // Added for better partner management
	ContactEmail     *string `bson:"contact_email,omitempty" json:"contactEmail,omitempty" validate:"omitempty,email"`                                         // Added
}

// NewNgoProfile creates a new NgoProfile.
func NewNgoProfile(userID primitive.ObjectID, role string) *NgoProfile {
	return &NgoProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		OrganizationName:   "",
		RegistrationNumber: "",
		FocusAreas:         []string{},
		Partners:           []Partner{},
		ImpactMetrics:      make(map[string]float64), // Initialize the map
		Website:            nil,
		AnnualBudget:       nil,
	}
}

// ProducerProfile represents a producer's profile.
type ProducerProfile struct {
	BaseProfile          `bson:",inline"`
	CompanyName          string          `bson:"company_name" json:"companyName" validate:"required"`
	Projects             []Project       `bson:"projects,omitempty" json:"projects,omitempty"`
	Collaborations       []Collaboration `bson:"collaborations,omitempty" json:"collaborations,omitempty"`
	UnionAffiliations    []string        `bson:"union_affiliations,omitempty" json:"unionAffiliations,omitempty"`
	InsuranceInformation *string         `bson:"insurance_information,omitempty" json:"insuranceInformation,omitempty"`
}

// Project represents a project in a producer's profile (or a project owner's).
type Project struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title            string             `bson:"title" json:"title" validate:"required"`
	Genre            string             `bson:"genre" json:"genre" validate:"required"`
	ProductionType   string             `bson:"production_type" json:"productionType" validate:"oneof=film tv commercial theater web-series podcast other"`
	Status           string             `bson:"status" json:"status" validate:"oneof=development pre-production production post-production released"`
	BudgetRange      *string            `bson:"budget_range,omitempty" json:"budgetRange,omitempty"`
	FilmingLocations []string           `bson:"filming_locations,omitempty" json:"filmingLocations,omitempty"`
	Synopsis         *string            `bson:"synopsis,omitempty" json:"synopsis,omitempty"`    //added
	StartDate        *time.Time         `bson:"start_date,omitempty" json:"startDate,omitempty"` //added
	EndDate          *time.Time         `bson:"end_date,omitempty" json:"endDate,omitempty"`     //added
}

// Collaboration represents a collaboration in a producer's profile.
type Collaboration struct {
	CollaboratorID primitive.ObjectID `bson:"collaborator_id" json:"collaboratorId" validate:"required"`
	Role           string             `bson:"role" json:"role" validate:"required"`
	ProjectID      primitive.ObjectID `bson:"project_id" json:"projectId" validate:"required"`
}

// NewProducerProfile creates a new ProducerProfile.
func NewProducerProfile(userID primitive.ObjectID, role string) *ProducerProfile {
	return &ProducerProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		CompanyName:       "",
		Projects:          []Project{},
		Collaborations:    []Collaboration{},
		UnionAffiliations: []string{},
	}
}

// ProjectOwnerProfile represents a project owner's profile.
type ProjectOwnerProfile struct {
	BaseProfile     `bson:",inline"`
	Organization    string           `bson:"organization" json:"organization" validate:"required"`
	Specialties     []string         `bson:"specialties,omitempty" json:"specialties,omitempty"`
	IMDBLink        *string          `bson:"imdb_link,omitempty" json:"imdbLink,omitempty" validate:"omitempty,url"`
	CurrentProjects []CurrentProject `bson:"current_projects,omitempty" json:"currentProjects,omitempty"`
	PastProjects    []PastProject    `bson:"past_projects,omitempty" json:"pastProjects,omitempty"`
	FundingSources  []string         `bson:"funding_sources,omitempty" json:"fundingSources,omitempty"`
}

// CurrentProject represents a current project.
type CurrentProject struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title             string             `bson:"title" json:"title" validate:"required"`
	Description       string             `bson:"description" json:"description" validate:"required"`
	StartDate         time.Time          `bson:"start_date" json:"startDate" validate:"required"`
	EndDate           *time.Time         `bson:"end_date,omitempty" json:"endDate,omitempty"`
	RequiredResources []string           `bson:"required_resources,omitempty" json:"requiredResources,omitempty"`
}

// PastProject represents a past project.
type PastProject struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title         string             `bson:"title" json:"title" validate:"required"`
	Outcome       string             `bson:"outcome" json:"outcome" validate:"required"`
	ImpactMetrics map[string]float64 `bson:"impact_metrics,omitempty" json:"impactMetrics,omitempty"`
}

// NewProjectOwnerProfile creates a new ProjectOwnerProfile.
func NewProjectOwnerProfile(userID primitive.ObjectID, role string) *ProjectOwnerProfile {
	return &ProjectOwnerProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		Organization:    "",
		Specialties:     []string{},
		CurrentProjects: []CurrentProject{},
		PastProjects:    []PastProject{},
		FundingSources:  []string{},
	}
}

// VendorProfile represents a vendor's profile.
type VendorProfile struct {
	BaseProfile    `bson:",inline"`
	BusinessName   string          `bson:"business_name" json:"businessName" validate:"required"`
	StoreName      *string         `bson:"store_name,omitempty" json:"storeName,omitempty"`
	SellerRating   *float64        `bson:"seller_rating,omitempty" json:"sellerRating,omitempty"`
	Services       []string        `bson:"services,omitempty" json:"services,omitempty"`
	PaymentMethods []string        `bson:"payment_methods,omitempty" json:"paymentMethods,omitempty"`
	Inventory      []InventoryItem `bson:"inventory,omitempty" json:"inventory,omitempty"`
}

// InventoryItem represents an item in a vendor's inventory.
type InventoryItem struct {
	Category string   `bson:"category" json:"category" validate:"required"`
	Items    []string `bson:"items,omitempty" json:"items,omitempty" validate:"required"`
}

// NewVendorProfile creates a new VendorProfile.
func NewVendorProfile(userID primitive.ObjectID, role string) *VendorProfile {
	return &VendorProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		BusinessName:   "",
		Services:       []string{},
		PaymentMethods: []string{},
		Inventory:      []InventoryItem{},
	}
}

// VolunteerProfile represents a volunteer's profile.
type VolunteerProfile struct {
	BaseProfile    `bson:",inline"`
	Interests      []string    `bson:"interests,omitempty" json:"interests,omitempty"`
	HoursAvailable *int        `bson:"hours_available,omitempty" json:"hoursAvailable,omitempty"` //Added
	References     []Reference `bson:"references,omitempty" json:"references,omitempty"`          // Added for better reliability
}

// Reference represents a reference for a volunteer or employee.
type Reference struct {
	Name         string `bson:"name" json:"name" validate:"required"`
	Relationship string `bson:"relationship" json:"relationship" validate:"required"`
	Contact      string `bson:"contact" json:"contact" validate:"required"`
}

// NewVolunteerProfile creates a new VolunteerProfile.
func NewVolunteerProfile(userID primitive.ObjectID, role string) *VolunteerProfile {
	return &VolunteerProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{}, // Initialize slices to avoid nil pointers
			Experience: []Experience{},
			Portfolio:  []string{},
		},
		Interests:  []string{},
		References: []Reference{},
	}
}

// BeneficiaryProfile represents a beneficiary's profile.
type BeneficiaryProfile struct {
	BaseProfile `bson:",inline"`
	Needs       []string `bson:"needs,omitempty" json:"needs,omitempty"`
	CaseHistory *string  `bson:"case_history,omitempty" json:"caseHistory,omitempty"` // Added
}

// NewBeneficiaryProfile creates a new BeneficiaryProfile.
func NewBeneficiaryProfile(userID primitive.ObjectID, role string) *BeneficiaryProfile {
	return &BeneficiaryProfile{
		BaseProfile: BaseProfile{
			UserID: userID,
			Role:   role,
			// Skills, Experience, and Portfolio are less relevant for a beneficiary,
			// but we keep them in BaseProfile for consistency.  They could be used
			// to track skills they *want* to develop, for example.
		},
		Needs: []string{},
	}
}

// DonorProfile represents a donor's profile.
type DonorProfile struct {
	BaseProfile   `bson:",inline"`
	DonationTypes []string  `bson:"donation_types,omitempty" json:"donationTypes,omitempty"` // e.g., "financial", "in-kind"
	GivingHistory []float64 `bson:"giving_history,omitempty" json:"givingHistory,omitempty"` // Track donation amounts
	TaxID         *string   `bson:"tax_id,omitempty" json:"taxId,omitempty"`                 // For tax purposes
	Preferences   *string   `bson:"preferences,omitempty" json:"preferences,omitempty"`      // For Matching
}

// NewDonorProfile creates a new DonorProfile.
func NewDonorProfile(userID primitive.ObjectID, role string) *DonorProfile {
	return &DonorProfile{
		BaseProfile: BaseProfile{
			UserID: userID,
			Role:   role,
		},
		DonationTypes: []string{},
		GivingHistory: []float64{},
	}
}

// PartnerProfile represents a general partner profile.
type PartnerProfile struct {
	BaseProfile        `bson:",inline"`
	PartnershipType    string   `bson:"partnership_type" json:"partnershipType" validate:"required,oneof=corporate government non-profit individual"`
	CollaborationAreas []string `bson:"collaboration_areas,omitempty" json:"collaborationAreas,omitempty"` // What areas they want to collaborate on
	Resources          *string  `bson:"resources,omitempty" json:"resources,omitempty"`                    //Added
}

// NewPartnerProfile creates a new PartnerProfile.
func NewPartnerProfile(userID primitive.ObjectID, role string) *PartnerProfile {
	return &PartnerProfile{
		BaseProfile: BaseProfile{
			UserID: userID,
			Role:   role,
		},
		CollaborationAreas: []string{},
	}
}

// SellerProfile represents a seller's profile (on a marketplace).
type SellerProfile struct {
	BaseProfile      `bson:",inline"`
	SellerType       string    `bson:"seller_type" json:"sellerType" validate:"required"` // e.g., "individual", "business"
	ProductsServices []string  `bson:"products_services,omitempty" json:"productsServices,omitempty"`
	Ratings          []float64 `bson:"ratings,omitempty" json:"ratings,omitempty"`
	SalesHistory     *float64  `bson:"sales_history,omitempty" json:"sales_history,omitempty"` // Track sales volume/value
}

// NewSellerProfile creates a new SellerProfile.
func NewSellerProfile(userID primitive.ObjectID, role string) *SellerProfile {
	return &SellerProfile{
		BaseProfile: BaseProfile{
			UserID: userID,
			Role:   role,
		},
		ProductsServices: []string{},
		Ratings:          []float64{},
	}
}

// EmployeeProfile represents an employee's profile.
type EmployeeProfile struct {
	BaseProfile `bson:",inline"`
	Department  string      `bson:"department" json:"department" validate:"required"`
	JobTitle    string      `bson:"job_title" json:"jobTitle" validate:"required"`
	StartDate   time.Time   `bson:"start_date" json:"startDate" validate:"required"`
	EndDate     *time.Time  `bson:"end_date,omitempty" json:"endDate,omitempty"`      // Optional
	ManagerID   *string     `bson:"manager_id,omitempty" json:"managerId,omitempty"`  // Reference to another user (manager)
	References  []Reference `bson:"references,omitempty" json:"references,omitempty"` // Added for better reliability
}

// NewEmployeeProfile creates a new EmployeeProfile.
func NewEmployeeProfile(userID primitive.ObjectID, role string) *EmployeeProfile {
	return &EmployeeProfile{
		BaseProfile: BaseProfile{
			UserID:     userID,
			Role:       role,
			Skills:     []string{},
			Experience: []Experience{}, // Employees likely have experience
		},
		Department: "",
		JobTitle:   "",
		StartDate:  time.Now(), // Set a default start date
		References: []Reference{},
	}
}

// --- User and Auth Related Models ---

// User represents the main user data.
type User struct {
	ID                     primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name                   string             `bson:"name" json:"name" validate:"required"`
	Email                  string             `bson:"email" json:"email" validate:"required,email"`
	Password               string             `bson:"password" json:"-" validate:"required,min=8"`                                                                                                              // Hashed password
	IsVerified             bool               `bson:"isVerified" json:"isVerified"`                                                                                                                             // Consistent camelCase
	Roles                  []string           `bson:"roles" json:"roles" validate:"required,dive,oneof=actor producer crew project-owner vendor ngo admin volunteer beneficiary donor partner seller employee"` // Use constants
	LastLogin              *time.Time         `bson:"lastLogin,omitempty" json:"lastLogin,omitempty"`
	CreatedAt              time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt              time.Time          `bson:"updatedAt" json:"updatedAt"`
	IPAddress              string             `bson:"ipAddress,omitempty" json:"-"` // Store IP for security/auditing.  Don't expose in JSON responses.
	FailedAttempts         int                `bson:"failedAttempts,omitempty" json:"-"`
	LockUntil              *time.Time         `bson:"lockUntil,omitempty" json:"-"`
	FailedLogin            FailedLogin        `bson:"failedLogin" json:"-"`
	RefreshToken           *RefreshToken      `bson:"refreshToken,omitempty" json:"-"` // Use the new RefreshToken struct, and pointer
	ResetToken             *ResetToken        `bson:"resetToken,omitempty" json:"-"`
	VerificationToken      *VerificationToken `bson:"verificationToken,omitempty" json:"-"`
	Avatar                 *string            `bson:"avatar,omitempty" json:"avatar,omitempty" validate:"omitempty,url"`
	ActiveRole             *string            `bson:"activeRole,omitempty" json:"activeRole,omitempty" validate:"omitempty,oneof=actor producer crew project-owner vendor ngo admin volunteer beneficiary donor partner seller employee"`
	Status                 string             `bson:"status" json:"status" validate:"required,oneof=active inactive pending suspended"` // Add status
	Onboarding             Onboarding         `bson:"onboarding" json:"onboarding"`
	Settings               UserSettings       `bson:"settings,omitempty" json:"settings,omitempty"` // Make omitempty
	Metadata               UserMetadata       `bson:"metadata" json:"metadata"`                     // Keep, as it has useful timestamps
	Location               *string            `bson:"location,omitempty" json:"location,omitempty"`
	Phone                  *string            `bson:"phone,omitempty" json:"phone,omitempty"`
	HasCompletedOnboarding bool               `bson:"hasCompletedOnboarding" json:"hasCompletedOnboarding"`
	Age                    *int               `bson:"age,omitempty" json:"age,omitempty"`                                              //Added
	Sex                    *string            `bson:"sex,omitempty" json:"sex,omitempty" validate:"omitempty,oneof=male female other"` //Added
}

// UserSettings stores user preferences.
type UserSettings struct {
	Notifications NotificationSettings `bson:"notifications,omitempty" json:"notifications,omitempty"`
	Privacy       PrivacySettings      `bson:"privacy,omitempty" json:"privacy,omitempty"`
}

// NotificationSettings controls notification preferences.
type NotificationSettings struct {
	Email    bool `bson:"email" json:"email"`
	Projects bool `bson:"projects" json:"projects"`
	Messages bool `bson:"messages" json:"messages"`
	System   bool `bson:"system,omitempty" json:"system,omitempty"` // Added for system-level notifications
}

// PrivacySettings controls privacy preferences.
type PrivacySettings struct {
	Profile     string `bson:"profile" json:"profile" validate:"oneof=public private connections"` // Use constants
	ContactInfo bool   `bson:"contactInfo" json:"contactInfo"`
	Searchable  *bool  `bson:"searchable,omitempty" json:"searchable,omitempty"` // Added - control if profile appears in searches
}

// Onboarding tracks the user's onboarding progress.
type Onboarding struct {
	Stage     string                 `bson:"stage" json:"stage" validate:"oneof=setup role-selection basic-info role-details portfolio verification completed"`
	Completed []string               `bson:"completed" json:"completed" validate:"dive,oneof=setup role-selection basic-info role-details portfolio verification completed"`
	Data      map[string]interface{} `bson:"data,omitempty" json:"data,omitempty"` // Flexible data storage
}

// UserMetadata stores additional user information.
type UserMetadata struct {
	CreatedAt      time.Time  `bson:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time  `bson:"updatedAt" json:"updatedAt"`
	LastActive     *time.Time `bson:"lastActive,omitempty" json:"lastActive,omitempty"`
	FailedAttempts int        `bson:"failedAttempts,omitempty" json:"failedAttempts,omitempty"` // This could be combined with FailedLogin
}

// UserVersion struct is for versioning of user
type UserVersion struct {
	UserID  primitive.ObjectID `bson:"userId" json:"userId"`
	Version int                `bson:"version" json:"version"`
}

// Verification represents email verification data.
type Verification struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    primitive.ObjectID `bson:"userId" json:"userId"`
	Email     string             `bson:"email" json:"email"`
	Token     string             `bson:"token" json:"token"` // Corrected field name
	ExpiresAt time.Time          `bson:"expiresAt" json:"expiresAt"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}

// ResetToken is for password reset.
type ResetToken struct {
	Token     string    `bson:"token" json:"token"`
	ExpiresAt time.Time `bson:"expiresAt" json:"expiresAt"`
}

// VerificationToken is for email verification.
type VerificationToken struct {
	Token     string    `bson:"token" json:"token"`
	ExpiresAt time.Time `bson:"expiresAt" json:"expiresAt"`
}

// FailedLogin tracks failed login attempts.
type FailedLogin struct {
	Attempts  int        `bson:"attempts" json:"attempts"`
	LastTry   time.Time  `bson:"lastTry" json:"lastTry"`
	LockUntil *time.Time `bson:"lockUntil,omitempty" json:"lockUntil,omitempty"`
}

// AuditLog represents a log entry for auditing purposes.
type AuditLog struct {
	ID        primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    *primitive.ObjectID `bson:"userId,omitempty" json:"userId,omitempty"` // Use pointer for optional user
	Action    string              `bson:"action" json:"action"`                     // e.g., "user_registered", "login_failed", "profile_updated"
	Details   string              `bson:"details,omitempty" json:"details,omitempty"`
	IPAddress string              `bson:"ip_address" json:"ipAddress"`
	Timestamp time.Time           `bson:"timestamp" json:"timestamp"`
}

// --- Request/Response Models ---
// RegistrationRequest represents the data required for user registration.
type RegistrationRequest struct {
	FirstName       string `json:"firstName" validate:"required,min=2,max=50"`
	LastName        string `json:"lastName" validate:"required,min=2,max=50"`
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
	IP              string `json:"-"` // Don't expose in JSON, but capture internally

}

// Validate validates the RegistrationRequest struct.
func (r *RegistrationRequest) Validate() error {
	return validate.Struct(r)
}

// LoginRequest represents the data required for user login.
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// PasswordResetRequest is used to initiate a password reset.
type PasswordResetRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// PasswordResetConfirmRequest is used to complete a password reset.
type PasswordResetConfirmRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8"`
}

// AuthTokens represents the access and refresh tokens.
type AuthTokens struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

// RefreshToken represents a refresh token with its expiration.
type RefreshToken struct {
	Token     string    `bson:"token" json:"token"` // The actual token string
	ExpiresAt time.Time `bson:"expiresAt" json:"expiresAt"`
}

// GenerateProfile is a factory function that creates a new profile based on the provided role.
func GenerateProfile(userID primitive.ObjectID, role string) (interface{}, error) {
	switch role {
	case RoleActor:
		return NewActorProfile(userID, role), nil
	case RoleProducer:
		return NewProducerProfile(userID, role), nil
	case RoleCrew:
		return NewCrewProfile(userID, role), nil
	case RoleProjectOwner:
		return NewProjectOwnerProfile(userID, role), nil
	case RoleVendor:
		return NewVendorProfile(userID, role), nil
	case RoleNGO:
		return NewNgoProfile(userID, role), nil
	case RoleAdmin:
		return NewAdminProfile(userID, role), nil
	case RoleVolunteer:
		return NewVolunteerProfile(userID, role), nil
	case RoleBeneficiary:
		return NewBeneficiaryProfile(userID, role), nil
	case RoleDonor:
		return NewDonorProfile(userID, role), nil
	case RolePartner:
		return NewPartnerProfile(userID, role), nil
	case RoleSeller:
		return NewSellerProfile(userID, role), nil
	case RoleEmployee:
		return NewEmployeeProfile(userID, role), nil
	default:
		return nil, fmt.Errorf("invalid role: %s", role)
	}
}

var validate *validator.Validate

func init() {
	validate = validator.New()
}

type Role struct {
	Name        string   `bson:"name" json:"name" validate:"required"`
	Permissions []string `bson:"permissions" json:"permissions"`
	IsActive    bool     `bson:"isActive" json:"isActive"` // Add an IsActive field
}
