package notification

// import (
// 	"bytes"
// 	"context"
// 	"html/template"
// 	"time"

// 	"golang.org/x/time/rate"
// )

// type EmailHandler struct {
// 	client      EmailClient
// 	templates   *template.Template
// 	rateLimiter *rate.Limiter
// }

// func NewEmailHandler(smtpConfig config.SMTP) *EmailHandler {
// 	return &EmailHandler{
// 		client:      NewSMTPClient(smtpConfig),
// 		templates:   template.Must(template.ParseGlob("templates/email/*.tmpl")),
// 		rateLimiter: rate.NewLimiter(rate.Every(1*time.Second), 10), // 10 req/sec
// 	}
// }

// func (h *EmailHandler) Send(ctx context.Context, userID string, data map[string]string) error {
// 	// Rate limit
// 	if err := h.rateLimiter.Wait(ctx); err != nil {
// 		return err
// 	}

// 	// Get user preferences
// 	prefs, err := userService.GetPreferences(ctx, userID)
// 	if err != nil || !prefs.EmailEnabled {
// 		return ErrChannelDisabled
// 	}

// 	// Render template
// 	var body bytes.Buffer
// 	if err := h.templates.ExecuteTemplate(&body, data["template"], data); err != nil {
// 		return err
// 	}

// 	// Send
// 	return h.client.Send(ctx, EmailRequest{
// 		To:      data["email"],
// 		Subject: data["subject"],
// 		Body:    body.String(),
// 	})
// }
