// utils/key_provider.go

package utils

import (
	"crypto/ed25519"
	"fmt"
	"log"
	"sync"
	"time"
)

// KeyProvider is an interface for providing cryptographic keys.
type KeyProvider interface {
	GetCurrentPrivateKey() ed25519.PrivateKey
	GetPublicKey(kid string) (ed25519.PublicKey, error)
}

// InMemoryKeyProvider is a simple in-memory implementation of KeyProvider (for demonstration).
// In production, you'd likely use a more secure key storage mechanism.
type InMemoryKeyProvider struct {
	currentPrivateKey ed25519.PrivateKey
	currentPublicKey  ed25519.PublicKey
	keyID             string
	rotationInterval  time.Duration // How often to rotate keys
	lastRotation      time.Time
	mu                sync.RWMutex
}

// NewInMemoryKeyProvider creates a new InMemoryKeyProvider.
func NewInMemoryKeyProvider(rotationInterval time.Duration) (*InMemoryKeyProvider, error) {
	pub, priv, err := ed25519.GenerateKey(nil)
	if err != nil {
		return nil, fmt.Errorf("failed to generate initial key pair: %w", err)
	}

	kp := &InMemoryKeyProvider{
		currentPrivateKey: priv,
		currentPublicKey:  pub,
		keyID:             "key-1", // Initial key ID
		rotationInterval:  rotationInterval,
		lastRotation:      time.Now(),
	}

	// Start the key rotation goroutine
	go kp.rotateKeys()

	return kp, nil
}

// GetCurrentPrivateKey returns the current private key.
func (kp *InMemoryKeyProvider) GetCurrentPrivateKey() ed25519.PrivateKey {
	kp.mu.RLock()
	defer kp.mu.RUnlock()
	return kp.currentPrivateKey
}

// GetPublicKey returns the public key for the given key ID.
func (kp *InMemoryKeyProvider) GetPublicKey(kid string) (ed25519.PublicKey, error) {
	kp.mu.RLock()
	defer kp.mu.RUnlock()

	if kid == kp.keyID {
		return kp.currentPublicKey, nil
	}
	return nil, fmt.Errorf("key with ID %s not found", kid)
}

// rotateKeys periodically rotates the keys.
func (kp *InMemoryKeyProvider) rotateKeys() {
	ticker := time.NewTicker(kp.rotationInterval)
	defer ticker.Stop()

	for range ticker.C {
		if err := kp.RotateKeys(); err != nil {
			log.Printf("Key rotation failed: %v\n", err)
		}
	}
}

// RotateKeys generates a new key pair and updates the key provider.
func (kp *InMemoryKeyProvider) RotateKeys() error {
	kp.mu.Lock()
	defer kp.mu.Unlock()

	newPub, newPriv, err := ed25519.GenerateKey(nil)
	if err != nil {
		return fmt.Errorf("failed to generate new key pair: %w", err)
	}

	// Update the keys and key ID
	kp.currentPrivateKey = newPriv
	kp.currentPublicKey = newPub
	kp.keyID = fmt.Sprintf("key-%d", time.Now().Unix()) // Use a timestamp for the new key ID
	kp.lastRotation = time.Now()

	fmt.Printf("Keys rotated.  New key ID: %s\n", kp.keyID)
	return nil
}
