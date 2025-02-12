package middleware

import (
	"nalevel/models"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func AdminOnly() fiber.Handler { // No userService needed!
	return func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(*models.User)
		if !ok || user == nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		for _, role := range user.Roles {
			if role == models.RoleAdmin {
				return c.Next() // Admin - proceed
			}
		}

		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"}) // Not an admin
	}
}
