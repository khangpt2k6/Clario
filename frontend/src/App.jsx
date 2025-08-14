import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

// Safe date formatting function
const safeFormatDate = (dateString, formatString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Priority sorting function
const sortTodosByPriority = (todos) => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return [...todos].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/todos`);
      console.log('API Response:', response.data); // Debug log
      if (response.data.success) {
        setTodos(response.data.data);
        console.log('Todos set:', response.data.data); // Debug log
      }
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const todoData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      if (editingTodo) {
        // Update existing todo
        const response = await axios.put(`${API_BASE_URL}/todos/${editingTodo.id}`, todoData);
        if (response.data.success) {
          setSuccess('Todo updated successfully!');
          setEditingTodo(null);
          resetForm();
          fetchTodos();
        }
      } else {
        // Create new todo
        const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
        if (response.data.success) {
          setSuccess('Todo created successfully!');
          resetForm();
          fetchTodos();
        }
      }
    } catch (err) {
      setError('Failed to save todo');
      console.error('Error saving todo:', err);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.due_date ? safeFormatDate(todo.due_date, 'yyyy-MM-dd') : ''
    });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/todos/${id}`);
        if (response.data.success) {
          setSuccess('Todo deleted successfully!');
          fetchTodos();
        }
      } catch (err) {
        setError('Failed to delete todo');
        console.error('Error deleting todo:', err);
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/todos/${id}/toggle`);
      if (response.data.success) {
        fetchTodos();
      }
    } catch (err) {
      setError('Failed to toggle todo status');
      console.error('Error toggling todo:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    const timer = setTimeout(clearMessages, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h3>Loading todos...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="todo-app">
        <div className="todo-header">
          <h1>Clario</h1>
          <p>Organize your tasks efficiently</p>
        </div>

        <div className="todo-layout">
          {/* Left Sidebar - Add/Edit Panel */}
          <div className="sidebar">
            <div className="sidebar-content">
              <h3>{editingTodo ? 'Edit Task' : 'Add New Task'}</h3>
              
              <form onSubmit={handleSubmit} className="todo-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What needs to be done?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add more details..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    className="form-control"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingTodo ? 'Update Task' : 'Add Task'}
                  </button>

                  {editingTodo && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Main Area - Task List */}
          <div className="main-content">
            <div className="content-header">
              <h3>Your Tasks</h3>
              {todos.length > 0 && (
                <span className="task-count">{todos.length} task{todos.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="todo-list">
              {todos.length === 0 ? (
                <div className="empty-state">
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started!</p>
                </div>
              ) : (
                sortTodosByPriority(todos).map((todo) => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-header-row">
                      <div className="todo-title">{todo.title}</div>
                      <span className={`todo-priority priority-${todo.priority}`}>
                        {todo.priority}
                      </span>
                    </div>

                    {todo.description && (
                      <div className="todo-description">{todo.description}</div>
                    )}

                    <div className="todo-meta">
                      <div className="date-info">
                        {todo.due_date && (
                          <span>
                            Due: {safeFormatDate(todo.due_date, 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                      <div className="date-info">
                        Created: {safeFormatDate(todo.created_at, 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="todo-actions">
                      <button
                        className={`btn ${todo.completed ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => handleToggle(todo.id)}
                      >
                        {todo.completed ? 'Completed' : 'Mark Complete'}
                      </button>

                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
