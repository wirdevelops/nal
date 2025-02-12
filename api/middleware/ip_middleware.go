// middleware/ip_middleware.go
package middleware

import (
	"nalevel/utils"

	"github.com/gofiber/fiber/v2"
)

func IPAddressMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		ip, err := utils.GetIPAddress(c.UserContext()) // Get IP using your util, passing Fiber's context
		if err != nil {
			// Handle the case where no IP is found (e.g., log it, set a default)
			ip = "unknown" // Or log the error and continue, depending on your needs.
		}
		c.Locals(utils.CtxKeyIPAddress, ip) // Store the IP using c.Locals()
		return c.Next()
	}
}
