package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/fireslayer60/coderivals-executor/models"
	"github.com/google/uuid"
	"github.com/hibiken/asynq"
)

var redisClient *asynq.Client

func main() {
	log.Println(">>> Starting main()")

	log.Println(">>> Initializing Asynq client...")
	redisClient = asynq.NewClient(asynq.RedisClientOpt{
		Addr: "127.0.0.1:6379", // or your Redis instance
	})
	log.Println(">>> Asynq client created ✅")

	log.Println(">>> Setting up HTTP handlers")
	http.HandleFunc("/execute", withCORS(executeHandler))
	http.HandleFunc("/result/", withCORS(resultHandler))

	log.Println(">>> Server starting on 0.0.0.0:8080 🚀")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil)) // NOTE: changed from ":8080"
}

// Handle code execution requests
func executeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req models.CodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		log.Println("Invalid JSON:", err)
		return
	}

	jobID := uuid.New().String()
	payload, err := json.Marshal(req)
	if err != nil {
		http.Error(w, "Failed to encode task payload", http.StatusInternalServerError)
		log.Println("Payload encoding error:", err)
		return
	}

	task := asynq.NewTask("execute_code", payload, asynq.TaskID(jobID))

	if _, err := redisClient.Enqueue(task); err != nil {
		http.Error(w, "Failed to enqueue task: "+err.Error(), http.StatusInternalServerError)
		log.Println("Queue error:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"jobID": jobID})
}

// Handle polling for result
func resultHandler(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Path[len("/result/"):]
	if jobID == "" {
		http.Error(w, "Missing job ID", http.StatusBadRequest)
		return
	}

	// Connect to Redis (raw)
	redis := models.GetRedisClient() // You'll define this in `models/redis.go`
	key := "result:" + jobID

	val, err := redis.Get(r.Context(), key).Result()
	if err != nil {
		http.Error(w, "Result not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(val))
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}
