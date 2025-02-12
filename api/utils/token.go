package utils

// import (
// 	"nalevel/models"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/google/uuid"
// 	"github.com/o1egl/paseto"
// 	"github.com/pkg/errors"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// type TokenService struct {
// 	accessSecret  string
// 	refreshSecret string
// }

// func NewTokenService(accessSecret, refreshSecret string) *TokenService {
// 	return &TokenService{
// 		accessSecret:  accessSecret,
// 		refreshSecret: refreshSecret,
// 	}
// }

// func (s *TokenService) GenerateAccessToken(user *models.User) (string, error) {
// 	claims := jwt.MapClaims{
// 		"sub":   user.ID.Hex(),
// 		"email": user.Email,
// 		"roles": user.Roles,
// 		"exp":   time.Now().Add(15 * time.Minute).Unix(),
// 		"jti":   uuid.New().String(),
// 	}

// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString([]byte(s.accessSecret))
// }

// func (s *TokenService) GenerateRefreshToken(userID primitive.ObjectID) (string, error) {
// 	claims := jwt.MapClaims{
// 		"sub": userID.Hex(),
// 		"exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
// 		"jti": uuid.New().String(),
// 	}

// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString([]byte(s.refreshSecret))
// }

// func (s *TokenService) ValidateToken(tokenString, secret string) (jwt.MapClaims, error) {
// 	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 		return []byte(secret), nil
// 	})

// 	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
// 		return claims, nil
// 	}

// 	return nil, err
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
