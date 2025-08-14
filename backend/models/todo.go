package models

import (
	"time"

	"github.com/google/uuid"
)

// Todo represents a todo item
type Todo struct {
	ID          string     `json:"id" db:"id"`
	Title       string     `json:"title" db:"title" binding:"required"`
	Description string     `json:"description" db:"description"`
	Completed   bool       `json:"completed" db:"completed"`
	Priority    string     `json:"priority" db:"priority" binding:"oneof=low medium high"`
	DueDate     *time.Time `json:"due_date,omitempty" db:"due_date"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

// CreateTodoRequest represents the request body for creating a todo
type CreateTodoRequest struct {
	Title       string     `json:"title" binding:"required"`
	Description string     `json:"description"`
	Priority    string     `json:"priority" binding:"oneof=low medium high"`
	DueDate     *time.Time `json:"due_date"`
}

// UpdateTodoRequest represents the request body for updating a todo
type UpdateTodoRequest struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	Priority    *string    `json:"priority" binding:"omitempty,oneof=low medium high"`
	DueDate     *time.Time `json:"due_date"`
}

// TodoResponse represents the response for todo operations
type TodoResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// NewTodo creates a new Todo instance
func NewTodo(req CreateTodoRequest) *Todo {
	now := time.Now()
	return &Todo{
		ID:          uuid.New().String(),
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		Priority:    req.Priority,
		DueDate:     req.DueDate,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}
