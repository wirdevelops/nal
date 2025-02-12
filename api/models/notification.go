package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type NotificationEvent struct {
	EventID          string            `json:"event_id"`
	EventType        string            `json:"event_type"` // e.g., "user.created"
	UserID           string            `json:"user_id"`
	Category         string            `json:"category"`          // "security", "marketing"
	Data             map[string]string `json:"data"`              // Template variables
	RequiredChannels []string          `json:"required_channels"` // Override preferences
}

// Preference Structure (stored in DB)
type NotificationPreference struct {
	UserID      string                `bson:"userId"`
	Channels    map[string]bool       `bson:"channels"`    // email: true, sms: false
	Categories  map[string]ChannelOpt `bson:"categories"`  // marketing: {email: true}
	GlobalOptIn bool                  `bson:"globalOptIn"` // Master switch
}

type ChannelOpt struct {
	Email bool `bson:"email"`
	SMS   bool `bson:"sms"`
	Push  bool `bson:"push"`
}

// Event represents a generic event structure.
type Event struct {
	ID        string      `json:"id"`
	Type      string      `json:"type"`
	Timestamp time.Time   `json:"timestamp"`
	Data      interface{} `json:"data"` // Use interface{} for flexibility
}

// NewEvent creates a new event with a unique ID and timestamp.
func NewEvent(eventType string, data interface{}) *Event {
	return &Event{
		ID:        uuid.New().String(),
		Type:      eventType,
		Timestamp: time.Now(),
		Data:      data,
	}
}

// Marshal converts the event to JSON bytes.
func (e *Event) Marshal() ([]byte, error) {
	return json.Marshal(e)
}

// UnmarshalEvent unmarshals JSON bytes into an Event.
func UnmarshalEvent(data []byte) (*Event, error) {
	var e Event
	if err := json.Unmarshal(data, &e); err != nil {
		return nil, err
	}
	return &e, nil
}

// String provides a string representation of the event.
func (e *Event) String() string {
	return e.ID
}
