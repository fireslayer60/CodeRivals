package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/fireslayer60/coderivals-executor/models"
	"github.com/hibiken/asynq"
)

const TypeCodeExecution = "code:execute"

func EnqueueExecution(client *asynq.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload models.CodeRequest
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		data, err := json.Marshal(payload)
		if err != nil {
			http.Error(w, "Error serializing payload", http.StatusInternalServerError)
			return
		}

		task := asynq.NewTask(TypeCodeExecution, data)
		_, err = client.Enqueue(task)
		if err != nil {
			http.Error(w, "Failed to enqueue task", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("Code execution task enqueued."))
	}
}
