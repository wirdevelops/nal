// handlers/auth_handler.go
package handlers

import (
	"context"
	"log"
	"nalevel/middleware"
	"nalevel/models"
	"nalevel/services"
	"nalevel/utils"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/pkg/errors"
)

type AuthHandler struct {
	authService services.AuthServiceInterface
	userService services.UserServiceInterface
	mid         *middleware.AuthMiddleware
}

func NewAuthHandler(authService services.AuthServiceInterface, userService services.UserServiceInterface, mid *middleware.AuthMiddleware) *AuthHandler { // Add userService
	return &AuthHandler{authService: authService, userService: userService, mid: mid} // Add userService
}

func (h *AuthHandler) ApplyRoutes(app *fiber.App) {
	authGroup := app.Group("/api/v1/auth")

	// Individual endpoint rate limiting (optional, but good for sensitive endpoints)
	registerLimiter := limiter.New(limiter.Config{
		Max:        5, // 5 requests
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP() // Limit based on IP address
		},
	})
	authGroup.Post("/register", registerLimiter, h.register)
	authGroup.Post("/login", h.login)
	authGroup.Post("/forgot-password", h.forgotPassword)
	authGroup.Post("/reset-password", h.resetPassword) // No auth needed for *requesting*
	authGroup.Get("/verify-email", h.verifyEmail)

	// Common endpoints with normal rate limiting
	commonLimiter := limiter.New(limiter.Config{
		Max:        30,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	})

	authGroup.Post("/refresh", commonLimiter, h.refreshToken)
	authGroup.Post("/logout", commonLimiter, h.logout)
	authGroup.Get("/me", h.mid.JWTProtected(), h.getMe)

}

func (h *AuthHandler) register(c *fiber.Ctx) error {
	var req models.RegistrationRequest
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request format"))
	}

	// IP address is already in the context thanks to middleware
	user, err := h.authService.Register(c.Context(), &req)
	if err != nil {
		if errors.Is(err, services.ErrUserAlreadyExists) {
			return respondError(c, http.StatusConflict, err) // 409 Conflict
		} else if errors.Is(err, services.ErrInvalidUserData) {
			return respondError(c, http.StatusBadRequest, err) // 400 Bad Request
		}
		// Always log the underlying error, even for a generic 500
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "registration failed")) // 500
	}

	return respondCreated(c, fiber.Map{
		"message": "Registration successful. Please check your email for verification.",
		"user_id": user.ID,
	})
}

// func (h *AuthHandler) register(c *fiber.Ctx) error {
// 	var req models.RegistrationRequest
// 	if err := c.BodyParser(&req); err != nil {
// 		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request format"))
// 	}

// 	// Get the IP address.
// 	req.IP = c.IP()

// 	user, err := h.authService.Register(c.Context(), &req)
// 	if err != nil {
// 		if errors.Is(err, services.ErrUserAlreadyExists) {
// 			return respondError(c, http.StatusConflict, err) // 409 Conflict
// 		} else if errors.Is(err, services.ErrInvalidUserData) {
// 			return respondError(c, http.StatusBadRequest, err) // 400 Bad Request
// 		}
// 		return respondError(c, http.StatusInternalServerError, errors.New("registration failed")) // 500
// 	}

// 	// You might want to send back a subset of user data, not the entire user object.
// 	return respondCreated(c, fiber.Map{
// 		"message": "Registration successful. Please check your email for verification.",
// 		"user_id": user.ID, // Example: return the user ID
// 	})
// }

func (h *AuthHandler) login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		log.Println("Failed to parse login request:", err)
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request format"))
	}

	// Get the IP address from c.Locals
	ip, ok := c.Locals(utils.CtxKeyIPAddress).(string)
	if !ok {
		ip = "unknown" // Fallback if IP wasn't set for some reason
	}

	tokens, user, err := h.authService.Login(c.Context(), &req, ip)
	if err != nil {
		log.Println("Login failed:", err)

		if errors.Is(err, services.ErrInvalidCredentials) {
			return respondError(c, http.StatusUnauthorized, errors.New("invalid email or password"))
		}
		if errors.Is(err, services.ErrAccountLocked) {
			return respondError(c, http.StatusUnauthorized, err)
		}
		if errors.Is(err, services.ErrAccountNotVerified) {
			return respondError(c, http.StatusUnauthorized, err)
		}

		return respondError(c, http.StatusInternalServerError, errors.New("login failed"))
	}
	log.Println("Login successful, user ID:", user.ID)

	h.setAuthCookies(c, tokens.AccessToken, tokens.RefreshToken)

	return respondOK(c, fiber.Map{
		"message": "Login successful",
		"user":    user,
	})
}

func (h *AuthHandler) verifyEmail(c *fiber.Ctx) error {
	// Extract and validate token
	token := c.Query("token")
	log.Printf("API Handler: Received token: %s", token)
	log.Printf("verifyEmail: Processing verification request for token: %s", utils.TruncateString(token, 8))

	if token == "" {
		return respondError(c, fiber.StatusBadRequest, errors.New("missing verification token"))
	}

	// Create a context with timeout for the verification process
	ctx, cancel := utils.ContextWithTimeout(c.Context(), 10*time.Second)
	defer cancel()

	// Attempt to verify the email
	err := h.authService.VerifyEmail(ctx, token)
	if err != nil {
		// Log the error with context but without sensitive data
		log.Printf("verifyEmail: Verification failed: %v", err)

		// Handle specific error cases
		switch {
		case errors.Is(err, services.ErrAlreadyVerified):
			return respondError(c, fiber.StatusConflict, err)

		case errors.Is(err, services.ErrVerificationTokenExpired):
			return respondError(c, fiber.StatusGone, err)

		case errors.Is(err, services.ErrInvalidVerificationToken):
			return respondError(c, fiber.StatusNotFound, err)

		case errors.Is(err, context.DeadlineExceeded):
			return respondError(c, fiber.StatusGatewayTimeout, errors.New("verification request timed out"))

		default:
			// Log unexpected errors with more detail for debugging
			log.Printf("verifyEmail: Unexpected error during verification: %+v", err)
			return respondError(c, fiber.StatusInternalServerError, errors.New("an unexpected error occurred during verification"))
		}
	}

	// Log successful verification
	log.Printf("verifyEmail: Successfully verified email for token: %s", utils.TruncateString(token, 8))

	// Return success response
	return respondOK(c, fiber.Map{
		"message": "Email successfully verified",
		"code":    "VERIFICATION_SUCCESS",
	})
}

func (h *AuthHandler) refreshToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return respondError(c, http.StatusUnauthorized, errors.New("refresh token required"))
	}

	newTokens, err := h.authService.RotateTokens(c.Context(), refreshToken)
	if err != nil {
		if errors.Is(err, services.ErrTokenBlacklisted) || errors.Is(err, services.ErrInvalidRefreshToken) {
			return respondError(c, http.StatusUnauthorized, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.New("token refresh failed"))
	}

	h.setAuthCookies(c, newTokens.AccessToken, newTokens.RefreshToken)
	return respondOK(c, fiber.Map{"message": "Tokens refreshed successfully"})
}
func (h *AuthHandler) logout(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return respondError(c, http.StatusBadRequest, errors.New("refresh token is required"))
	}

	err := h.authService.Logout(c.Context(), refreshToken)
	if err != nil {
		return respondError(c, http.StatusInternalServerError, errors.New("logout failed"))
	}

	h.clearAuthCookies(c)
	return respondOK(c, fiber.Map{"message": "Successfully logged out"})
}

func (h *AuthHandler) forgotPassword(c *fiber.Ctx) error {
	var req struct {
		Email string `json:"email"`
	}

	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request format"))
	}

	err := h.authService.ForgotPassword(c.Context(), &models.PasswordResetRequest{Email: req.Email})
	if err != nil {
		// Don't reveal if the email exists.  Log internally.
		utils.LogError(c.Context(), "Password reset request failed", err)
		// Always 200 OK
	}
	return respondOK(c, fiber.Map{"message": "If an account with that email exists, a password reset link has been sent."})
}

func (h *AuthHandler) resetPassword(c *fiber.Ctx) error {
	var req models.PasswordResetConfirmRequest
	if err := c.BodyParser(&req); err != nil {
		return respondError(c, http.StatusBadRequest, errors.Wrap(err, "invalid request format"))
	}

	err := h.authService.ResetPassword(c.Context(), req.Token, req.NewPassword)
	if err != nil {
		if errors.Is(err, services.ErrInvalidResetToken) || errors.Is(err, services.ErrPasswordRecentlyUsed) {
			return respondError(c, http.StatusBadRequest, err)
		}
		return respondError(c, http.StatusInternalServerError, errors.New("password reset failed"))
	}
	return respondOK(c, fiber.Map{"message": "Password successfully reset"})
}

func (h *AuthHandler) setAuthCookies(c *fiber.Ctx, accessToken, refreshToken string) {
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(15 * time.Minute), // Short-lived
		HTTPOnly: true,
		Secure:   true, // HTTPS only
		SameSite: "Lax",
		Path:     "/",
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(7 * 24 * time.Hour), // Longer expiration
		HTTPOnly: true,
		Secure:   true, // HTTPS only
		SameSite: "Strict",
		Path:     "/api/v1/auth/refresh", // Only accessible to the refresh endpoint
	})
}

func (h *AuthHandler) clearAuthCookies(c *fiber.Ctx) {
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
		Path:     "/",
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Strict",
		Path:     "/api/v1/auth/refresh",
	})
}

func (h *AuthHandler) getMe(c *fiber.Ctx) error {

	userID, err := GetUserIDFromContextFiber(c) // Use the helper function
	if err != nil {
		return respondError(c, http.StatusUnauthorized, err)
	}

	user, err := h.userService.GetUserByID(c.Context(), userID)
	if err != nil {
		if errors.Is(err, services.ErrUserNotFound) {
			return respondError(c, http.StatusNotFound, err) // Should not happen, but good to check
		}
		return respondError(c, http.StatusInternalServerError, errors.Wrap(err, "failed to get user"))
	}

	// // Create an instance of the User struct
	// userModel := models.User{
	// 	ID:         user.ID,
	// 	Email:      user.Email,
	// 	FirstName:  user.FirstName,
	// 	LastName:   user.LastName,
	// 	Username:   user.Username,
	// 	IsVerified: user.IsVerified,
	// 	IsActive:   user.IsActive,
	// 	CreatedAt:  user.CreatedAt,
	// 	UpdatedAt:  user.UpdatedAt,
	// 	Roles:      user.Roles,
	// 	ActiveRole: user.ActiveRole,
	// }

	// return c.Status(fiber.StatusOK).JSON(userModel)

	// Return a subset of user data (avoid sensitive fields).
	return respondOK(c, fiber.Map{
		"id":         user.ID,
		"name":       user.Name,
		"email":      user.Email,
		"roles":      user.Roles,
		"status":     user.Status,
		"activeRole": user.ActiveRole,
		"location":   user.Location,
		// ... other non-sensitive fields ...
	})
}
