package repositories

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client *mongo.Client
	DB     *mongo.Database
)

func ConnectDB(mongoURI, dbName string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Check the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	Client = client
	DB = client.Database(dbName)
	// ... initialize other collections
	log.Println("Connected to MongoDB!")
}

// Include a function to close the connection when the application exits
func DisconnectDB() {
	if Client != nil {
		if err := Client.Disconnect(context.TODO()); err != nil {
			panic(err) // Or handle the error appropriately
		}
	}
}
