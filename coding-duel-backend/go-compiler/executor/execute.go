package executor

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/fireslayer60/coderivals-executor/models"
)

func ExecuteCode(req models.CodeRequest) (models.CodeResponse, error) {
	var res models.CodeResponse

	if len(req.Files) == 0 {
		return res, nil
	}

	file := req.Files[0]
	className := file.Name[:len(file.Name)-len(filepath.Ext(file.Name))]
	code := file.Content

	tempDir, err := os.MkdirTemp("", "code")
	if err != nil {
		return res, err
	}
	defer os.RemoveAll(tempDir) // clean up after execution

	javaFilePath := filepath.Join(tempDir, file.Name)
	err = os.WriteFile(javaFilePath, []byte(code), 0644)
	if err != nil {
		return res, err
	}

	compileCmd := exec.Command("javac", javaFilePath)
	var compileStderr bytes.Buffer
	compileCmd.Stderr = &compileStderr

	err = compileCmd.Run()
	if err != nil {
		return res, fmt.Errorf("compilation error: %s", compileStderr.String())
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(req.RunTimeout)*time.Millisecond)
	defer cancel()

	runCmd := exec.CommandContext(ctx, "java", "-cp", tempDir, className)

	if req.Stdin != "" {
		runCmd.Stdin = bytes.NewBufferString(req.Stdin)
	}

	var stdout, stderr bytes.Buffer
	runCmd.Stdout = &stdout
	runCmd.Stderr = &stderr

	err = runCmd.Run()
	exitCode := 0
	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else {
			return res, fmt.Errorf("execution error: %v", err)
		}
	}

	res.Run.Stdout = stdout.String()
	res.Run.Stderr = stderr.String()
	res.Run.Code = exitCode

	return res, nil
}
