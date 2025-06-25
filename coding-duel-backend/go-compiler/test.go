package main

import (
	"fmt"
	"net"
	"time"
)

func main() {
	fmt.Println("Dialing Redis directly...")
	conn, err := net.DialTimeout("tcp", "127.0.0.1:6379", 2*time.Second)
	if err != nil {
		fmt.Println("❌ Could not connect to Redis:", err)
		return
	}
	defer conn.Close()
	fmt.Println("✅ Successfully connected to Redis on TCP!")
}
