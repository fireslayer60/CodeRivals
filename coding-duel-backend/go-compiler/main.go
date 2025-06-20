package main

import (
	"log"
	"net/http"

	"encoding/json"

	"github.com/fireslayer60/coderivals-executor/executor"
	"github.com/fireslayer60/coderivals-executor/models"
)

func main() {
	http.HandleFunc("/execute", withCORS(executeHandler))
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

func executeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req models.CodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	res, err := executor.ExecuteCode(req)
	if err != nil {
		http.Error(w, "Error executing code: "+err.Error(), http.StatusInternalServerError)
		log.Println("Execution error:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}
