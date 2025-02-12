package utils

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"log"
	"time"
)

// GenerateRandomToken generates a cryptographically secure random token.
func GenerateRandomToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, bytes); err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

func TimeNow() time.Time {
	return time.Now()
}

func GenerateVerificationToken() (string, error) {
	b := make([]byte, 32) // 32 bytes = 256 bits
	_, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}
	token := base64.URLEncoding.EncodeToString(b)
	log.Printf("GenerateVerificationToken: Generated token: %s", token) // ADD THIS
	return token, nil
}

// HashString hashes a string using SHA256 (for tokens, etc.).
func HashString(s string) string {
	log.Printf("HashString: Input: %s", s)
	h := sha256.New()
	h.Write([]byte(s))
	hashed := base64.URLEncoding.EncodeToString(h.Sum(nil))
	log.Printf("HashString: Output: %s", hashed) // Add this line
	return hashed
}

// HashToken is an alias for HashString, specifically for tokens.
func HashToken(s string) string {
	return HashString(s)
}

// utils/context.go
func ContextWithTimeout(parent context.Context, timeout time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(parent, timeout)
}

// utils/string.go
func TruncateString(s string, length int) string {
	if len(s) <= length {
		return s
	}
	return s[:length] + "..."
}
