package handlers

import (
	"net/http"
	"time"

	"backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
)

// GetTodos retrieves all todos
func GetTodos(c *gin.Context) {
	client := database.GetSupabaseClient()

	var todos []models.Todo
	_, err := client.From("todos").Select("*", "", false).ExecuteTo(&todos)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.TodoResponse{
			Success: false,
			Error:   "Failed to fetch todos: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TodoResponse{
		Success: true,
		Data:    todos,
	})
}

// GetTodo retrieves a specific todo by ID
func GetTodo(c *gin.Context) {
	id := c.Param("id")
	client := database.GetSupabaseClient()

	var todo models.Todo
	_, err := client.From("todos").Select("*", "", false).Eq("id", id).Single().ExecuteTo(&todo)
	if err != nil {
		c.JSON(http.StatusNotFound, models.TodoResponse{
			Success: false,
			Error:   "Todo not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.TodoResponse{
		Success: true,
		Data:    todo,
	})
}

// CreateTodo creates a new todo
func CreateTodo(c *gin.Context) {
	var req models.CreateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.TodoResponse{
			Success: false,
			Error:   "Invalid request data: " + err.Error(),
		})
		return
	}

	// Set default priority if not provided
	if req.Priority == "" {
		req.Priority = "medium"
	}

	todo := models.NewTodo(req)
	client := database.GetSupabaseClient()

	_, err := client.From("todos").Insert(todo, false, "", "", "").ExecuteTo(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.TodoResponse{
			Success: false,
			Error:   "Failed to create todo: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.TodoResponse{
		Success: true,
		Message: "Todo created successfully",
		Data:    todo,
	})
}

// UpdateTodo updates an existing todo
func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.TodoResponse{
			Success: false,
			Error:   "Invalid request data: " + err.Error(),
		})
		return
	}

	client := database.GetSupabaseClient()

	// Build update data
	updateData := make(map[string]interface{})
	if req.Title != nil {
		updateData["title"] = *req.Title
	}
	if req.Description != nil {
		updateData["description"] = *req.Description
	}
	if req.Priority != nil {
		updateData["priority"] = *req.Priority
	}
	if req.DueDate != nil {
		updateData["due_date"] = *req.DueDate
	}
	updateData["updated_at"] = time.Now()

	_, err := client.From("todos").Update(updateData, "", "").Eq("id", id).ExecuteTo(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.TodoResponse{
			Success: false,
			Error:   "Failed to update todo: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TodoResponse{
		Success: true,
		Message: "Todo updated successfully",
	})
}

// DeleteTodo deletes a todo
func DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	client := database.GetSupabaseClient()

	_, err := client.From("todos").Delete("", "").Eq("id", id).ExecuteTo(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.TodoResponse{
			Success: false,
			Error:   "Failed to delete todo: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TodoResponse{
		Success: true,
		Message: "Todo deleted successfully",
	})
}

// ToggleTodo toggles the completed status of a todo
func ToggleTodo(c *gin.Context) {
	id := c.Param("id")
	client := database.GetSupabaseClient()

	// First get the current todo to toggle the status
	var todo models.Todo
	_, err := client.From("todos").Select("*", "", false).Eq("id", id).Single().ExecuteTo(&todo)
	if err != nil {
		c.JSON(http.StatusNotFound, models.TodoResponse{
			Success: false,
			Error:   "Todo not found",
		})
		return
	}

	// Toggle the completed status
	todo.Completed = !todo.Completed
	todo.UpdatedAt = time.Now()

	_, err = client.From("todos").Update(map[string]interface{}{
		"completed":  todo.Completed,
		"updated_at": todo.UpdatedAt,
	}, "", "").Eq("id", id).ExecuteTo(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.TodoResponse{
			Success: false,
			Error:   "Failed to toggle todo: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.TodoResponse{
		Success: true,
		Message: "Todo status toggled successfully",
		Data:    todo,
	})
}
