package models

type Error struct {
	ErrorCode   int    `json:"error_code"`
	Description string `json:"description"`
}
