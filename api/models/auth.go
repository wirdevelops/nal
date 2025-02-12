package models

// import (
// 	"github.com/go-playground/validator/v10"
// )

// // RegistrationRequest represents the data required for user registration.
// type RegistrationRequest struct {
// 	FirstName       string `json:"firstName" validate:"required,min=2,max=50"`
// 	LastName        string `json:"lastName" validate:"required,min=2,max=50"`
// 	Email           string `json:"email" validate:"required,email"`
// 	Password        string `json:"password" validate:"required,min=8"`
// 	ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
// 	IP              string `json:"-"` // Don't expose in JSON, but capture internally
// }

// // Add the Validate method here
// var validate *validator.Validate

// func init() {
// 	validate = validator.New()
// }

// // Validate validates the RegistrationRequest struct.
// func (r *RegistrationRequest) Validate() error {
// 	return validate.Struct(r)
// }

// // LoginRequest represents the data required for user login.
// type LoginRequest struct {
// 	Email    string `json:"email" validate:"required,email"`
// 	Password string `json:"password" validate:"required"`
// }

// // PasswordResetRequest is used to initiate a password reset.
// type PasswordResetRequest struct {
// 	Email string `json:"email" validate:"required,email"`
// }

// // PasswordResetConfirmRequest is used to complete a password reset.
// type PasswordResetConfirmRequest struct {
// 	Token       string `json:"token" validate:"required"`
// 	NewPassword string `json:"newPassword" validate:"required,min=8"`
// }

// // AuthTokens represents the access and refresh tokens.
// type AuthTokens struct {
// 	AccessToken  string `json:"accessToken"`
// 	RefreshToken string `json:"refreshToken"`
// }

// // // Validate methods for request structs
// // func (r RegistrationRequest) Validate() error {
// // 	return validate.Struct(r)
// // }

// // func (r LoginRequest) Validate() error {
// // 	return validate.Struct(r)
// // }
// // func (r PasswordResetRequest) Validate() error {
// // 	return validate.Struct(r)
// // }

// // func (r PasswordResetConfirmRequest) Validate() error {
// // 	return validate.Struct(r)
// // }
// // func (r TokenRefreshRequest) Validate() error {
// // 	return validate.Struct(r)
// // }
