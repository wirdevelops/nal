// config/config.go

package config

import (
	"encoding/base64"
	"log"
	"os"
	"regexp"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type AuthConfig struct {
	MaxLoginAttempts            int            `json:"max_login_attempts"`
	LockDuration                time.Duration  `json:"lock_duration"`
	PasswordValidator           *regexp.Regexp `json:"-"`
	BcryptCost                  int            `json:"bcrypt_cost"`
	PasswordHistorySize         int            `json:"password_history_size"`
	TokenBlacklistTTL           time.Duration  `json:"token_blacklist_ttl"`
	JWTSecret                   []byte         `json:"-"`
	TokenExpiration             time.Duration  `json:"token_expiration"`
	VerificationTokenExpiration time.Duration  `json:"verification_token_expiration"`
	AccountLockDuration         time.Duration  `json:"account_lock_duration"`
	RefreshTokenExpiration      time.Duration  `json:"refresh_token_expiration"`
}

// KafkaConfig ... (rest of your KafkaConfig struct)

type KafkaConfig struct {
	Brokers           []string      `yaml:"brokers"`
	Topic             string        `yaml:"topic"`
	GroupID           string        `yaml:"group_id"`
	ReadTimeout       time.Duration `yaml:"read_timeout" default:"10s"`
	WriteTimeout      time.Duration `yaml:"write_timeout" default:"10s"`
	CommitInterval    time.Duration `yaml:"commit_interval" default:"1s"`
	BatchSize         int           `yaml:"batch_size" default:"100"`
	BatchTimeout      time.Duration `yaml:"batch_timeout" default:"1s"`
	MaxRetries        int           `yaml:"max_retries" default:"3"`
	RetryBackoff      time.Duration `yaml:"retry_backoff" default:"100ms"`
	MinBytes          int           `yaml:"min_bytes" default:"10e3"` // 10KB
	MaxBytes          int           `yaml:"max_bytes" default:"10e6"` // 10MB
	HeartbeatInterval time.Duration `yaml:"heartbeat_interval" default:"3s"`
	SessionTimeout    time.Duration `yaml:"session_timeout" default:"30s"`
	AutoOffsetReset   string        `yaml:"auto_offset_reset" default:"latest"`
	RequiredAcks      int           `json:"required_acks" yaml:"required_acks"` // Keep as int
	DLQTopic          string        `json:"dlq_topic" yaml:"dlq_topic"`
}

type AuditConfig struct {
	AsyncBufferSize int           `json:"async_buffer_size"`
	MaxRetries      int           `json:"max_retries"`
	DBTimeout       time.Duration `json:"db_timeout"`
}

// RedisConfig holds Redis configuration.  This mirrors the struct in your cache package.
type RedisConfig struct {
	Address      string        `json:"address"`
	Password     string        `json:"password"`
	DB           int           `json:"db"`
	DialTimeout  time.Duration `json:"dial_timeout"`
	ReadTimeout  time.Duration `json:"read_timeout"`
	WriteTimeout time.Duration `json:"write_timeout"`
	PoolSize     int           `json:"pool_size"`
	MinIdleConns int           `json:"min_idle_conns"`
	UserCacheTTL time.Duration // Added UserCacheTTL
}

// Config holds all application configurations.
type Config struct {
	MongoURI         string
	DBName           string
	PasetoPrivateKey string
	PasetoPublicKey  string
	ServerPort       string
	EmailFrom        string
	SMTPHost         string
	SMTPPort         string
	SMTPUser         string
	SMTPPassword     string
	AppURL           string
	SymmetricKey     []byte
	Auth             AuthConfig
	Kafka            KafkaConfig // Use the KafkaConfig struct directly
	Redis            RedisConfig
	Audit            AuditConfig
}

// Improved password validation pattern (SAFE DEFAULT)
const defaultPasswordPattern = `^[a-zA-Z0-9@$!%*?&]{8,}$`

func LoadConfig() *Config {
	_ = godotenv.Load() // Ignore error, it's okay if .env is missing

	// Helper function
	getEnv := func(key, fallback string) string {
		value := os.Getenv(key)
		if value == "" {
			return fallback
		}
		return value
	}

	// Load and decode symmetric key
	symmetricKeyBase64 := getEnv("PASETO_SYMMETRIC_KEY", "") // Use getEnv
	symmetricKey, err := base64.StdEncoding.DecodeString(symmetricKeyBase64)
	if err != nil && symmetricKeyBase64 != "" { // Only fatal if the variable *was* set but is invalid.
		log.Fatalf("Failed to decode symmetric key: %v", err)
	}

	// Load and decode JWT secret
	jwtSecretBase64 := getEnv("JWT_SECRET_KEY", "")
	jwtSecret, err := base64.StdEncoding.DecodeString(jwtSecretBase64)
	if err != nil && jwtSecretBase64 != "" { // Only fatal if the variable *was* set.
		log.Fatalf("Failed to decode JWT secret: %v", err)
	}

	// Parse password pattern.  IMPORTANT CHANGES HERE:
	passwordPatternStr := getEnv("PASSWORD_PATTERN", defaultPasswordPattern) // Get from env OR use the SAFE default.
	passwordRegex, err := regexp.Compile(passwordPatternStr)
	if err != nil {
		log.Printf("Invalid password pattern from environment, using default: %v", err)
		// Compile the *safe* default pattern string directly, handling any (unlikely) error.
		passwordRegex, err = regexp.Compile(defaultPasswordPattern)
		if err != nil {
			log.Fatalf("FATAL: Default password pattern is also invalid: %v", err) // Panic here is acceptable.
		}
	}

	// Parse numeric values with proper error handling
	maxLoginAttempts, _ := strconv.Atoi(getEnv("MAX_LOGIN_ATTEMPTS", "5"))
	bcryptCost, _ := strconv.Atoi(getEnv("BCRYPT_COST", "12"))
	passwordHistorySize, _ := strconv.Atoi(getEnv("PASSWORD_HISTORY_SIZE", "5"))
	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0")) // Default to DB 0
	redisPoolSize, _ := strconv.Atoi(getEnv("REDIS_POOL_SIZE", "10"))
	redisMinIdleConns, _ := strconv.Atoi(getEnv("REDIS_MIN_IDLE_CONNS", "5"))

	kafkaRequiredAcks, _ := strconv.Atoi(getEnv("KAFKA_REQUIRED_ACKS", "-1")) // Default to -1 (RequireAll)
	kafkaBatchSize, _ := strconv.Atoi(getEnv("KAFKA_BATCH_SIZE", "100"))      // Default to 100
	kafkaMaxRetries, _ := strconv.Atoi(getEnv("KAFKA_MAX_RETRIES", "3"))      // Default to 3

	// Parse durations
	lockDuration, _ := time.ParseDuration(getEnv("LOCK_DURATION", "15m"))
	tokenBlacklistTTL, _ := time.ParseDuration(getEnv("TOKEN_BLACKLIST_TTL", "24h"))
	tokenExpiration, _ := time.ParseDuration(getEnv("TOKEN_EXPIRATION", "15m"))
	verificationTokenExpiration, _ := time.ParseDuration(getEnv("VERIFICATION_TOKEN_EXPIRATION", "24h")) // Added parsing
	redisDialTimeout, _ := time.ParseDuration(getEnv("REDIS_DIAL_TIMEOUT", "5s"))
	redisReadTimeout, _ := time.ParseDuration(getEnv("REDIS_READ_TIMEOUT", "3s"))
	redisWriteTimeout, _ := time.ParseDuration(getEnv("REDIS_WRITE_TIMEOUT", "3s"))
	userCacheTTL, _ := time.ParseDuration(getEnv("USER_CACHE_TTL", "1h")) // Default 1 hour

	kafkaReadTimeout, _ := time.ParseDuration(getEnv("KAFKA_READ_TIMEOUT", "10s"))            // Default 10s
	kafkaWriteTimeout, _ := time.ParseDuration(getEnv("KAFKA_WRITE_TIMEOUT", "10s"))          // Default 10s
	kafkaCommitInterval, _ := time.ParseDuration(getEnv("KAFKA_COMMIT_INTERVAL", "1s"))       // Default 1s
	kafkaBatchTimeout, _ := time.ParseDuration(getEnv("KAFKA_BATCH_TIMEOUT", "1s"))           // Default 1s
	kafkaRetryBackoff, _ := time.ParseDuration(getEnv("KAFKA_RETRY_BACKOFF", "100ms"))        // Default 100ms
	kafkaHeartbeatInterval, _ := time.ParseDuration(getEnv("KAFKA_HEARTBEAT_INTERVAL", "3s")) // Default 3s
	kafkaSessionTimeout, _ := time.ParseDuration(getEnv("KAFKA_SESSION_TIMEOUT", "30s"))      // Default 30s

	kafkaMinBytes, _ := strconv.Atoi(getEnv("KAFKA_MIN_BYTES", "10000"))    // 10KB
	kafkaMaxBytes, _ := strconv.Atoi(getEnv("KAFKA_MAX_BYTES", "10000000")) // 10MB

	// Parse comma-separated Kafka brokers
	brokersStr := getEnv("KAFKA_BROKERS", "localhost:9092")
	brokers := []string{}
	for _, broker := range regexp.MustCompile(`\s*,\s*`).Split(brokersStr, -1) {
		brokers = append(brokers, broker)
	}

	return &Config{
		MongoURI:         getEnv("MONGODB_URI", "mongodb://localhost:27017"),
		DBName:           getEnv("DB_NAME", "nalevel-db"),
		PasetoPrivateKey: getEnv("PASETO_PRIVATE_KEY", ""),
		PasetoPublicKey:  getEnv("PASETO_PUBLIC_KEY", ""),
		ServerPort:       getEnv("SERVER_PORT", ":8080"),
		EmailFrom:        getEnv("EMAIL_FROM", ""),
		SMTPHost:         getEnv("SMTP_HOST", ""),
		SMTPPort:         getEnv("SMTP_PORT", "587"),
		SMTPUser:         getEnv("SMTP_USER", ""),
		SMTPPassword:     getEnv("SMTP_PASSWORD", ""),
		AppURL:           getEnv("APP_URL", "http://localhost:3000"),
		SymmetricKey:     symmetricKey,
		Auth: AuthConfig{
			MaxLoginAttempts:            maxLoginAttempts,
			LockDuration:                lockDuration,
			PasswordValidator:           passwordRegex,
			BcryptCost:                  bcryptCost,
			PasswordHistorySize:         passwordHistorySize,
			TokenBlacklistTTL:           tokenBlacklistTTL,
			JWTSecret:                   jwtSecret,
			TokenExpiration:             tokenExpiration,
			VerificationTokenExpiration: verificationTokenExpiration,
		},
		Kafka: KafkaConfig{
			Brokers:           brokers,
			Topic:             getEnv("KAFKA_TOPIC", "user-events"),
			GroupID:           getEnv("KAFKA_GROUP_ID", "my-consumer-group"), // Added KAFKA_GROUP_ID
			ReadTimeout:       kafkaReadTimeout,
			WriteTimeout:      kafkaWriteTimeout,
			CommitInterval:    kafkaCommitInterval,
			BatchSize:         kafkaBatchSize,
			BatchTimeout:      kafkaBatchTimeout,
			MaxRetries:        kafkaMaxRetries,
			RetryBackoff:      kafkaRetryBackoff,
			MinBytes:          kafkaMinBytes, // Add MinBytes
			MaxBytes:          kafkaMaxBytes, // Add MaxBytes
			HeartbeatInterval: kafkaHeartbeatInterval,
			SessionTimeout:    kafkaSessionTimeout,
			AutoOffsetReset:   getEnv("KAFKA_AUTO_OFFSET_RESET", "latest"), //  KAFKA_AUTO_OFFSET_RESET
			RequiredAcks:      kafkaRequiredAcks,
			DLQTopic:          getEnv("KAFKA_DLQ_TOPIC", "my-events-dlq"),
		},
		Redis: RedisConfig{
			Address:      getEnv("REDIS_ADDRESS", "localhost:6379"),
			Password:     getEnv("REDIS_PASSWORD", ""),
			DB:           redisDB,
			DialTimeout:  redisDialTimeout,
			ReadTimeout:  redisReadTimeout,
			WriteTimeout: redisWriteTimeout,
			PoolSize:     redisPoolSize,
			MinIdleConns: redisMinIdleConns,
			UserCacheTTL: userCacheTTL,
		},
	}
}
