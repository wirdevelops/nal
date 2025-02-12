package utils

import (
	"context"
	"errors"
	"fmt"
	"nalevel/models"
	"nalevel/repositories"

	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	ErrTokenExpired       = errors.New("token expired")
	ErrTokenInvalid       = errors.New("invalid token")
	ErrInvalidTokenType   = errors.New("invalid token type")
	ErrInvalidTokenClaims = errors.New("invalid token claims")
)

type TokenConfig struct {
	AccessTokenDuration  time.Duration
	RefreshTokenDuration time.Duration
	Issuer               string
	Audience             string
}

type TokenService struct {
	config          TokenConfig
	jwtSecret       []byte // Secret key for JWT signing
	userVersionRepo repositories.UserVersionRepository
}

type TokenClaims struct {
	UserID    string   `json:"user_id"`
	Email     string   `json:"email"`
	Roles     []string `json:"roles"`
	TokenType string   `json:"type"`
	jwt.RegisteredClaims
}

func NewTokenService(config TokenConfig, jwtSecret []byte, userVersionRepo repositories.UserVersionRepository) (*TokenService, error) {

	if len(jwtSecret) == 0 {
		return nil, fmt.Errorf("jwtSecret cannot be empty")
	}

	return &TokenService{
		config:          config,
		jwtSecret:       jwtSecret,
		userVersionRepo: userVersionRepo,
	}, nil
}

// GenerateTokenPair generates new access and refresh tokens for the user
func (s *TokenService) GenerateTokenPair(user *models.User) (accessToken, refreshToken string, err error) {
	accessToken, err = s.generateToken(user, "access")
	if err != nil {
		return "", "", fmt.Errorf("failed to generate access token: %w", err)
	}

	refreshToken, err = s.generateToken(user, "refresh")
	if err != nil {
		return "", "", fmt.Errorf("failed to generate refresh token: %w", err)
	}

	return accessToken, refreshToken, nil
}

func (s *TokenService) generateToken(user *models.User, tokenType string) (string, error) {
	var ttl time.Duration
	if tokenType == "access" {
		ttl = s.config.AccessTokenDuration
	} else if tokenType == "refresh" {
		ttl = s.config.RefreshTokenDuration
	} else {
		return "", ErrInvalidTokenType
	}

	now := time.Now()
	claims := TokenClaims{
		UserID:    user.ID.Hex(),
		Email:     user.Email,
		Roles:     user.Roles,
		TokenType: tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.config.Issuer,
			Subject:   user.ID.Hex(), // Use user ID as subject
			Audience:  []string{s.config.Audience},
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			ID:        uuid.New().String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil

}

func (s *TokenService) ValidateToken(ctx context.Context, tokenString string) (*TokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})

	if err != nil {
		// Handle specific errors like expired tokens
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorExpired != 0 {
				return nil, ErrTokenExpired
			}
		}
		return nil, fmt.Errorf("%w: %v", ErrTokenInvalid, err)
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidTokenClaims
	}
	return claims, nil
}

func (s *TokenService) InvalidateAllUserTokens(ctx context.Context, userID primitive.ObjectID) error {
	// Increment the user's version.  This invalidates all tokens issued *before* this version.
	_, err := s.userVersionRepo.IncrementVersion(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to invalidate user tokens: %w", err)
	}

	return nil
}

// CreateInitialUserVersion creates the initial version for a user.
func (s *TokenService) CreateInitialUserVersion(ctx context.Context, userID primitive.ObjectID) error {
	_, err := s.userVersionRepo.Create(ctx, &models.UserVersion{
		UserID:  userID,
		Version: 1, // Start with version 1
	})
	if err != nil {
		return fmt.Errorf("failed to create initial user version: %w", err)
	}
	return nil
}

// func (s *TokenService) verifyClaims(ctx context.Context, claims *TokenClaims) error {
// 	if claims.ExpiresAt.Time.Before(time.Now()) {
// 		return ErrTokenExpired
// 	}

// 	if claims.Issuer != s.config.Issuer {
// 		return fmt.Errorf("%w: invalid issuer", ErrTokenInvalid)
// 	}

// 	if claims.Audience != s.config.Audience {
// 		return fmt.Errorf("%w: invalid audience", ErrTokenInvalid)
// 	}

// 	if !s.tokenTypes[claims.TokenType] {
// 		return ErrInvalidTokenType
// 	}

// 	// Verify the token version
// 	userID, err := primitive.ObjectIDFromHex(claims.UserID)
// 	if err != nil {
// 		return fmt.Errorf("invalid user ID in token: %w", err)
// 	}
// 	currentVersion, err := s.userVersionRepo.GetCurrentVersion(ctx, userID)
// 	if err != nil {
// 		return fmt.Errorf("failed to get current user version: %w", err)
// 	}
// 	if claims.Version < currentVersion {
// 		return ErrTokenInvalid // Or a more specific error like ErrTokenRevoked
// 	}

// 	return nil
// }

// // InvalidateAllUserTokens invalidates all tokens for a given user.
// func (s *TokenService) InvalidateAllUserTokens(ctx context.Context, userID primitive.ObjectID) error {
// 	_, err := s.userVersionRepo.IncrementVersion(ctx, userID) // Increment the user version
// 	if err != nil {
// 		return fmt.Errorf("failed to invalidate tokens: %w", err)
// 	}
// 	return nil
// }

// package utils

// import (
// 	"time"

// 	"nalevel/models"

// 	"github.com/o1egl/paseto"
// 	"github.com/pkg/errors"
// 	"golang.org/x/crypto/ed25519"
// )

// type TokenService struct {
// 	privateKey ed25519.PrivateKey
// 	publicKey  ed25519.PublicKey
// }

// func NewTokenService() *TokenService {
// 	public, private, err := ed25519.GenerateKey(nil)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return &TokenService{
// 		privateKey: private,
// 		publicKey:  public,
// 	}
// }

// func (s *TokenService) GenerateToken(user *models.User) (string, error) {
// 	now := time.Now()
// 	expiration := now.Add(24 * time.Hour)

// 	claims := map[string]interface{}{
// 		"user_id":    user.ID.Hex(),
// 		"email":      user.Email,
// 		"first_name": user.FirstName,
// 		"last_name":  user.LastName,
// 		"exp":        expiration,
// 	}

// 	v2 := paseto.NewV2()
// 	token, err := v2.Sign(s.privateKey, claims, nil)
// 	if err != nil {
// 		return "", errors.Wrap(err, "failed to generate token")
// 	}

// 	return token, nil
// }

// func (s *TokenService) ValidateToken(token string) (map[string]interface{}, error) {
// 	v2 := paseto.NewV2()
// 	var claims map[string]interface{}

// 	err := v2.Verify(token, s.publicKey, &claims, nil)
// 	if err != nil {
// 		return nil, errors.Wrap(err, "invalid token")
// 	}

// 	return claims, nil
// }

// func (s *TokenService) GenerateVerificationToken(email string) (string, error) {
// 	now := time.Now()
// 	claims := map[string]interface{}{
// 		"email":   email,
// 		"exp":     now.Add(24 * time.Hour).Unix(),
// 		"nbf":     now.Unix(),
// 		"iat":     now.Unix(),
// 		"purpose": "email_verification",
// 	}

// 	v2 := paseto.NewV2()
// 	return v2.Sign(s.privateKey, claims, nil)
// }

// func (s *TokenService) ValidateVerificationToken(token string) (string, error) {
// 	var claims map[string]interface{}
// 	v2 := paseto.NewV2()

// 	if err := v2.Verify(token, s.publicKey, &claims, nil); err != nil {
// 		return "", errors.Wrap(err, "invalid token")
// 	}

// 	if purpose, ok := claims["purpose"].(string); !ok || purpose != "email_verification" {
// 		return "", errors.New("invalid token purpose")
// 	}

// 	email, ok := claims["email"].(string)
// 	if !ok {
// 		return "", errors.New("invalid token claims")
// 	}

// 	return email, nil
// }

// func (s *TokenService) GenerateTokenPair(user *models.User) (string, string, error) {
// 	// Generate access token
// 	accessToken, err := s.generateAccessToken(user)
// 	if err != nil {
// 		return "", "", errors.Wrap(err, "failed to generate access token")
// 	}

// 	// Generate refresh token with longer expiration
// 	refreshToken, err := s.generateRefreshToken(user)
// 	if err != nil {
// 		return "", "", errors.Wrap(err, "failed to generate refresh token")
// 	}

// 	return accessToken, refreshToken, nil
// }

// func (s *TokenService) generateAccessToken(user *models.User) (string, error) {
// 	now := time.Now()
// 	claims := map[string]interface{}{
// 		"user_id":    user.ID.Hex(),
// 		"email":      user.Email,
// 		"first_name": user.FirstName,
// 		"last_name":  user.LastName,
// 		"roles":      user.Roles,
// 		"exp":        now.Add(15 * time.Minute).Unix(),
// 		"iat":        now.Unix(),
// 		"nbf":        now.Unix(),
// 		"type":       "access",
// 	}

// 	v2 := paseto.NewV2()
// 	return v2.Sign(s.privateKey, claims, nil)
// }

// func (s *TokenService) generateRefreshToken(user *models.User) (string, error) {
// 	now := time.Now()
// 	claims := map[string]interface{}{
// 		"user_id": user.ID.Hex(),
// 		"exp":     now.Add(7 * 24 * time.Hour).Unix(),
// 		"iat":     now.Unix(),
// 		"nbf":     now.Unix(),
// 		"type":    "refresh",
// 	}

// 	v2 := paseto.NewV2()
// 	return v2.Sign(s.privateKey, claims, nil)
// }
