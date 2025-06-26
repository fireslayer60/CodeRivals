package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/fireslayer60/coderivals-executor/executor"
	"github.com/fireslayer60/coderivals-executor/models"
	"github.com/google/uuid"
)

var (
	jobResults = make(map[string]models.CodeResponse)
	mu         sync.RWMutex
)

func main() {
	log.Println("🚀 In-memory job server starting on :8080")

	http.HandleFunc("/execute", withCORS(executeHandler))
	http.HandleFunc("/result/", withCORS(resultHandler))

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

func executeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req models.CodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	jobID := uuid.New().String()

	go func(id string, codeReq models.CodeRequest) {
		log.Printf("▶️ Executing job %s", id)
		result, err := executor.ExecuteCode(codeReq)
		if err != nil {
			result.Run.Stderr = err.Error()
			result.Run.Code = -1
		}

		mu.Lock()
		jobResults[id] = result
		mu.Unlock()
		log.Printf("✅ Job %s completed", id)

		// TTL cleanup after 5 minutes
		time.AfterFunc(5*time.Minute, func() {
			mu.Lock()
			delete(jobResults, id)
			mu.Unlock()
			log.Printf("🗑️ Job %s removed after TTL", id)
		})
	}(jobID, req)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"jobID": jobID})
}

func resultHandler(w http.ResponseWriter, r *http.Request) {
	jobID := r.URL.Path[len("/result/"):]

	mu.RLock()
	result, ok := jobResults[jobID]
	mu.RUnlock()

	if !ok {
		http.Error(w, "Result not ready", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}
