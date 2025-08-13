package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"
	"time"

	"messaging-app/models"
)

var (
	messages    = []models.Message{}
	messagesMux = sync.RWMutex{}
	nextMsgID   = 1
)

func SendMessage(w http.ResponseWriter, r *http.Request) {
	var req models.MessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Content == "" {
		http.Error(w, "Message content required", http.StatusBadRequest)
		return
	}

	userIDStr := r.Header.Get("UserID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	username := r.Header.Get("Username")

	usersMux.RLock()
	user := users[userID]
	usersMux.RUnlock()

	if user == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	messagesMux.Lock()
	message := models.Message{
		ID:             nextMsgID,
		UserID:         userID,
		Username:       username,
		ProfilePicture: user.ProfilePicture,
		Content:        req.Content,
		Timestamp:      time.Now(),
	}
	messages = append(messages, message)
	nextMsgID++
	messagesMux.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(message)
}

func GetMessages(w http.ResponseWriter, r *http.Request) {
	messagesMux.RLock()
	defer messagesMux.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}