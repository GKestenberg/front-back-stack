package models

import "time"

type User struct {
	ID             int    `json:"id"`
	Username       string `json:"username"`
	Password       string `json:"-"`
	ProfilePicture string `json:"profile_picture"`
}

type Message struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Username  string    `json:"username"`
	ProfilePicture string `json:"profile_picture"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	ProfilePicture string `json:"profile_picture"`
}

type MessageRequest struct {
	Content string `json:"content"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}