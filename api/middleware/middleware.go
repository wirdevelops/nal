package middleware

import (
	"errors"
	"nalevel/repositories"
	"nalevel/services"
	"nalevel/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// AuthMiddleware handles JWT authentication, authorization, and account status checks.
type AuthMiddleware struct {
	tokenService *utils.TokenService
	userRepo     repositories.UserRepository
	rateLimiter  *utils.RateLimiter                      // Optional, but good for security
	roleService  services.RolePermissionServiceInterface // Inject RolePermissionService
}

// NewAuthMiddleware creates a new AuthMiddleware instance.
func NewAuthMiddleware(
	tokenService *utils.TokenService,
	userRepo repositories.UserRepository,
	rateLimiter *utils.RateLimiter, // Optional
	roleService services.RolePermissionServiceInterface, // Inject RolePermissionServiceInterface
) *AuthMiddleware {
	return &AuthMiddleware{
		tokenService: tokenService,
		userRepo:     userRepo,
		rateLimiter:  rateLimiter,
		roleService:  roleService, // Assign the injected service
	}
}

// JWTProtected is a middleware that protects routes requiring JWT authentication.
// It now takes an optional requiredPermission parameter.
func (m *AuthMiddleware) JWTProtected(requiredPermission ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 1. Rate Limiting (Optional, but highly recommended)
		if m.rateLimiter != nil {
			ip := GetIPAddress(c) // Use the helper function consistently
			if !m.rateLimiter.Allow(ip) {
				return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
					"message": "Too many requests",
				})
			}
		}

		// 2. Get Token (from header or cookie - header takes precedence)
		tokenString := ""
		authHeader := c.Get("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
				tokenString = parts[1]
			}
		}

		if tokenString == "" {
			tokenString = c.Cookies("access_token")
		}

		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Authorization token is required",
			})
		}

		// 3. Validate Token
		claims, err := m.tokenService.ValidateToken(c.Context(), tokenString)
		if err != nil {
			// More generic error message in production
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Invalid or expired token",
				// "error":   err.Error(), // REMOVE or make conditional on environment in production
			})
		}

		// 4. Check Token Type (must be "access")
		if claims.TokenType != "access" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Invalid token type",
			})
		}

		// 5. Get and Validate User ID
		userID, err := primitive.ObjectIDFromHex(claims.UserID)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Invalid user ID in token",
			})
		}

		// 6. Fetch User and Check Status
		user, err := m.userRepo.FindByID(c.Context(), userID)
		if err != nil {
			if errors.Is(err, mongo.ErrNoDocuments) { // Or repositories.ErrNotFound
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"message": "User not found",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to retrieve user",
			})
		}

		// 7. Check Account Lock Status
		if user.LockUntil != nil && user.LockUntil.After(utils.TimeNow()) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"message": "Account temporarily locked"})
		}

		// 8. Check Email Verification Status
		if !user.IsVerified {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"message": "Email not verified"})
		}

		// 9. Store User ID and User Object in Context
		c.Locals("userID", userID)
		c.Locals("user", user)

		// 10. Check Permission (Optional - only if you need permission checks at the JWT level)
		if len(requiredPermission) > 0 && requiredPermission[0] != "" { // Check if a permission is required
			hasPermission, err := m.roleService.CheckPermission(c.UserContext(), userID, requiredPermission[0])
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"message": "Failed to check permissions",
				})
			}
			if !hasPermission {
				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
					"message": "Insufficient permissions",
				})
			}
		}

		return c.Next()
	}
}

// GetIPAddress gets the client's IP address, handling X-Forwarded-For.
func GetIPAddress(c *fiber.Ctx) string {
	xff := c.Get("X-Forwarded-For")
	if xff != "" {
		ips := strings.Split(xff, ",")
		// Typically, the client IP is the first one in the list.
		return strings.TrimSpace(ips[0])
	}
	return c.IP() // Fallback to Fiber's built-in IP retrieval
}
