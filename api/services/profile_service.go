package services

import (
	"context"
	"errors"
	"fmt"
	"nalevel/models"
	"nalevel/repositories"
	"reflect"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProfileServiceInterface interface {
	CreateProfile(ctx context.Context, userID primitive.ObjectID, role string, data map[string]interface{}) error
	CreateInitialProfile(ctx context.Context, userID primitive.ObjectID, role string) error                     // Creates based on role
	GetProfileByUserIDAndRole(ctx context.Context, userID primitive.ObjectID, role string) (interface{}, error) // Returns the *specific* profile type
	UpdateProfile(ctx context.Context, profileID primitive.ObjectID, profileData map[string]interface{}) error  // Generic update
	GetProfileByID(ctx context.Context, profileID primitive.ObjectID) (interface{}, error)                      // Returns the *specific* profile
	GetProfilesByUserID(ctx context.Context, userID primitive.ObjectID) ([]interface{}, error)                  // Returns slice of *specific* profiles

	DeleteProfile(ctx context.Context, profileID primitive.ObjectID) error
	ListProfiles(ctx context.Context, filter map[string]interface{}, skip, limit int64, sort string) ([]interface{}, error) // Returns []interface{}
	FindProfilesBySkill(ctx context.Context, skill string) ([]interface{}, error)                                           // Returns []interface{}
	FindProfilesByLocation(ctx context.Context, location string) ([]interface{}, error)                                     // Returns []interface{}
	CountProfilesByRole(ctx context.Context, role string) (int64, error)

	UpdateActorProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.ActorProfile) error
	UpdateProducerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.ProducerProfile) error
	UpdateCrewProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.CrewProfile) error
	UpdateProjectOwnerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.ProjectOwnerProfile) error
	UpdateVendorProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.VendorProfile) error
	UpdateNgoProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.NgoProfile) error
	UpdateAdminProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.AdminProfile) error
	UpdateVolunteerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.VolunteerProfile) error
	UpdateBeneficiaryProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.BeneficiaryProfile) error
	UpdateDonorProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.DonorProfile) error
	UpdatePartnerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.PartnerProfile) error
	UpdateSellerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.SellerProfile) error
	UpdateEmployeeProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.EmployeeProfile) error
}

type ProfileService struct {
	profileRepo repositories.ProfileRepository
	userRepo    repositories.UserRepository // Inject UserRepository
	validate    *validator.Validate         // Inject validator
}

func NewProfileService(profileRepo repositories.ProfileRepository, userRepo repositories.UserRepository) ProfileServiceInterface {
	validate := validator.New() // Create a new validator instance
	return &ProfileService{profileRepo: profileRepo, userRepo: userRepo, validate: validate}
}

func (s *ProfileService) CreateProfile(ctx context.Context, userID primitive.ObjectID, role string, data map[string]interface{}) error {
	// 1. Validate the role.
	if !isValidRole(role) {
		return fmt.Errorf("invalid role: %s", role)
	}

	// 2. Fetch the user to ensure they exist.
	_, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err // Handle user not found or other DB errors.
	}

	// 3. Check if the user already has a profile for this role.
	existingProfile, err := s.profileRepo.GetByUserIDAndRole(ctx, userID, role)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		return err // Handle unexpected DB errors.
	}
	if existingProfile != nil {
		return fmt.Errorf("user already has a profile for role: %s", role)
	}

	// 4. Create and populate the appropriate profile struct.
	profile, err := models.GenerateProfile(userID, role)
	if err != nil {
		return err // Invalid role
	}

	// 5. Populate the profile using reflection and the data map.
	if err := populateProfile(profile, data); err != nil {
		return err
	}

	// 6. Validate the profile (important!).
	if err := s.validate.Struct(profile); err != nil {
		return fmt.Errorf("profile validation failed: %w", err)
	}

	// 7.  Convert the interface{} to a *models.BaseProfile for saving
	baseProfile, ok := convertToBasProfile(profile)
	if !ok {
		return errors.New("internal error: could not convert to BaseProfile")
	}

	//8 . Set ID
	baseProfile.ID = primitive.NewObjectID()
	// 9. Save the profile.
	return s.profileRepo.Create(ctx, baseProfile)
}

// GetProfileByUserIDAndRole retrieves a *specific* profile by user ID and role.
func (s *ProfileService) GetProfileByUserIDAndRole(ctx context.Context, userID primitive.ObjectID, role string) (interface{}, error) {
	// 1. Fetch the BaseProfile from the repository.
	baseProfile, err := s.profileRepo.GetByUserIDAndRole(ctx, userID, role)
	if err != nil {
		return nil, err // Handle not found or other DB errors
	}

	// 2. Create the *specific* profile type based on the role.
	profile, err := models.GenerateProfile(userID, baseProfile.Role)
	if err != nil {
		return nil, err // This should not happen if the data is consistent
	}

	// 3. Copy data from the BaseProfile to the specific profile.
	if err := copyFromBaseProfile(profile, baseProfile); err != nil {
		return nil, err
	}

	return profile, nil
}

// GetProfileByID now returns a specific profile type
func (s *ProfileService) GetProfileByID(ctx context.Context, profileID primitive.ObjectID) (interface{}, error) {
	baseProfile, err := s.profileRepo.GetByID(ctx, profileID)
	if err != nil {
		return nil, err
	}

	// Create the *specific* profile
	profile, err := models.GenerateProfile(baseProfile.UserID, baseProfile.Role)
	if err != nil {
		return nil, err // Should not happen with consistent data.
	}
	if err := copyFromBaseProfile(profile, baseProfile); err != nil {
		return nil, err
	}

	return profile, nil
}

// GetProfilesByUserID now returns a slice of specific profiles
func (s *ProfileService) GetProfilesByUserID(ctx context.Context, userID primitive.ObjectID) ([]interface{}, error) {
	baseProfiles, err := s.profileRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	specificProfiles := make([]interface{}, len(baseProfiles))
	for i, baseProfile := range baseProfiles {
		profile, err := models.GenerateProfile(baseProfile.UserID, baseProfile.Role)
		if err != nil {
			return nil, err
		}
		if err = copyFromBaseProfile(profile, baseProfile); err != nil {
			return nil, err
		}
		specificProfiles[i] = profile
	}
	return specificProfiles, nil
}

func (s *ProfileService) UpdateProfile(ctx context.Context, profileID primitive.ObjectID, updatedData map[string]interface{}) error {
	// 1. Fetch the existing profile.
	existingProfile, err := s.profileRepo.GetByID(ctx, profileID)
	if err != nil {
		return err // Handle not found or other DB errors.
	}

	// 2. Create the specific profile type based on the existing profile's role
	profile, err := models.GenerateProfile(existingProfile.UserID, existingProfile.Role)
	if err != nil {
		return err // Invalid role (shouldn't happen, but good to check)
	}

	// 3.  Copy data from BaseProfile to the specific profile type
	if err := copyFromBaseProfile(profile, existingProfile); err != nil {
		return err
	}

	// 4. Populate with the updated data
	if err := populateProfile(profile, updatedData); err != nil {
		return err
	}
	// 5. Validate the updated profile.
	if err := s.validate.Struct(profile); err != nil {
		return fmt.Errorf("profile validation failed after update: %w", err)
	}

	// 6. Convert back to *models.BaseProfile
	updatedBaseProfile, ok := convertToBasProfile(profile)
	if !ok {
		return errors.New("internal error: could not convert to BaseProfile")
	}
	updatedBaseProfile.ID = existingProfile.ID //make sure you are using the same id

	// 7. Save using the repository.
	return s.profileRepo.Update(ctx, updatedBaseProfile)
}

func (s *ProfileService) DeleteProfile(ctx context.Context, profileID primitive.ObjectID) error {
	return s.profileRepo.Delete(ctx, profileID)
}

// ListProfiles now returns a slice of interface{}
func (s *ProfileService) ListProfiles(ctx context.Context, filter map[string]interface{}, skip, limit int64, sort string) ([]interface{}, error) {
	baseProfiles, err := s.profileRepo.List(ctx, filter, skip, limit, sort)
	if err != nil {
		return nil, err
	}

	// Convert each BaseProfile to its specific type.
	result := make([]interface{}, len(baseProfiles))
	for i, base := range baseProfiles {
		specificProfile, err := models.GenerateProfile(base.UserID, base.Role)
		if err != nil {
			return nil, err // Should not happen if data is consistent
		}
		if err := copyFromBaseProfile(specificProfile, base); err != nil {
			return nil, err
		}
		result[i] = specificProfile
	}
	return result, nil
}

// FindProfilesBySkill now returns a slice of interface{}
func (s *ProfileService) FindProfilesBySkill(ctx context.Context, skill string) ([]interface{}, error) {
	baseProfiles, err := s.profileRepo.FindBySkill(ctx, skill)
	if err != nil {
		return nil, err
	}
	result := make([]interface{}, len(baseProfiles))
	for i, base := range baseProfiles {
		specificProfile, err := models.GenerateProfile(base.UserID, base.Role)
		if err != nil {
			return nil, err
		}
		if err := copyFromBaseProfile(specificProfile, base); err != nil {
			return nil, err
		}
		result[i] = specificProfile
	}
	return result, nil
}

// FindProfilesByLocation now returns a slice of interface{}
func (s *ProfileService) FindProfilesByLocation(ctx context.Context, location string) ([]interface{}, error) {
	baseProfiles, err := s.profileRepo.FindByLocation(ctx, location)
	if err != nil {
		return nil, err
	}
	result := make([]interface{}, len(baseProfiles))
	for i, base := range baseProfiles {
		specificProfile, err := models.GenerateProfile(base.UserID, base.Role)
		if err != nil {
			return nil, err
		}
		if err := copyFromBaseProfile(specificProfile, base); err != nil {
			return nil, err
		}
		result[i] = specificProfile
	}
	return result, nil
}

func (s *ProfileService) CountProfilesByRole(ctx context.Context, role string) (int64, error) {
	return s.profileRepo.CountByRole(ctx, role)
}

// --- Helper Functions ---

// populateProfile uses reflection to dynamically set profile fields.
func populateProfile(profile interface{}, data map[string]interface{}) error {
	val := reflect.ValueOf(profile)
	if val.Kind() == reflect.Ptr {
		val = val.Elem() // Dereference the pointer
	}

	for key, value := range data {
		field := val.FieldByName(key)
		if !field.IsValid() {
			// Try finding the field within embedded structs (like BaseProfile)
			found := false
			for i := 0; i < val.NumField(); i++ {
				fieldType := val.Type().Field(i)
				if fieldType.Anonymous && fieldType.Type.Kind() == reflect.Struct {
					embeddedField := val.Field(i).FieldByName(key)
					if embeddedField.IsValid() {
						field = embeddedField
						found = true
						break
					}
				}
				//handle social media
				if fieldType.Name == "SocialMedia" && fieldType.Type.Kind() == reflect.Ptr {
					if socialMediaData, ok := value.(map[string]interface{}); ok {
						socialMediaVal := val.Field(i)
						if socialMediaVal.IsNil() { //important
							socialMediaVal.Set(reflect.New(socialMediaVal.Type().Elem()))
						}
						if err := populateProfile(socialMediaVal.Interface(), socialMediaData); err != nil {
							return err
						}
						found = true
						break
					}
				}
			}
			if !found {
				continue // Skip if field doesn't exist
			}
		}

		if !field.CanSet() {
			continue // Skip if field can't be set
		}

		// Type conversion (handle slices, pointers, and basic types)
		switch field.Kind() {
		case reflect.String:
			if strVal, ok := value.(string); ok {
				field.SetString(strVal)
			}
		case reflect.Slice: // For []string
			if sliceVal, ok := value.([]interface{}); ok {
				stringSlice := make([]string, len(sliceVal))
				for i, item := range sliceVal {
					if strItem, ok := item.(string); ok {
						stringSlice[i] = strItem
					}
				}
				field.Set(reflect.ValueOf(stringSlice))
			}
		case reflect.Ptr: // For pointers to strings, etc.
			if field.Type().Elem().Kind() == reflect.String {
				if strVal, ok := value.(string); ok {
					field.Set(reflect.ValueOf(&strVal)) // Set pointer to string
				}
			}
		case reflect.Map:
			// Handle maps (like ImpactMetrics in NgoProfile).
			if field.Type().Key().Kind() == reflect.String && field.Type().Elem().Kind() == reflect.Float64 {
				if mapVal, ok := value.(map[string]interface{}); ok { //note interface{}
					newMap := reflect.MakeMap(field.Type())
					for k, v := range mapVal {
						if floatVal, ok := v.(float64); ok { //Type assertion here
							newMap.SetMapIndex(reflect.ValueOf(k), reflect.ValueOf(floatVal))
						}
					}
					field.Set(newMap)
				}
			}
			// Add other cases as needed (e.g., int, float64, bool, nested structs, etc.)
		default: //added default
			fieldValue := reflect.ValueOf(value)
			if fieldValue.Type().AssignableTo(field.Type()) {
				field.Set(fieldValue)
			}
		}
	}
	return nil
}

// convertToBaseProfile converts a specific profile type to a *models.BaseProfile.
func convertToBasProfile(profile interface{}) (*models.BaseProfile, bool) {
	val := reflect.ValueOf(profile)
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	baseProfile := &models.BaseProfile{}
	baseVal := reflect.ValueOf(baseProfile).Elem()

	// Iterate through the fields of the specific profile
	for i := 0; i < val.NumField(); i++ {
		fieldType := val.Type().Field(i)
		fieldValue := val.Field(i)

		// Handle embedded structs (like BaseProfile)
		if fieldType.Anonymous && fieldType.Type.Kind() == reflect.Struct {
			for j := 0; j < fieldValue.NumField(); j++ {
				embeddedFieldType := fieldValue.Type().Field(j)
				embeddedFieldValue := fieldValue.Field(j)

				// Find the corresponding field in BaseProfile and set its value
				if baseField := baseVal.FieldByName(embeddedFieldType.Name); baseField.IsValid() && baseField.CanSet() {
					baseField.Set(embeddedFieldValue)
				}
			}
		} else {
			// Find the corresponding field in BaseProfile and set its value
			if baseField := baseVal.FieldByName(fieldType.Name); baseField.IsValid() && baseField.CanSet() {
				baseField.Set(fieldValue)
			}
		}
	}

	return baseProfile, true
}

// copyFromBaseProfile copies data from a BaseProfile to a specific profile struct.
func copyFromBaseProfile(profile interface{}, base *models.BaseProfile) error {
	baseVal := reflect.ValueOf(base).Elem()
	profileVal := reflect.ValueOf(profile)
	if profileVal.Kind() == reflect.Ptr {
		profileVal = profileVal.Elem()
	}

	// Iterate over fields in BaseProfile
	for i := 0; i < baseVal.NumField(); i++ {
		baseFieldType := baseVal.Type().Field(i)
		baseFieldValue := baseVal.Field(i)

		// Find corresponding field in the specific profile
		profileField := profileVal.FieldByName(baseFieldType.Name)
		if profileField.IsValid() && profileField.CanSet() {
			profileField.Set(baseFieldValue)
			continue
		}
		// Handle embedded structs (like social media)
		if baseFieldType.Type.Kind() == reflect.Ptr && !baseFieldValue.IsNil() {
			if baseFieldType.Name == "SocialMedia" {
				profileField = profileVal.FieldByName(baseFieldType.Name)
				if profileField.IsValid() && profileField.CanSet() {
					if profileField.IsNil() { //important
						profileField.Set(reflect.New(profileField.Type().Elem()))
					}
					if err := copyFromBaseProfile(profileField.Interface(), &models.BaseProfile{
						SocialMedia: base.SocialMedia,
					}); err != nil {
						return err
					}
				}
			}
		}
	}

	return nil
}

// CreateInitialProfile creates a profile with default values based on the role.
func (s *ProfileService) CreateInitialProfile(ctx context.Context, userID primitive.ObjectID, role string) error {
	if !isValidRole(role) {
		return fmt.Errorf("invalid role: %s", role)
	}

	_, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	existingProfile, err := s.profileRepo.GetByUserIDAndRole(ctx, userID, role)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		return fmt.Errorf("error checking for existing profile: %w", err)
	}
	if existingProfile != nil {
		return fmt.Errorf("profile for role '%s' already exists", role)
	}

	profile, err := models.GenerateProfile(userID, role) // Uses factory function
	if err != nil {
		return err // Handle role not supported
	}

	if err := s.validate.Struct(profile); err != nil {
		return fmt.Errorf("validation failed for initial profile: %w", err)
	}

	baseProfile, ok := convertToBasProfile(profile)
	if !ok {
		return errors.New("could not convert to BaseProfile")
	}

	baseProfile.ID = primitive.NewObjectID()

	return s.profileRepo.Create(ctx, baseProfile)
}

func (s *ProfileService) UpdateActorProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.ActorProfile) error {
	// 1. Fetch the existing profile (using GetProfileByID and type assertion).
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.ActorProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}

	// 2. Update the fields of the existing profile with values from updatedProfile.
	//    Be careful to handle optional fields (pointers) correctly!
	existingProfile.ActingStyles = updatedProfile.ActingStyles
	existingProfile.Reels = updatedProfile.Reels
	existingProfile.UnionStatus = updatedProfile.UnionStatus
	existingProfile.Headshot = updatedProfile.Headshot

	// 3. Validate the updated profile.
	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	// 4. Convert back to BaseProfile
	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}

	// 5. Call the repository's Update method.
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateProducerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.ProducerProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.ProducerProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type")
	}

	existingProfile.CompanyName = updatedProfile.CompanyName
	existingProfile.Projects = updatedProfile.Projects
	existingProfile.Collaborations = updatedProfile.Collaborations
	existingProfile.UnionAffiliations = updatedProfile.UnionAffiliations
	existingProfile.InsuranceInformation = updatedProfile.InsuranceInformation

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateCrewProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.CrewProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.CrewProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type")
	}
	existingProfile.Department = updatedProfile.Department
	existingProfile.Certifications = updatedProfile.Certifications
	existingProfile.Equipment = updatedProfile.Equipment

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateProjectOwnerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.ProjectOwnerProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.ProjectOwnerProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}
	existingProfile.Organization = updatedProfile.Organization
	existingProfile.Specialties = updatedProfile.Specialties
	existingProfile.IMDBLink = updatedProfile.IMDBLink
	existingProfile.CurrentProjects = updatedProfile.CurrentProjects
	existingProfile.PastProjects = updatedProfile.PastProjects
	existingProfile.FundingSources = updatedProfile.FundingSources

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}

	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateVendorProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.VendorProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.VendorProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}

	existingProfile.BusinessName = updatedProfile.BusinessName
	existingProfile.StoreName = updatedProfile.StoreName
	existingProfile.SellerRating = updatedProfile.SellerRating
	existingProfile.Services = updatedProfile.Services
	existingProfile.PaymentMethods = updatedProfile.PaymentMethods
	existingProfile.Inventory = updatedProfile.Inventory

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateNgoProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.NgoProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.NgoProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type")
	}

	existingProfile.OrganizationName = updatedProfile.OrganizationName
	existingProfile.RegistrationNumber = updatedProfile.RegistrationNumber
	existingProfile.FocusAreas = updatedProfile.FocusAreas
	existingProfile.Partners = updatedProfile.Partners
	existingProfile.ImpactMetrics = updatedProfile.ImpactMetrics
	existingProfile.Website = updatedProfile.Website
	existingProfile.AnnualBudget = updatedProfile.AnnualBudget
	existingProfile.HoursLogged = updatedProfile.HoursLogged
	existingProfile.Background = updatedProfile.Background

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateAdminProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.AdminProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.AdminProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type")
	}

	existingProfile.AccessLevel = updatedProfile.AccessLevel
	existingProfile.ManagedSections = updatedProfile.ManagedSections
	existingProfile.LastAudit = updatedProfile.LastAudit
	existingProfile.Permissions = updatedProfile.Permissions

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateVolunteerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.VolunteerProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.VolunteerProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}

	existingProfile.Interests = updatedProfile.Interests
	existingProfile.References = updatedProfile.References
	existingProfile.HoursAvailable = updatedProfile.HoursAvailable
	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateBeneficiaryProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.BeneficiaryProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.BeneficiaryProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type")
	}

	existingProfile.Needs = updatedProfile.Needs
	existingProfile.CaseHistory = updatedProfile.CaseHistory

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}

	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateDonorProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.DonorProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.DonorProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}

	existingProfile.DonationTypes = updatedProfile.DonationTypes
	existingProfile.GivingHistory = updatedProfile.GivingHistory
	existingProfile.TaxID = updatedProfile.TaxID
	existingProfile.Preferences = updatedProfile.Preferences

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}

	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdatePartnerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.PartnerProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.PartnerProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}
	existingProfile.PartnershipType = updatedProfile.PartnershipType
	existingProfile.CollaborationAreas = updatedProfile.CollaborationAreas
	existingProfile.Resources = updatedProfile.Resources

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}

	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateSellerProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.SellerProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.SellerProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}

	existingProfile.SellerType = updatedProfile.SellerType
	existingProfile.ProductsServices = updatedProfile.ProductsServices
	existingProfile.Ratings = updatedProfile.Ratings
	existingProfile.SalesHistory = updatedProfile.SalesHistory

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}

	return s.profileRepo.Update(ctx, baseProfile)
}

func (s *ProfileService) UpdateEmployeeProfile(ctx context.Context, profileID primitive.ObjectID, updatedProfile *models.EmployeeProfile) error {
	existingProfileInterface, err := s.GetProfileByID(ctx, profileID)
	if err != nil {
		return err
	}
	existingProfile, ok := existingProfileInterface.(*models.EmployeeProfile)
	if !ok {
		return errors.New("internal error: incorrect profile type") // Should not happen
	}

	existingProfile.Department = updatedProfile.Department
	existingProfile.JobTitle = updatedProfile.JobTitle
	existingProfile.StartDate = updatedProfile.StartDate
	existingProfile.EndDate = updatedProfile.EndDate
	existingProfile.ManagerID = updatedProfile.ManagerID
	existingProfile.References = updatedProfile.References

	if err := s.validate.Struct(existingProfile); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	baseProfile, ok := convertToBasProfile(existingProfile)
	if !ok {
		return errors.New("internal error: could not convert to base profile")
	}
	return s.profileRepo.Update(ctx, baseProfile)
}
