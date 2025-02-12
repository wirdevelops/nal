package notification

// import (
// 	"context"
// 	"time"

// 	"github.com/sony/gobreaker"
// )

// type SMSHandler struct {
// 	client SMSClient
// 	cb     *gobreaker.CircuitBreaker
// }

// func NewSMSHandler(twilioConfig config.Twilio) *SMSHandler {
// 	return &SMSHandler{
// 		client: NewTwilioClient(twilioConfig),
// 		cb: gobreaker.NewCircuitBreaker(gobreaker.Settings{
// 			Name:    "sms-service",
// 			Timeout: 30 * time.Second,
// 			ReadyToTrip: func(counts gobreaker.Counts) bool {
// 				return counts.ConsecutiveFailures > 5
// 			},
// 		}),
// 	}
// }

// func (h *SMSHandler) Send(ctx context.Context, userID string, data map[string]string) error {
// 	// Check circuit breaker
// 	_, err := h.cb.Execute(func() (interface{}, error) {
// 		// Get user phone number
// 		phone, err := userService.GetPhone(ctx, userID)
// 		if err != nil {
// 			return nil, err
// 		}

// 		// Send SMS
// 		return nil, h.client.SendSMS(ctx, phone, data["message"])
// 	})
// 	return err
// }
