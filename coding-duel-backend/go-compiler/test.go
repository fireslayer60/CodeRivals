package main

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

func main() {
	fmt.Println(">>> Creating Redis client (v9)...")

	rdb := redis.NewClient(&redis.Options{
		Addr:         "127.0.0.1:6379", // Ensure no DNS/IPv6 issues
		DialTimeout:  2 * time.Second,  // Protect against hanging
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	fmt.Println(">>> Pinging Redis...")

	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("❌ Redis ping failed:", err)
		return
	}

	fmt.Println("✅ Redis responded:", pong)
}
