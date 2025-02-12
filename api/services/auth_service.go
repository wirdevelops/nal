package services

import (
	"context"
	"fmt"
	"regexp"
	"sync"
	"time"

	"nalevel/config"
	"nalevel/models"
	"nalevel/repositories"
	"nalevel/utils"

	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

type AuthServiceInterface interface {
	Register(ctx context.Context, req *models.RegistrationRequest) (*models.User, error)
	Login(ctx context.Context, req *models.LoginRequest, ip string) (*models.AuthTokens, *models.User, error)
	UpdateEmail(ctx context.Context, userID primitive.ObjectID, newEmail string) error
	RequestPasswordReset(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, token, newPassword string) error
	RotateTokens(ctx context.Context, refreshToken string) (*models.AuthTokens, error)
	VerifyEmail(ctx context.Context, token string) error
	Logout(ctx context.Context, refreshToken string) error
	GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error)
	ChangePassword(ctx context.Context, userID primitive.ObjectID, oldPassword, newPassword string) error
	ResendVerificationEmail(ctx context.Context, email string) error
	ForgotPassword(ctx context.Context, req *models.PasswordResetRequest) error
}

// Custom Errors (These should be in a separate errors package for better organization)
var (
	ErrUserAlreadyExists        = errors.New("user already exists")
	ErrInvalidCredentials       = errors.New("invalid credentials")
	ErrAccountLocked            = errors.New("account locked")
	ErrInvalidResetToken        = errors.New("invalid reset token")
	ErrAccountNotVerified       = errors.New("account not verified")
	ErrTokenBlacklisted         = errors.New("token is blacklisted")
	ErrInvalidVerificationToken = errors.New("invalid verification token")
	ErrPasswordRecentlyUsed     = errors.New("password recently used")
	ErrPasswordCompromised      = errors.New("password has been compromised") // For external checks
	ErrInvalidRefreshToken      = errors.New("invalid refresh token")
	ErrVerificationTokenExpired = errors.New("verification token has expired")
	ErrTooManyAttempts          = errors.New("too many attempts")
	// ErrUserNotFound             = errors.New("user not found")
	ErrAlreadyVerified = errors.New("email already verified")
	ErrInvalidUserData = errors.New("invalid user data")
)

type AuthService struct {
	cfg                 *config.Config
	UserRepo            repositories.UserRepository
	tokenService        *utils.TokenService
	emailService        *utils.EmailService
	rateLimiter         *utils.RateLimiter
	passwordValidator   *regexp.Regexp
	validator           *validator.Validate
	tokenBlacklist      repositories.TokenBlacklist
	passwordHistory     repositories.PasswordHistoryStore
	logger              *zap.Logger // Structured logger
	verificationMutexes sync.Map    //For email verification concurrency control

}

func NewAuthService(
	config *config.Config,
	UserRepo repositories.UserRepository,
	tokenService *utils.TokenService,
	emailService *utils.EmailService,
	rateLimiter *utils.RateLimiter,
	tokenBlacklist repositories.TokenBlacklist,
	passwordHistory repositories.PasswordHistoryStore,
	logger *zap.Logger, // Inject the logger

) (AuthServiceInterface, error) {
	if logger == nil {
		return nil, fmt.Errorf("logger cannot be nil")
	}
	return &AuthService{
		cfg:             config,
		UserRepo:        UserRepo,
		tokenService:    tokenService,
		emailService:    emailService,
		rateLimiter:     rateLimiter,
		validator:       validator.New(),
		tokenBlacklist:  tokenBlacklist,
		passwordHistory: passwordHistory,
		logger:          logger, // Use the injected logger
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *models.LoginRequest, ip string) (*models.AuthTokens, *models.User, error) {

	// 1. Validate login request format
	if err := s.validator.Struct(req); err != nil {
		s.logger.Error("Invalid login request format", zap.Error(err), zap.String("email", req.Email))
		return nil, nil, ErrInvalidUserData
	}

	// Find the user by email
	user, err := s.UserRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Info("Login attempt with invalid email", zap.String("email", req.Email), zap.String("ip", ip))
			return nil, nil, ErrInvalidCredentials
		}
		s.logger.Error("Failed to retrieve user by email", zap.Error(err), zap.String("email", req.Email))
		return nil, nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	// Check if account is locked
	if user.LockUntil != nil && user.LockUntil.After(time.Now()) {
		s.logger.Warn("Login attempt on locked account", zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()), zap.Time("lock_until", *user.LockUntil))
		return nil, nil, ErrAccountLocked
	}

	// Check if account is verified
	if !user.IsVerified {
		s.logger.Warn("Login attempt on unverified account", zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()))
		return nil, nil, ErrAccountNotVerified
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		// Handle failed login
		loginErr := s.handleFailedLogin(ctx, user)
		if loginErr != nil {
			s.logger.Error("Failed to handle failed login", zap.Error(loginErr), zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()))

		}
		s.logger.Warn("Invalid login credentials", zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
		return nil, nil, ErrInvalidCredentials
	}
	// Update last login
	updateErr := s.UserRepo.UpdateLastLogin(ctx, user.ID)
	if updateErr != nil {
		s.logger.Error("Failed to update last login", zap.Error(updateErr), zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()))

	}

	// Generate JWTs
	accessToken, refreshToken, err := s.tokenService.GenerateTokenPair(user)
	if err != nil {
		s.logger.Error("Failed to generate tokens", zap.Error(err), zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()))
		return nil, nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Store Refresh Token
	if err := s.UserRepo.StoreRefreshToken(ctx, user.ID, refreshToken); err != nil {
		s.logger.Error("Failed to store refresh token", zap.Error(err), zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()))
		return nil, nil, fmt.Errorf("failed to store refresh token: %w", err)
	}

	// Clear sensitive data
	user.Password = ""
	user.RefreshToken = nil

	tokens := &models.AuthTokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	s.logger.Info("User logged in successfully", zap.String("email", req.Email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
	return tokens, user, nil
}

func (s *AuthService) handleFailedLogin(ctx context.Context, user *models.User) error {
	// Increment failed attempts
	if err := s.UserRepo.IncrementFailedAttempts(ctx, user.ID); err != nil {
		return errors.Wrap(err, "failed to increment failed attempts")
	}

	// Re-fetch user to get updated failed_attempts
	updatedUser, err := s.UserRepo.FindByID(ctx, user.ID)
	if err != nil {
		return errors.Wrap(err, "failed to re-fetch user")
	}

	// Check if account needs to be locked
	if updatedUser.FailedAttempts >= s.cfg.Auth.MaxLoginAttempts {
		lockUntil := time.Now().Add(s.cfg.Auth.AccountLockDuration)
		if err := s.UserRepo.LockAccount(ctx, user.ID, lockUntil); err != nil {
			return errors.Wrap(err, "failed to lock account")
		}
		ip, _ := ctx.Value(utils.CtxKeyIPAddress).(string) // Get the IP

		s.logger.Warn("Account locked due to multiple failed login attempts", zap.String("email", user.Email), zap.String("user_id", user.ID.Hex()), zap.Time("lock_until", lockUntil), zap.String("ip", ip))

	}
	return nil
}

func (s *AuthService) Register(ctx context.Context, req *models.RegistrationRequest) (*models.User, error) {

	// Get IP address from context
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string)
	if !ok {
		ip = "unknown" // Default
		s.logger.Warn("IP address not found in context during registration", zap.String("email", req.Email))
	}

	// 1. Validate Input
	if err := req.Validate(); err != nil {
		s.logger.Error("Registration request validation failed", zap.Error(err), zap.String("email", req.Email))
		return nil, errors.Wrap(ErrInvalidUserData, err.Error())
	}

	// 2. Check if User Exists
	existingUser, err := s.UserRepo.FindByEmail(ctx, req.Email)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		s.logger.Error("Error checking for existing user during registration", zap.Error(err), zap.String("email", req.Email))
		return nil, errors.Wrap(err, "error checking for existing user")
	}
	if existingUser != nil {
		s.logger.Info("Registration attempt with existing email", zap.String("email", req.Email), zap.String("ip", ip))
		return nil, ErrUserAlreadyExists
	}

	// 3. Hash Password
	hashedPassword, err := utils.HashPassword(req.Password, s.cfg.Auth.BcryptCost)
	if err != nil {
		s.logger.Error("Password hashing failed during registration", zap.Error(err), zap.String("email", req.Email))
		return nil, errors.Wrap(err, "password hashing failed")
	}

	// 4. Create User Object
	newUser := &models.User{
		ID:         primitive.NewObjectID(),
		Name:       req.FirstName + " " + req.LastName,
		Email:      req.Email,
		Password:   hashedPassword,
		IsVerified: false,
		Roles:      []string{}, // Default role
		CreatedAt:  utils.TimeNow(),
		UpdatedAt:  utils.TimeNow(),
		IPAddress:  ip, // Use the IP from context
		Status:     models.StatusPending,
		LastLogin:  nil,
		FailedLogin: models.FailedLogin{
			Attempts: 0,
			LastTry:  time.Time{},
		},
		Onboarding: models.Onboarding{
			Stage:     models.StageRoleSelection,
			Completed: []string{},
		},
		Settings: models.UserSettings{},
		Metadata: models.UserMetadata{
			CreatedAt: utils.TimeNow(),
			UpdatedAt: utils.TimeNow(),
		},
	}

	// 5. Create User in Database
	insertedUser, err := s.UserRepo.Create(ctx, newUser)
	if err != nil {
		s.logger.Error("User creation failed during registration", zap.Error(err), zap.String("email", req.Email))
		return nil, errors.Wrap(err, "user creation failed")
	}
	s.logger.Info("User created successfully", zap.String("user_id", insertedUser.ID.Hex()), zap.String("email", insertedUser.Email))

	// 6. Create Initial User Version
	if err := s.tokenService.CreateInitialUserVersion(ctx, insertedUser.ID); err != nil {
		s.logger.Error("Error creating initial user version during registration", zap.Error(err), zap.String("user_id", insertedUser.ID.Hex()))
		return nil, errors.Wrap(err, "creating initial user version failed")
	}

	// 7. Generate Verification Token
	verificationToken, err := utils.GenerateVerificationToken()
	if err != nil {
		s.logger.Error("Error generating verification token during registration", zap.Error(err), zap.String("user_id", insertedUser.ID.Hex()))
		return nil, errors.Wrap(err, "generating verification token failed")
	}

	// 8. Hash the token *before* storing it
	hashedVerificationToken := utils.HashString(verificationToken)

	// 9. Create the Verification model
	verification := &models.Verification{
		ID:        primitive.NewObjectID(),
		UserID:    newUser.ID,
		Email:     newUser.Email,
		Token:     hashedVerificationToken, // Store the *hashed* token
		ExpiresAt: utils.TimeNow().Add(s.cfg.Auth.VerificationTokenExpiration),
		CreatedAt: utils.TimeNow(),
	}

	// 10. Store the verification token
	if err := s.UserRepo.CreateVerificationToken(ctx, verification); err != nil {
		s.logger.Error("Error storing verification token during registration", zap.Error(err), zap.String("user_id", insertedUser.ID.Hex()))
		return nil, errors.Wrap(err, "storing verification token failed")
	}

	// 11. Send Verification Email (Non-blocking)
	go func() {
		sendCtx := context.Background()
		// Send the *unhashed* token to the user
		if err := s.emailService.SendVerificationEmail(sendCtx, newUser.Email, verificationToken); err != nil {

			s.logger.Error("Failed to send verification email during registration", zap.Error(err), zap.String("user_id", insertedUser.ID.Hex()), zap.String("email", newUser.Email))

		}
	}()

	createdUser := &models.User{
		ID:         newUser.ID,
		Email:      newUser.Email,
		Name:       newUser.Name,
		IsVerified: newUser.IsVerified,
		Roles:      newUser.Roles,
		Status:     newUser.Status,
		CreatedAt:  newUser.CreatedAt,
	}

	return createdUser, nil
}

func (s *AuthService) UpdateEmail(ctx context.Context, userID primitive.ObjectID, newEmail string) error {
	// Fetch existing user
	existingUser, err := s.UserRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("Update email attempt for non-existent user", zap.String("user_id", userID.Hex()))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for email update", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}
	oldEmail := existingUser.Email

	// Validate new email format
	if err := s.validator.Var(newEmail, "required,email"); err != nil {
		s.logger.Error("Invalid email format provided for update", zap.Error(err), zap.String("user_id", userID.Hex()), zap.String("new_email", newEmail))
		return errors.Wrap(ErrInvalidUserData, "invalid email format")
	}

	// Check email availability
	existingUserByEmail, err := s.UserRepo.FindByEmail(ctx, newEmail)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		s.logger.Error("Failed to check email availability during update", zap.Error(err), zap.String("user_id", userID.Hex()), zap.String("new_email", newEmail))
		return errors.Wrap(err, "failed to check email availability")
	}
	if existingUserByEmail != nil && existingUserByEmail.ID != userID {
		s.logger.Info("Email update attempt to already existing email", zap.String("user_id", userID.Hex()), zap.String("new_email", newEmail))
		return repositories.ErrUserAlreadyExists
	}

	// Update user data
	existingUser.Email = newEmail
	existingUser.IsVerified = false // Require re-verification
	existingUser.UpdatedAt = time.Now()

	// Validate user data
	if err := s.validator.Struct(existingUser); err != nil {
		s.logger.Error("Invalid user data after email update", zap.Error(err), zap.String("user_id", userID.Hex()), zap.String("new_email", newEmail))
		return errors.Wrap(ErrInvalidUserData, err.Error())
	}

	// Update user record
	if err := s.UserRepo.UpdateUser(ctx, existingUser); err != nil {
		s.logger.Error("Failed to update user email in database", zap.Error(err), zap.String("user_id", userID.Hex()), zap.String("new_email", newEmail))
		return errors.Wrap(err, "failed to update user email")
	}

	// Invalidate all existing tokens for security
	if err := s.tokenService.InvalidateAllUserTokens(ctx, userID); err != nil {
		s.logger.Error("Failed to invalidate tokens after email update", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to invalidate tokens")
	}

	// Send verification email
	if err := s.sendVerificationEmail(ctx, existingUser); err != nil {

		s.logger.Error("Failed to send verification email after email update", zap.Error(err), zap.String("user_id", userID.Hex()), zap.String("new_email", newEmail))
		// Consider:  Do you want to return an error here, or just log it?  If email sending is *critical*, return an error.
	}

	s.logger.Info("User email updated successfully", zap.String("user_id", userID.Hex()), zap.String("old_email", oldEmail), zap.String("new_email", newEmail))
	return nil
}

func (s *AuthService) RequestPasswordReset(ctx context.Context, email string) error {
	// Get IP for audit log (even though we might not use it)
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string)
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during password reset request", zap.String("email", email))
	}

	// Find user, but don't reveal existence in case of error.
	user, err := s.UserRepo.FindByEmail(ctx, email)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		s.logger.Error("Failed to initiate password reset - database error", zap.Error(err), zap.String("email", email))
		return errors.Wrap(err, "failed to initiate password reset")
	}

	// Even if the user doesn't exist, we proceed (but don't send an email).
	if user != nil {
		resetToken, err := s.generatePasswordResetToken(user)
		if err != nil {
			s.logger.Error("Failed to generate password reset token", zap.Error(err), zap.String("email", email), zap.String("user_id", user.ID.Hex()))
			return errors.Wrap(err, "failed to generate reset token")
		}

		hashedToken := utils.HashString(resetToken) // Hash the token.
		expiresAt := time.Now().Add(s.cfg.Auth.TokenExpiration)

		// Store hashed token.
		if err := s.UserRepo.StoreResetToken(ctx, email, hashedToken, expiresAt); err != nil {
			s.logger.Error("Failed to store password reset token", zap.Error(err), zap.String("email", email), zap.String("user_id", user.ID.Hex()))
			return errors.Wrap(err, "failed to store reset token")
		}

		// Send password reset email
		if err := s.emailService.SendPasswordResetEmail(ctx, email, resetToken); err != nil {
			s.logger.Error("Failed to send password reset email", zap.Error(err), zap.String("email", email), zap.String("user_id", user.ID.Hex()))
			// IMPORTANT:  We do *not* return an error here, because we don't want to
			// reveal whether the email exists or not.  We log the error, but
			// the user will always get a "success" message.
		}

		s.logger.Info("Password reset requested", zap.String("email", email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
	} else {
		s.logger.Info("Password reset requested for non-existent email", zap.String("email", email), zap.String("ip", ip))
	}

	// Always return nil (success) to prevent user enumeration.
	return nil
}

func (s *AuthService) ResetPassword(ctx context.Context, token, newPassword string) error {
	success := false
	var user *models.User
	// Get IP for audit log
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string)
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during password reset", zap.String("token", token[:10]+"...")) // Log part of token
	}

	defer func() {
		details := map[string]interface{}{
			"success": success,
			"ip":      ip,
		}
		if user != nil {
			details["userID"] = user.ID.Hex()
		}
	}()

	// 1. Validate the new password format.
	if err := s.validator.Var(newPassword, "required,min=8"); err != nil {
		s.logger.Error("Invalid new password format during password reset", zap.Error(err), zap.String("token", token[:10]+"..."))
		return errors.Wrap(ErrInvalidUserData, "password does not meet requirements")
	}

	// 2. Find the user by the *hashed* token.
	user, err := s.UserRepo.FindByResetToken(ctx, utils.HashString(token))
	if err != nil {
		s.logger.Warn("Invalid or expired password reset token", zap.String("token", token[:10]+"..."), zap.String("ip", ip)) // Log part of the token
		return ErrInvalidResetToken
	}

	// 3. Check Password history
	if err := s.checkPasswordHistory(ctx, user.ID, newPassword); err != nil {
		s.logger.Warn("Password recently used", zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
		return err
	}

	// 4. Hash the new password.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), s.cfg.Auth.BcryptCost)
	if err != nil {
		s.logger.Error("Failed to hash new password during password reset", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		return errors.Wrap(err, "failed to secure new password")
	}

	// 5. Update the password
	if err := s.UserRepo.UpdatePassword(ctx, user.ID, string(hashedPassword)); err != nil {
		s.logger.Error("Failed to update password during password reset", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		return errors.Wrap(err, "failed to update credentials")
	}

	// 6. Delete the reset token
	if err := s.UserRepo.DeleteResetToken(ctx, user.ID); err != nil {
		s.logger.Error("Failed to delete reset token after password reset", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		// Not critical, but log the error.
	}

	// 7. Add to password History
	if err := s.passwordHistory.Add(ctx, user.ID, string(hashedPassword)); err != nil {
		s.logger.Error("Failed to add new password to history", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		// Not critical, so log and continue.
	}

	success = true
	s.logger.Info("Password reset successfully", zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
	return nil
}

func (s *AuthService) RotateTokens(ctx context.Context, refreshToken string) (*models.AuthTokens, error) {

	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string) // Get IP
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during token rotation")
	}

	// 1. Check if token is blacklisted
	isBlacklisted, err := s.tokenBlacklist.IsBlacklisted(ctx, refreshToken)
	if err != nil {
		s.logger.Error("Failed to check token blacklist during token rotation", zap.Error(err), zap.String("refresh_token", refreshToken[:10]+"...")) // Log part of token
		return nil, errors.Wrap(err, "failed to check token blacklist")
	} else if isBlacklisted {
		s.logger.Warn("Attempt to rotate a blacklisted refresh token", zap.String("refresh_token", refreshToken[:10]+"..."), zap.String("ip", ip))
		return nil, ErrTokenBlacklisted
	}

	// 2. Find the user by the refresh token.
	user, err := s.UserRepo.FindByRefreshToken(ctx, refreshToken)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("Attempt to rotate refresh token for non-existent user", zap.String("refresh_token", refreshToken[:10]+"..."), zap.String("ip", ip))
			return nil, ErrInvalidRefreshToken
		}
		s.logger.Error("Failed to find user by refresh token during token rotation", zap.Error(err), zap.String("refresh_token", refreshToken[:10]+"..."))
		return nil, errors.Wrap(err, "failed to find user by refresh token")
	}
	// Check if the refresh token has expired.
	if user.RefreshToken.ExpiresAt.Before(time.Now()) { // Or utils.TimeNow()
		s.logger.Warn("Attempt to rotate expired refresh token", zap.String("refresh_token", refreshToken[:10]+"..."), zap.String("ip", ip))
		return nil, ErrInvalidRefreshToken // Or a new ErrExpiredRefreshToken
	}
	// 3. Generate *new* access and refresh tokens.
	accessToken, newRefreshToken, err := s.tokenService.GenerateTokenPair(user)
	if err != nil {
		s.logger.Error("Failed to generate new token pair during token rotation", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		return nil, errors.Wrap(err, "failed to generate new token pair")
	}

	// 4. Store the *new* refresh token (invalidate the old one).
	if err := s.UserRepo.StoreRefreshToken(ctx, user.ID, newRefreshToken); err != nil {
		s.logger.Error("Failed to store new refresh token during token rotation", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		return nil, errors.Wrap(err, "failed to store new refresh token")
	}

	// 5. Blacklist the old refresh token
	blacklistErr := s.tokenBlacklist.Add(ctx, refreshToken, time.Until(time.Now().Add(s.cfg.Auth.RefreshTokenExpiration))) // Use RefreshTokenExpiration
	if blacklistErr != nil {
		s.logger.Error("Failed to blacklist old refresh token during token rotation", zap.Error(blacklistErr), zap.String("user_id", user.ID.Hex()))
		// Not critical, but log the error.
	}

	tokens := &models.AuthTokens{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
	}

	s.logger.Info("Tokens rotated successfully", zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
	return tokens, nil
}

func (s *AuthService) VerifyEmail(ctx context.Context, token string) error {
	if token == "" {
		s.logger.Warn("Attempt to verify email with empty token")
		return ErrInvalidVerificationToken
	}
	s.logger.Debug("Verifying email", zap.String("token", token[:10]+"...")) // Log part of token

	// Get IP for audit log
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string) // Get IP
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during VerifyEmail")
	}

	// Use a mutex to prevent race conditions during verification
	verificationMutex := s.getMutexForToken(token)
	verificationMutex.Lock()
	defer verificationMutex.Unlock()

	// Hash the *received* token
	hashedToken := utils.HashString(token)

	// 1. Find verification record using the *hashed* token
	verification, err := s.UserRepo.FindByVerificationToken(ctx, hashedToken)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("Email verification attempt with invalid token", zap.String("token", token[:10]+"..."), zap.String("ip", ip)) // Log part of the token

			return ErrInvalidVerificationToken
		}
		s.logger.Error("Failed to find verification token during email verification", zap.Error(err), zap.String("token", token[:10]+"..."))
		return fmt.Errorf("failed to find verification token: %w", err)
	}

	// 2. Check if user exists
	user, err := s.UserRepo.FindByEmail(ctx, verification.Email)
	if err != nil {
		s.logger.Error("Failed to find user during email verification", zap.Error(err), zap.String("email", verification.Email))
		return fmt.Errorf("failed to find user: %w", err)
	}

	// 3. Check if already verified
	if user.IsVerified {
		_ = s.UserRepo.DeleteVerificationToken(ctx, verification.ID) //Clean up

		s.logger.Info("Email verification attempt on already verified user", zap.String("email", verification.Email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
		return ErrAlreadyVerified
	}

	// 4. Check expiration
	if verification.ExpiresAt.Before(utils.TimeNow()) {
		s.logger.Warn("Email verification attempt with expired token", zap.String("email", verification.Email), zap.String("user_id", user.ID.Hex()), zap.String("token", token[:10]+"..."), zap.String("ip", ip))
		return ErrVerificationTokenExpired
	}

	// 5. Update user verification status
	if err := s.UserRepo.UpdateVerificationStatus(ctx, verification.Email, true); err != nil {
		s.logger.Error("Failed to update verification status during email verification", zap.Error(err), zap.String("email", verification.Email), zap.String("user_id", user.ID.Hex()))
		return fmt.Errorf("failed to update verification status: %w", err)
	}

	// 6. Delete the verification token
	if err := s.UserRepo.DeleteVerificationToken(ctx, verification.ID); err != nil {
		s.logger.Error("Failed to delete verification token after email verification", zap.Error(err), zap.String("email", verification.Email), zap.String("user_id", user.ID.Hex()))
		// Not critical, but log the error
	}

	s.logger.Info("Email verified successfully", zap.String("email", verification.Email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
	return nil
}

// Logout invalidates the provided refresh token.
func (s *AuthService) Logout(ctx context.Context, refreshToken string) error {
	// Get IP for audit log
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string) // Get IP
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during logout")
	}

	// 1. Check if the token is already blacklisted.
	isBlacklisted, err := s.tokenBlacklist.IsBlacklisted(ctx, refreshToken)
	if err != nil {
		s.logger.Error("Failed to check token blacklist during logout", zap.Error(err), zap.String("refresh_token", refreshToken[:10]+"..."))
		return errors.Wrap(err, "failed to check token blacklist")
	}
	if isBlacklisted {
		s.logger.Info("Logout attempt with already blacklisted token", zap.String("refresh_token", refreshToken[:10]+"..."), zap.String("ip", ip))
		return nil
	}

	// 2. Find the user by the refresh token (optional, but good for logging/auditing).
	user, err := s.UserRepo.FindByRefreshToken(ctx, refreshToken)
	if err != nil && !errors.Is(err, repositories.ErrNotFound) {
		s.logger.Error("Failed to find user by refresh token during logout", zap.Error(err), zap.String("refresh_token", refreshToken[:10]+"..."))
		return errors.Wrap(err, "failed to find user by refresh token")
	}

	// 3. Blacklist the token.
	var expirationTime time.Time
	if user != nil && !user.RefreshToken.ExpiresAt.IsZero() {
		expirationTime = user.RefreshToken.ExpiresAt
	} else {
		expirationTime = time.Now().Add(s.cfg.Auth.RefreshTokenExpiration) // Use RefreshTokenExpiration
	}
	err = s.tokenBlacklist.Add(ctx, refreshToken, time.Until(expirationTime))
	if err != nil {
		s.logger.Error("Failed to blacklist refresh token during logout", zap.Error(err), zap.String("refresh_token", refreshToken[:10]+"..."))
		return errors.Wrap(err, "failed to blacklist refresh token")
	}

	// 4. Optionally, remove the refresh token from the user record.
	if user != nil {
		if err := s.UserRepo.StoreRefreshToken(ctx, user.ID, ""); err != nil {
			s.logger.Error("Failed to clear refresh token on logout", zap.Error(err), zap.String("user_id", user.ID.Hex()))
			// Not critical, but log
		}
	}

	// 5. Audit Log
	logData := map[string]interface{}{
		"token":      refreshToken[:10] + "...",
		"expiration": expirationTime.Format(time.RFC3339),
		"ip":         ip,
	}
	if user != nil {
		logData["userID"] = user.ID.Hex()
		logData["email"] = user.Email

	}
	s.logger.Info("User logged out successfully", zap.String("refresh_token", refreshToken[:10]+"..."), zap.String("ip", ip))
	if user != nil {
		s.logger.Info("User logged out", zap.String("user_id", user.ID.Hex()), zap.String("email", user.Email))
	}

	return nil
}

// Add this helper method to AuthService
func (s *AuthService) getMutexForToken(token string) *sync.Mutex {
	mutex, _ := s.verificationMutexes.LoadOrStore(token, &sync.Mutex{})
	return mutex.(*sync.Mutex)
}

// --- Private Helper Methods ---

func (s *AuthService) generatePasswordResetToken(user *models.User) (string, error) {
	return utils.GenerateVerificationToken()
}

func (s *AuthService) sendVerificationEmail(ctx context.Context, user *models.User) error {
	// 1. Generate a new verification token.
	token, err := utils.GenerateVerificationToken()
	if err != nil {
		return fmt.Errorf("failed to generate verification token: %w", err)
	}

	// 2. Store the token *without* hashing
	verification := &models.Verification{
		ID:        primitive.NewObjectID(),
		UserID:    user.ID,
		Email:     user.Email,
		Token:     utils.HashString(token),                                     // Store hashed for lookups
		ExpiresAt: utils.TimeNow().Add(s.cfg.Auth.VerificationTokenExpiration), // Use config
		CreatedAt: utils.TimeNow(),
	}

	if err := s.UserRepo.CreateVerificationToken(ctx, verification); err != nil {
		return fmt.Errorf("failed to store verification token: %w", err)
	}

	// 3. Send the email.
	return s.emailService.SendVerificationEmail(ctx, user.Email, token) // Send unhashed
}

func (s *AuthService) IsPasswordStrong(password string) bool {
	if s.passwordValidator == nil {
		return len(password) >= 8
	}
	return s.passwordValidator.MatchString(password)
}

func (s *AuthService) checkPasswordHistory(ctx context.Context, userID primitive.ObjectID, newPassword string) error {
	hashedNewPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), s.cfg.Auth.BcryptCost)
	if err != nil {
		s.logger.Error("Failed to hash new password for history check", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to hash new password for history check")
	}
	used, err := s.passwordHistory.HasBeenUsed(ctx, userID, string(hashedNewPassword))

	if err != nil {
		s.logger.Error("Failed to check password history", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to check password history")
	}
	if used {
		s.logger.Warn("Password recently used", zap.String("user_id", userID.Hex()))
		return ErrPasswordRecentlyUsed
	}
	return nil
}

func (s *AuthService) GetUserByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	user, err := s.UserRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("Attempt to retrieve non-existent user", zap.String("user_id", userID.Hex()))
			return nil, ErrUserNotFound
		}
		s.logger.Error("Error retrieving user by ID", zap.Error(err), zap.String("user_id", userID.Hex()))
		return nil, errors.Wrap(err, "failed to retrieve user")
	}
	s.logger.Info("Retrieved user by ID", zap.String("user_id", userID.Hex()))
	return user, nil
}

func (s *AuthService) ChangePassword(ctx context.Context, userID primitive.ObjectID, oldPassword, newPassword string) error {
	// Get IP for audit log
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string)
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during password change", zap.String("user_id", userID.Hex()))
	}
	// 1. Validate the new password.
	if err := s.validator.Var(newPassword, "required,min=8"); err != nil {
		s.logger.Error("Invalid new password format during password change", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(ErrInvalidUserData, "new password does not meet requirements")
	}

	// 2. Fetch the user.
	user, err := s.UserRepo.FindByID(ctx, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("Attempt to change password for non-existent user", zap.String("user_id", userID.Hex()), zap.String("ip", ip))
			return ErrUserNotFound
		}
		s.logger.Error("Failed to retrieve user for password change", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to retrieve user")
	}

	// 3. Verify the old password.
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword))
	if err != nil {
		s.logger.Warn("Invalid old password provided during password change", zap.String("user_id", userID.Hex()), zap.String("ip", ip))
		return ErrInvalidCredentials // Consistent error message
	}

	// 4. Check password history.
	if err := s.checkPasswordHistory(ctx, userID, newPassword); err != nil {
		return err // checkPasswordHistory returns appropriate errors
	}

	// 5. Hash the new password.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), s.cfg.Auth.BcryptCost)
	if err != nil {
		s.logger.Error("Failed to hash new password during password change", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to secure new password")
	}

	// 6. Update the password.
	if err := s.UserRepo.UpdatePassword(ctx, userID, string(hashedPassword)); err != nil {
		s.logger.Error("Failed to update password during password change", zap.Error(err), zap.String("user_id", userID.Hex()))
		return errors.Wrap(err, "failed to update password")
	}

	// 7. Add to password history.
	if err := s.passwordHistory.Add(ctx, userID, string(hashedPassword)); err != nil {
		s.logger.Error("Failed to add new password to history during password change", zap.Error(err), zap.String("user_id", userID.Hex()))
		// Not critical, so log and continue.
	}

	// 8. Invalidate all tokens (optional, but good for security).
	if err := s.tokenService.InvalidateAllUserTokens(ctx, userID); err != nil {
		s.logger.Error("Failed to invalidate user tokens after password change", zap.Error(err), zap.String("user_id", user.ID.Hex()))
		// Not critical, so log and continue.
	}

	s.logger.Info("Password changed successfully", zap.String("user_id", userID.Hex()), zap.String("ip", ip))

	return nil
}

func (s *AuthService) ResendVerificationEmail(ctx context.Context, email string) error {
	// Get IP for audit log
	ip, ok := ctx.Value(utils.CtxKeyIPAddress).(string)
	if !ok {
		ip = "unknown"
		s.logger.Warn("IP address not found in context during resend verification email", zap.String("email", email))
	}
	// 1. Find the user by email.
	user, err := s.UserRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			s.logger.Warn("Attempt to resend verification email for non-existent user", zap.String("email", email), zap.String("ip", ip))
			return ErrUserNotFound // Consistent error
		}
		s.logger.Error("Failed to find user by email during resend verification email", zap.Error(err), zap.String("email", email))
		return errors.Wrap(err, "failed to find user by email")
	}

	// 2. Check if the user is already verified.
	if user.IsVerified {
		s.logger.Info("Attempt to resend verification email for already verified user", zap.String("email", email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
		return ErrAlreadyVerified // Consistent error
	}

	// 3. Send the verification email (using the existing helper function).
	if err := s.sendVerificationEmail(ctx, user); err != nil {
		s.logger.Error("Failed to resend verification email", zap.Error(err), zap.String("email", email), zap.String("user_id", user.ID.Hex()))
		return errors.Wrap(err, "failed to resend verification email") // Wrap for better context
	}

	s.logger.Info("Resent verification email", zap.String("email", email), zap.String("user_id", user.ID.Hex()), zap.String("ip", ip))
	return nil
}

// ForgotPassword is aliased to RequestPasswordReset
func (s *AuthService) ForgotPassword(ctx context.Context, req *models.PasswordResetRequest) error {
	return s.RequestPasswordReset(ctx, req.Email)
}
