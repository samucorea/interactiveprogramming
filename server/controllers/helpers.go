package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/samucorea/interactiveprogramming/models"
)

func respondWithError(errorCode int, err error, w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(errorCode)
	msg := &models.Error{ErrorCode: errorCode, Description: err.Error()}

	json.NewEncoder(w).Encode(msg)
}
