package utils

import (
	"errors"
	"fmt"
)

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidPassword    = errors.New("invalid password")
	ErrInvalidToken       = errors.New("invalid token")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrEmailNotVerified   = errors.New("email not verified")
	ErrAccountLocked      = errors.New("account is locked")
	ErrTooManyAttempts    = errors.New("too many attempts")
	ErrPasswordMismatch   = errors.New("passwords do not match")
	ErrWeakPassword       = errors.New("password does not meet requirements")
	ErrEmailTaken         = errors.New("email is already taken")
	ErrInvalidResetToken  = errors.New("invalid or expired reset token")
)

type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Err     error  `json:"-"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%d: %s", e.Code, e.Message)
}

func NewAppError(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

func HandleError(err error) *AppError {
	switch {
	case errors.Is(err, ErrUserNotFound):
		return NewAppError(404, "User not found", err)
	case errors.Is(err, ErrInvalidPassword):
		return NewAppError(401, "Invalid credentials", err)
	case errors.Is(err, ErrTokenExpired):
		return NewAppError(401, "Token has expired", err)
	default:
		return NewAppError(500, "Internal server error", err)
	}
}
