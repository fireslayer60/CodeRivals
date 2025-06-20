package workers

import (
	"context"
	"encoding/json"
	"log"

	"github.com/fireslayer60/coderivals-executor/executor"
	"github.com/fireslayer60/coderivals-executor/models"
	"github.com/hibiken/asynq"
)

func NewHandler() asynq.HandlerFunc {
	return func(ctx context.Context, t *asynq.Task) error {
		var req models.CodeRequest
		if err := json.Unmarshal(t.Payload(), &req); err != nil {
			return err
		}

		result, err := executor.ExecuteCode(req)
		if err != nil {
			log.Println("Execution error:", err)
			return err
		}

		log.Println("Execution result:", result.Run.Stdout)
		return nil
	}
}
