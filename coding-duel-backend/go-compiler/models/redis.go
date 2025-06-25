package models

import (
	"context"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

func init() {
	log.Println(">>> Entering models.init()")

	redisClient = redis.NewClient(&redis.Options{
		Addr: "127.0.0.1:6379", // ← switch from localhost to avoid IPv6 stalls
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	log.Println(">>> Pinging Redis...")

	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatalf("❌ Redis connection failed: %v", err)
	}

	log.Println("✅ Redis connection successful in models.init()")
}

func GetRedisClient() *redis.Client {
	return redisClient
}
