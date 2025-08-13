package main

import (
	"log"
	"net/http"

	"messaging-app/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	r := mux.NewRouter()

	// Auth routes
	r.HandleFunc("/api/register", handlers.Register).Methods("POST")
	r.HandleFunc("/api/login", handlers.Login).Methods("POST")

	// Protected routes
	r.HandleFunc("/api/messages", handlers.AuthMiddleware(handlers.GetMessages)).Methods("GET")
	r.HandleFunc("/api/messages", handlers.AuthMiddleware(handlers.SendMessage)).Methods("POST")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}