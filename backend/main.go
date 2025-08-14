// This is code by Khang Phan
package main

import (
	"log"
	"os"

	"backend/database"
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize Supabase
	if err := database.InitSupabase(); err != nil {
		log.Fatal("Failed to initialize Supabase:", err)
	}

	// Set Gin mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router with custom configuration
	r := gin.New()

	// Add recovery and logger middleware
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// Disable automatic trailing slash redirect
	r.RedirectTrailingSlash = false
	r.RedirectFixedPath = false

	// Add CORS middleware BEFORE any routes
	r.Use(middleware.CORS())

	// Health check (before API routes)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Todo API is running"})
	})

	// API routes - make them explicit without trailing slashes
	api := r.Group("/api")
	{
		// Todo routes
		todos := api.Group("/todos")
		{
			todos.GET("", handlers.GetTodos) // No trailing slash
			todos.GET("/:id", handlers.GetTodo)
			todos.POST("", handlers.CreateTodo) // No trailing slash
			todos.PUT("/:id", handlers.UpdateTodo)
			todos.DELETE("/:id", handlers.DeleteTodo)
			todos.PATCH("/:id/toggle", handlers.ToggleTodo)
		}
	}

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("CORS enabled for origin: http://localhost:5173")
	log.Printf("Trailing slash redirects disabled")
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
