package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"

	"messaging-app/models"
	"messaging-app/utils"

	"golang.org/x/crypto/bcrypt"
)

var (
	users    = make(map[int]*models.User)
	usersMux = sync.RWMutex{}
	nextID   = 1
)

func Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Username == "" || req.Password == "" {
		http.Error(w, "Username and password required", http.StatusBadRequest)
		return
	}

	usersMux.Lock()
	defer usersMux.Unlock()

	for _, user := range users {
		if user.Username == req.Username {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	user := &models.User{
		ID:             nextID,
		Username:       req.Username,
		Password:       string(hashedPassword),
		ProfilePicture: req.ProfilePicture,
	}

	users[nextID] = user
	nextID++

	token, err := utils.GenerateJWT(user.ID, user.Username)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  *user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	usersMux.RLock()
	defer usersMux.RUnlock()

	var foundUser *models.User
	for _, user := range users {
		if user.Username == req.Username {
			foundUser = user
			break
		}
	}

	if foundUser == nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(req.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateJWT(foundUser.ID, foundUser.Username)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  *foundUser,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenString := authHeader[7:] // Remove "Bearer " prefix
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		r.Header.Set("UserID", strconv.Itoa(claims.UserID))
		r.Header.Set("Username", claims.Username)
		next(w, r)
	}
}