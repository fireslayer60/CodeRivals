package models

type CodeFile struct {
	Name    string `json:"name"`
	Content string `json:"content"`
}

type CodeRequest struct {
	Language       string     `json:"language"`
	Version        string     `json:"version"`
	Files          []CodeFile `json:"files"`
	Stdin          string     `json:"stdin"`
	Args           string     `json:"args"`
	CompileTimeout int        `json:"compile_timeout"`
	RunTimeout     int        `json:"run_timeout"`
}

type RunOutput struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
	Code   int    `json:"code"`
}

type CodeResponse struct {
	Run RunOutput `json:"run"`
}
