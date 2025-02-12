package emails

import (
	"embed"
	"encoding/json"
	"fmt"
	"html/template"
	"path/filepath"
	"strings"
	"time"
)

//go:embed templates/*
var templateFS embed.FS

// ColorsConfig will hold the parsed colors from colors.json
type ColorsConfig struct {
	Default struct {
		Background            string `json:"background"`
		Foreground            string `json:"foreground"`
		Card                  string `json:"card"`
		CardForeground        string `json:"card-foreground"`
		Popover               string `json:"popover"`
		PopoverForeground     string `json:"popover-foreground"`
		Primary               string `json:"primary"`
		PrimaryForeground     string `json:"primary-foreground"`
		Secondary             string `json:"secondary"`
		SecondaryForeground   string `json:"secondary-foreground"`
		Muted                 string `json:"muted"`
		MutedForeground       string `json:"muted-foreground"`
		Accent                string `json:"accent"`
		AccentForeground      string `json:"accent-foreground"`
		Destructive           string `json:"destructive"`
		DestructiveForeground string `json:"destructive-foreground"`
		Border                string `json:"border"`
		Input                 string `json:"input"`
		Ring                  string `json:"ring"`
		Radius                string `json:"radius"`
	} `json:"default"`
	Gold struct {
		Primary           string `json:"primary"`
		PrimaryForeground string `json:"primary-foreground"`
		Ring              string `json:"ring"`
	} `json:"gold"`
	Blue struct {
		Primary           string `json:"primary"`
		PrimaryForeground string `json:"primary-foreground"`
		Ring              string `json:"ring"`
	} `json:"blue"`
	Dark struct {
		Background            string `json:"background"`
		Foreground            string `json:"foreground"`
		Card                  string `json:"card"`
		CardForeground        string `json:"card-foreground"`
		Popover               string `json:"popover"`
		PopoverForeground     string `json:"popover-foreground"`
		Secondary             string `json:"secondary"`
		SecondaryForeground   string `json:"secondary-foreground"`
		Muted                 string `json:"muted"`
		MutedForeground       string `json:"muted-foreground"`
		Accent                string `json:"accent"`
		AccentForeground      string `json:"accent-foreground"`
		Destructive           string `json:"destructive"`
		DestructiveForeground string `json:"destructive-foreground"`
		Border                string `json:"border"`
		Input                 string `json:"input"`
		Themes                struct {
			Red struct {
				Primary           string `json:"primary"`
				PrimaryForeground string `json:"primary-foreground"`
				Ring              string `json:"ring"`
			} `json:"red"`
			Gold struct {
				Primary           string `json:"primary"`
				PrimaryForeground string `json:"primary-foreground"`
				Ring              string `json:"ring"`
			} `json:"gold"`
			Blue struct {
				Primary           string `json:"primary"`
				PrimaryForeground string `json:"primary-foreground"`
				Ring              string `json:"ring"`
			} `json:"blue"`
		} `json:"themes"`
	} `json:"dark"`
}

var cachedColors *ColorsConfig
var colorsLoadError error

// LoadColors reads and parses colors.json, using embedded file system.
func LoadColors() (*ColorsConfig, error) {
	if cachedColors != nil || colorsLoadError != nil {
		return cachedColors, colorsLoadError // Return cached values if available
	}

	colorsFile, err := templateFS.ReadFile(filepath.Join("shared", "brand", "colors.json"))
	if err != nil {
		colorsLoadError = fmt.Errorf("failed to read colors.json from embedded FS: %w", err)
		return nil, colorsLoadError
	}

	var colors ColorsConfig
	if err := json.Unmarshal(colorsFile, &colors); err != nil {
		colorsLoadError = fmt.Errorf("failed to unmarshal colors.json: %w", err)
		return nil, colorsLoadError
	}

	cachedColors = &colors // Cache the loaded colors
	return cachedColors, nil
}

var templateCache = make(map[string]*template.Template)

// RenderTemplate renders an email template with provided data (including colors)
func RenderTemplate(templatePath string, data map[string]interface{}) (string, error) {
	colors, err := LoadColors()
	if err != nil {
		return "", err
	}
	data["Colors"] = colors
	data["Year"] = time.Now().Year()

	tmpl, ok := templateCache[templatePath]
	if !ok {
		baseTemplate := template.New("root").Funcs(template.FuncMap{
			"formatDate": func(t time.Time) string {
				return t.Format("January 2, 2006")
			},
		})

		// Parse base partials first
		_, err = baseTemplate.ParseFS(templateFS, "templates/_partials/*.html")
		if err != nil {
			return "", fmt.Errorf("failed to parse partial templates: %w", err)
		}

		// Parse brand components
		_, err = baseTemplate.ParseFS(templateFS, "shared/brand/components/*.html")
		if err != nil {
			return "", fmt.Errorf("failed to parse brand components: %w", err)
		}

		// Parse the main template
		tmpl, err = baseTemplate.ParseFS(templateFS, templatePath)
		if err != nil {
			return "", fmt.Errorf("failed to parse template %s: %w", templatePath, err)
		}
		templateCache[templatePath] = tmpl
	}

	var buf strings.Builder
	if err := tmpl.ExecuteTemplate(&buf, filepath.Base(templatePath), data); err != nil {
		return "", fmt.Errorf("failed to execute template: %w", err)
	}
	return buf.String(), nil
}

func SendVerificationEmail(email string, verificationLink string, theme string) error {
	templateData := map[string]interface{}{
		"Email":           email,
		"VerificationURL": verificationLink,
		"Theme":           theme,
		"ExpirationHours": 24,
	}

	// Update these paths to match your new structure
	subjectHTML, err := RenderTemplate("templates/verification/subject.html", templateData)
	if err != nil {
		return fmt.Errorf("failed to render subject template: %w", err)
	}

	bodyHTML, err := RenderTemplate("templates/verification/body.html", templateData)
	if err != nil {
		return fmt.Errorf("failed to render body template: %w", err)
	}

	fmt.Println("Subject HTML:", subjectHTML)
	fmt.Println("Body HTML:", bodyHTML)
	return nil
}

// SendPasswordResetEmail is an example function to send a password reset email
func SendPasswordResetEmail(email string, passwordResetLink string, theme string) error {
	templateData := map[string]interface{}{
		"Email":             email,
		"PasswordResetLink": passwordResetLink,
		"Theme":             theme, // Pass the theme if you want theme-specific colors
		// ... other data
	}

	subjectTemplatePath := "templates/password-reset/subject.html"
	bodyTemplatePath := "templates/password-reset/body.html"

	subjectHTML, err := RenderTemplate(subjectTemplatePath, templateData)
	if err != nil {
		return fmt.Errorf("failed to render subject template: %w", err)
	}
	bodyHTML, err := RenderTemplate(bodyTemplatePath, templateData)
	if err != nil {
		return fmt.Errorf("failed to render body template: %w", err)
	}

	// ... (Logic to send the email using subjectHTML and bodyHTML) ...

	fmt.Println("Subject HTML:", subjectHTML) // For debugging
	fmt.Println("Body HTML:", bodyHTML)       // For debugging
	return nil
}
