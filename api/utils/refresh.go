package utils

// import (
// 	"errors"
// 	"time"

// 	"nalevel/models"

// 	"github.com/o1egl/paseto"
// )

// var (
// 	errInvalidTokenType = errors.New("invalid token type")
// )

// type RefreshToken struct {
// 	Token     string    `bson:"token"`
// 	UserID    string    `bson:"user_id"`
// 	ExpiresAt time.Time `bson:"expires_at"`
// }

// func (s *TokenService) GenerateRefreshToken(user *models.User) (string, error) {
// 	now := time.Now()
// 	expiration := now.Add(30 * 24 * time.Hour) // 30 days

// 	claims := map[string]interface{}{
// 		"user_id": user.ID.Hex(),
// 		"type":    "refresh",
// 		"exp":     expiration,
// 	}

// 	v2 := paseto.NewV2()
// 	token, err := v2.Sign(s.privateKey, claims, nil)
// 	if err != nil {
// 		return "", err
// 	}

// 	return token, nil
// }

// func (s *TokenService) RefreshAccessToken(refreshToken string) (string, error) {
// 	claims, err := s.ValidateToken(refreshToken)
// 	if err != nil {
// 		return "", err
// 	}

// 	if claims["type"] != "refresh" {
// 		return "", errInvalidTokenType
// 	}

// 	_ = claims["user_id"].(string)
// 	// Additional logic to fetch user and generate new access token

// 	return "", nil
// }
