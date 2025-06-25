package main

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

func netmain() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	fmt.Println(">>> Connecting with go-redis v8...")

	rdb := redis.NewClient(&redis.Options{
		Addr: "127.0.0.1:6379",
	})

	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("❌ Redis ping failed:", err)
		return
	}

	fmt.Println("✅ Redis responded:", pong)
}
