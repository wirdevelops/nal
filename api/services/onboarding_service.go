package services

import (
	"context"
	"errors"
	"fmt"
	"nalevel/models"
	"nalevel/repositories"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Constants for onboarding stages (already defined - included for completeness)
const (
	StageRoleSelection = "role-selection"
	StageBasicInfo     = "basic-info"
	StageRoleDetails   = "role-details"
	StagePortfolio     = "portfolio" // if applicable
	StageVerification  = "verification"
	StageCompleted     = "completed"
)

type OnboardingServiceInterface interface {
	StartOnboarding(ctx context.Context, userID primitive.ObjectID, selectedRoles []string) error
	SetBasicInfo(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error
	SetRoleDetails(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error
	SetVerificationData(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error
	CompleteOnboarding(ctx context.Context, userID primitive.ObjectID) error
	GetOnboardingStatus(ctx context.Context, userID primitive.ObjectID) (string, error)

	AdvanceOnboarding(ctx context.Context, userID primitive.ObjectID, stage string, data map[string]interface{}) error // Advances to a specific stage
	SetOnboardingData(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error               // For updating the flexible data
	GetCurrentOnboardingStage(ctx context.Context, userID primitive.ObjectID) (string, error)
}

type OnboardingService struct {
	userRepo       repositories.UserRepository
	profileRepo    repositories.ProfileRepository
	profileService ProfileServiceInterface // Use the interface
	validate       *validator.Validate
}

func NewOnboardingService(userRepo repositories.UserRepository, profileRepo repositories.ProfileRepository, profileService ProfileServiceInterface) *OnboardingService {
	validate := validator.New()
	return &OnboardingService{
		userRepo:       userRepo,
		profileRepo:    profileRepo,
		profileService: profileService,
		validate:       validate,
	}
}

func (s *OnboardingService) StartOnboarding(ctx context.Context, userID primitive.ObjectID, selectedRoles []string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if user.Onboarding.Stage != "" && user.Onboarding.Stage != StageCompleted {
		return errors.New("user already started onboarding")
	}
	if user.Onboarding.Stage == StageCompleted {
		return errors.New("user already completed onboarding")
	}

	for _, role := range selectedRoles {
		if !isValidRole(role) {
			return fmt.Errorf("invalid role: %v", role)
		}
	}

	if err := s.validate.Var(selectedRoles, "required,dive,oneof=actor producer crew project-owner vendor ngo admin volunteer beneficiary donor partner seller employee"); err != nil {
		return fmt.Errorf("invalid roles: %w", err)
	}

	user.Roles = selectedRoles
	user.Onboarding.Stage = StageBasicInfo
	user.Onboarding.Completed = []string{StageRoleSelection}
	user.HasCompletedOnboarding = false // Set to false when starting

	return s.userRepo.Update(ctx, user)
}

func (s *OnboardingService) SetBasicInfo(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if user.Onboarding.Stage != StageBasicInfo {
		return errors.New("incorrect onboarding stage")
	}

	// Validate input data using validator
	if err := validateBasicInfoData(data); err != nil {
		return err
	}

	if location, ok := data["location"].(string); ok && location != "" {
		user.Location = &location
	}
	if phone, ok := data["phone"].(string); ok && phone != "" {
		user.Phone = &phone
	}
	if age, ok := data["age"].(float64); ok { //age come from front end as number
		ageInt := int(age) // Convert float64 to int
		user.Age = &ageInt
	}
	if sex, ok := data["sex"].(string); ok {
		user.Sex = &sex
	}

	user.Onboarding.Stage = StageRoleDetails
	user.Onboarding.Completed = append(user.Onboarding.Completed, StageBasicInfo)

	return s.userRepo.Update(ctx, user)
}

func (s *OnboardingService) SetRoleDetails(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if user.Onboarding.Stage != StageRoleDetails {
		return errors.New("incorrect onboarding stage")
	}

	for _, role := range user.Roles {
		existingProfile, err := s.profileRepo.GetByUserIDAndRole(ctx, userID, role)
		if err != nil && !errors.Is(err, repositories.ErrNotFound) {
			return fmt.Errorf("error checking for existing profile: %w", err)
		}

		if existingProfile != nil {
			if err := s.profileService.UpdateProfile(ctx, existingProfile.ID, data); err != nil {
				return fmt.Errorf("failed to update profile for role %s: %w", role, err)
			}
		} else {
			if err := s.profileService.CreateProfile(ctx, userID, role, data); err != nil {
				return fmt.Errorf("failed to create profile for role %s: %w", role, err)
			}
		}
	}

	user.Onboarding.Stage = StageVerification
	user.Onboarding.Completed = append(user.Onboarding.Completed, StageRoleDetails)

	return s.userRepo.Update(ctx, user)
}

func (s *OnboardingService) SetVerificationData(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if user.Onboarding.Stage != StageVerification {
		return errors.New("incorrect onboarding stage")
	}

	// Validate verification data
	if err := validateVerificationData(data); err != nil {
		return err
	}

	for _, role := range user.Roles {
		profile, err := s.profileRepo.GetByUserIDAndRole(ctx, userID, role)
		if err != nil {
			return fmt.Errorf("failed to get profile for role '%s': %w", role, err)
		}

		verificationData := models.VerificationData{}

		if idType, ok := data["identificationType"].(string); ok && idType != "" {
			verificationData.IdentificationType = &idType
		}
		if idNumber, ok := data["identificationNumber"].(string); ok && idNumber != "" {
			verificationData.IdentificationNumber = &idNumber
		}
		if authority, ok := data["issuingAuthority"].(string); ok && authority != "" {
			verificationData.IssuingAuthority = &authority
		}
		if issueDate, ok := data["dateOfIssue"].(string); ok && issueDate != "" {
			verificationData.DateOfIssue = &issueDate
		}
		if expiryDate, ok := data["expiryDate"].(string); ok && expiryDate != "" {
			verificationData.ExpiryDate = &expiryDate
		}
		if addressProof, ok := data["proofOfAddress"].(string); ok && addressProof != "" {
			verificationData.ProofOfAddress = &addressProof
		}

		profile.VerificationData = &verificationData

		if err := s.profileRepo.Update(ctx, profile); err != nil {
			return fmt.Errorf("failed to update profile for role '%s': %w", role, err)
		}
	}
	user.Onboarding.Stage = StageCompleted
	user.Onboarding.Completed = append(user.Onboarding.Completed, StageVerification)
	user.HasCompletedOnboarding = true // Set to true when completing

	return s.userRepo.Update(ctx, user)
}

func (s *OnboardingService) CompleteOnboarding(ctx context.Context, userID primitive.ObjectID) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if user.Onboarding.Stage != StageCompleted {
		return errors.New("onboarding not at completion stage")
	}

	if len(user.Onboarding.Completed) < 4 {
		return errors.New("onboarding stages are incomplete")
	}

	return s.userRepo.Update(ctx, user) // No changes needed, just confirm it's complete
}

func (s *OnboardingService) GetOnboardingStatus(ctx context.Context, userID primitive.ObjectID) (string, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return "", err
	}
	return user.Onboarding.Stage, nil
}

// isValidRole checks if a given role is valid.
func isValidRole(role string) bool {
	switch role {
	case models.RoleActor, models.RoleProducer, models.RoleCrew, models.RoleProjectOwner,
		models.RoleVendor, models.RoleNGO, models.RoleAdmin, models.RoleVolunteer,
		models.RoleBeneficiary, models.RoleDonor, models.RolePartner, models.RoleSeller,
		models.RoleEmployee:
		return true
	default:
		return false
	}
}

// validateBasicInfoData validates the basic info data.
func validateBasicInfoData(data map[string]interface{}) error {
	// Define a struct to represent the expected data structure
	type basicInfo struct {
		Location *string `validate:"omitempty"`
		Phone    *string `validate:"omitempty"`
		Age      *int    `validate:"omitempty,gte=18"`                  // Example: Age must be 18 or older
		Sex      *string `validate:"omitempty,oneof=male female other"` // Example:  Limit to specific values
	}

	// Convert the map to the struct
	var info basicInfo
	if location, ok := data["location"].(string); ok {
		info.Location = &location
	}
	if phone, ok := data["phone"].(string); ok {
		info.Phone = &phone
	}
	if age, ok := data["age"].(float64); ok {
		ageInt := int(age)
		info.Age = &ageInt
	}

	if sex, ok := data["sex"].(string); ok {
		info.Sex = &sex
	}

	// Validate the struct
	v := validator.New()
	return v.Struct(info)
}

// validateVerificationData validates the verification data.
func validateVerificationData(data map[string]interface{}) error {
	type verificationData struct {
		IdentificationType   *string `validate:"omitempty,oneof=id-card passport driver-license"`
		IdentificationNumber *string `validate:"omitempty"`
		IssuingAuthority     *string `validate:"omitempty"`
		DateOfIssue          *string `validate:"omitempty"` // Consider using time.Time and parsing
		ExpiryDate           *string `validate:"omitempty"` // Consider using time.Time
		ProofOfAddress       *string `validate:"omitempty"`
	}

	var vd verificationData
	if idType, ok := data["identificationType"].(string); ok {
		vd.IdentificationType = &idType
	}
	if idNumber, ok := data["identificationNumber"].(string); ok {
		vd.IdentificationNumber = &idNumber
	}
	if authority, ok := data["issuingAuthority"].(string); ok {
		vd.IssuingAuthority = &authority
	}
	if issueDate, ok := data["dateOfIssue"].(string); ok {
		vd.DateOfIssue = &issueDate
	}
	if expiryDate, ok := data["expiryDate"].(string); ok {
		vd.ExpiryDate = &expiryDate
	}
	if addressProof, ok := data["proofOfAddress"].(string); ok {
		vd.ProofOfAddress = &addressProof
	}

	v := validator.New()
	return v.Struct(vd)
}

// AdvanceOnboarding allows manually advancing (or potentially reverting) the onboarding stage.
func (s *OnboardingService) AdvanceOnboarding(ctx context.Context, userID primitive.ObjectID, stage string, data map[string]interface{}) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	// Validate the provided stage.
	if !isValidOnboardingStage(stage) { // You need to implement isValidOnboardingStage
		return fmt.Errorf("invalid onboarding stage: %s", stage)
	}

	// If there's data, process it according to the stage.
	if data != nil {
		switch stage {
		case StageBasicInfo:
			if err := s.SetBasicInfo(ctx, userID, data); err != nil { // Reuse existing methods
				return fmt.Errorf("failed to set basic info: %w", err)
			}
		case StageRoleDetails:
			if err := s.SetRoleDetails(ctx, userID, data); err != nil {
				return fmt.Errorf("failed to set role details: %w", err)
			}
		case StageVerification:
			if err := s.SetVerificationData(ctx, userID, data); err != nil {
				return fmt.Errorf("failed to set verification data: %w", err)
			}
		// Add cases for other stages as needed.  You could even handle StagePortfolio here.
		default:
			// For stages without specific data handling, you might just update the stage directly
			// But be CAREFUL with this.  Make sure you have proper validation and logging.
		}
	}
	currentStageIndex := -1
	for i, completedStage := range user.Onboarding.Completed {
		if completedStage == stage {
			currentStageIndex = i
			break
		}
	}
	if currentStageIndex == -1 {
		user.Onboarding.Completed = append(user.Onboarding.Completed, stage)
	}
	user.Onboarding.Stage = stage

	if stage == StageCompleted {
		user.HasCompletedOnboarding = true // Set to true when completing
	}

	return s.userRepo.Update(ctx, user) // Save changes
}

// SetOnboardingData allows updating the flexible Data field in the Onboarding struct.
func (s *OnboardingService) SetOnboardingData(ctx context.Context, userID primitive.ObjectID, data map[string]interface{}) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	// Merge the new data with any existing data.  This allows for incremental updates.
	if user.Onboarding.Data == nil {
		user.Onboarding.Data = make(map[string]interface{}) // Initialize if it's nil
	}
	for k, v := range data {
		user.Onboarding.Data[k] = v
	}

	return s.userRepo.Update(ctx, user)
}

func (s *OnboardingService) GetCurrentOnboardingStage(ctx context.Context, userID primitive.ObjectID) (string, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return "", err
	}

	return user.Onboarding.Stage, nil
}

// isValidOnboardingStage checks if a given stage is a valid onboarding stage.
func isValidOnboardingStage(stage string) bool {
	switch stage {
	case StageRoleSelection, StageBasicInfo, StageRoleDetails, StagePortfolio, StageVerification, StageCompleted:
		return true
	default:
		return false
	}
}
