package utils

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"net/url"
	"strings"
	"time"

	"github.com/hashicorp/go-multierror"
	"github.com/rs/zerolog/log"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"golang.org/x/time/rate"
	"gopkg.in/gomail.v2"
)

//go:embed emails/templates/*
var templateFS embed.FS

// EmailService provides email sending capabilities
type EmailService struct {
	provider    EmailProvider
	templates   *template.Template
	retryCount  int
	retryDelay  time.Duration
	rateLimiter *rate.Limiter
	fromName    string
	fromEmail   string
	appURL      string // Add appURL
}

// EmailProvider interface for different email providers
type EmailProvider interface {
	SendEmail(to, subject, body string) error
}

// SMTPConfig configuration for SMTP provider
type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
}

// EmailConfig configuration for email service
type EmailConfig struct {
	ProviderType   string // "sendgrid" or "smtp"
	RetryCount     int
	RetryDelay     time.Duration
	RateLimit      rate.Limit
	FromName       string
	FromEmail      string
	SendGridAPIKey string     // For SendGrid
	SMTPConfig     SMTPConfig // For SMTP
	AppURL         string     // Add AppURL
}

// NewEmailService creates a new email service instance
func NewEmailService(config EmailConfig) (*EmailService, error) {
	var provider EmailProvider

	switch strings.ToLower(config.ProviderType) {
	case "sendgrid":
		provider = NewSendGridProvider(config.SendGridAPIKey, config.FromName, config.FromEmail)
	case "smtp":
		provider = NewSMTPProvider(config.SMTPConfig, config.FromName, config.FromEmail)
	default:
		return nil, fmt.Errorf("invalid email provider type: %s", config.ProviderType)
	}

	templates, err := parseTemplates()
	if err != nil {
		return nil, fmt.Errorf("failed to load email templates: %w", err)
	}

	return &EmailService{
		provider:    provider,
		templates:   templates,
		retryCount:  config.RetryCount,
		retryDelay:  config.RetryDelay,
		rateLimiter: rate.NewLimiter(config.RateLimit, 1),
		fromName:    config.FromName,
		fromEmail:   config.FromEmail,
		appURL:      config.AppURL, // Initialize appURL
	}, nil
}

// parseTemplates loads email templates from embedded filesystem
func parseTemplates() (*template.Template, error) {
	tpl := template.New("emails").Funcs(template.FuncMap{
		"formatDate": func(t time.Time) string {
			return t.Format("January 2, 2006")
		},
		"upper": strings.ToUpper,
	})

	// Walk the embedded filesystem
	err := fs.WalkDir(templateFS, "emails/templates", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// Skip directories and non-HTML files
		if d.IsDir() || !strings.HasSuffix(path, ".html") {
			return nil
		}

		// Read the template file content
		content, err := templateFS.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read template %s: %w", path, err)
		}

		// Get the template name (relative path without "emails/templates/")
		name := strings.TrimPrefix(path, "emails/templates/")

		// Parse the template content
		_, err = tpl.New(name).Parse(string(content))
		if err != nil {
			return fmt.Errorf("failed to parse template %s: %w", path, err)
		}
		log.Info().Str("template", name).Msg("Loaded email template") // Structured logging

		return nil
	})

	if err != nil {
		return nil, err
	}

	return tpl, nil
}

// EmailService modification
func (s *EmailService) SendVerificationEmail(ctx context.Context, email, token string) error {
	// Don't accept the full URL as a parameter - this should be constructed here
	// to ensure consistency and prevent URL injection
	verificationURL := fmt.Sprintf("%s/auth/verify-email?token=%s", s.appURL, url.QueryEscape(token))

	data := map[string]interface{}{
		"VerificationURL": verificationURL,
		"ExpirationHours": 24,
	}

	body, err := s.renderTemplate("verification/body.html", data)
	if err != nil {
		return fmt.Errorf("failed to render verification email: %w", err)
	}

	subject, err := s.renderTemplate("verification/subject.html", data)
	if err != nil {
		return fmt.Errorf("failed to render verification subject: %w", err)
	}

	return s.sendWithRetry(ctx, email, subject, body)
}

// SendPasswordResetEmail sends a password reset email.
func (s *EmailService) SendPasswordResetEmail(ctx context.Context, email, token string) error {
	resetURL := fmt.Sprintf("%s/auth/reset-password?token=%s", s.appURL, token) // Adjust URL

	data := map[string]interface{}{
		"PasswordResetURL": resetURL,
		// Add other data needed by your template
	}

	body, err := s.renderTemplate("password-reset/body.html", data) // Corrected path
	if err != nil {
		return fmt.Errorf("failed to render password reset email: %w", err)
	}

	subject, err := s.renderTemplate("password-reset/subject.html", data) // Corrected path!
	if err != nil {
		return fmt.Errorf("failed to render verification subject email: %w", err)
	}

	return s.sendWithRetry(ctx, email, subject, body)
}

// // SendPasswordResetEmail sends a password reset email.
// func (s *EmailService) SendPasswordResetEmail(ctx context.Context, email, token string) error {
// 	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.appURL, token) // Adjust URL

// 	data := map[string]interface{}{
// 		"PasswordResetURL": resetURL,
// 		// Add other data needed by your template
// 	}

// 	body, err := s.renderTemplate("password-reset/body.html", data) // Corrected path
// 	if err != nil {
// 		return fmt.Errorf("failed to render password reset email: %w", err)
// 	}

// 	subject, err := s.renderTemplate("password-reset/subject.html", data) // Corrected path!
// 	if err != nil {
// 		return fmt.Errorf("failed to render verification subject email: %w", err)
// 	}

// 	return s.sendWithRetry(ctx, email, subject, body)
// }

// renderTemplate renders a specific email template.
func (s *EmailService) renderTemplate(templateName string, data interface{}) (string, error) {
	var buf bytes.Buffer
	if err := s.templates.ExecuteTemplate(&buf, templateName, data); err != nil {
		return "", fmt.Errorf("failed to execute template %s: %w", templateName, err)
	}
	return buf.String(), nil
}

// sendWithRetry handles email sending with retries.
func (s *EmailService) sendWithRetry(ctx context.Context, to, subject, body string) error {
	// ... (same retry logic as before) ...
	var result error

	for i := 0; i <= s.retryCount; i++ {
		if err := s.rateLimiter.Wait(ctx); err != nil {
			return fmt.Errorf("rate limit exceeded: %w", err)
		}

		if err := s.provider.SendEmail(to, subject, body); err == nil {
			log.Info().Str("email", to).Msg("Email sent successfully")
			return nil
		} else {
			result = multierror.Append(result, err)
			log.Warn().
				Err(err).
				Str("email", to).
				Int("attempt", i+1).
				Msg("Email send failed")

			if i < s.retryCount {
				select {
				case <-time.After(s.retryDelay):
				case <-ctx.Done():
					return ctx.Err()
				}
			}
		}
	}

	return fmt.Errorf("failed to send email after %d attempts: %w", s.retryCount, result)
}

// SendGridProvider implementation
type SendGridProvider struct {
	client    *sendgrid.Client
	fromName  string
	fromEmail string
}

// NewSendGridProvider creates a SendGrid email provider
func NewSendGridProvider(apiKey, fromName, fromEmail string) *SendGridProvider {
	return &SendGridProvider{
		client:    sendgrid.NewSendClient(apiKey),
		fromName:  fromName,
		fromEmail: fromEmail,
	}
}

// SendEmail implements EmailProvider for SendGrid
func (p *SendGridProvider) SendEmail(to, subject, body string) error {
	from := mail.NewEmail(p.fromName, p.fromEmail)
	toEmail := mail.NewEmail("", to)
	// Set HTML content as the fifth parameter and plain text as the fourth (empty string in this case)
	message := mail.NewSingleEmail(from, subject, toEmail, "", body)

	response, err := p.client.Send(message)
	if err != nil {
		return fmt.Errorf("sendgrid error: %w", err)
	}

	if response.StatusCode >= 400 {
		return fmt.Errorf("sendgrid error: %s (status %d)", response.Body, response.StatusCode)
	}
	return nil
}

// SMTPProvider implementation
type SMTPProvider struct {
	dialer    *gomail.Dialer
	fromName  string
	fromEmail string
}

// NewSMTPProvider creates an SMTP email provider
func NewSMTPProvider(config SMTPConfig, fromName, fromEmail string) *SMTPProvider {
	dialer := gomail.NewDialer(config.Host, config.Port, config.Username, config.Password)
	return &SMTPProvider{
		dialer:    dialer,
		fromName:  fromName,
		fromEmail: fromEmail,
	}
}

// SendEmail implements EmailProvider for SMTP
func (p *SMTPProvider) SendEmail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(p.fromEmail, p.fromName))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	if err := p.dialer.DialAndSend(m); err != nil {
		return fmt.Errorf("smtp error: %w", err)
	}
	return nil
}
