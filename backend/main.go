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

	// Initialize router
	r := gin.Default()

	// Add CORS middleware
	r.Use(middleware.CORS())

	// API routes
	api := r.Group("/api")
	{
		// Todo routes
		todos := api.Group("/todos")
		{
			todos.GET("/", handlers.GetTodos)
			todos.GET("/:id", handlers.GetTodo)
			todos.POST("/", handlers.CreateTodo)
			todos.PUT("/:id", handlers.UpdateTodo)
			todos.DELETE("/:id", handlers.DeleteTodo)
			todos.PATCH("/:id/toggle", handlers.ToggleTodo)
		}
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Todo API is running"})
	})

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
