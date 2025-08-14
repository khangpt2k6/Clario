import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Check, X, Calendar, AlertCircle } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

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
      if (response.data.success) {
        setTodos(response.data.data);
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
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
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
      dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : ''
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
          <h1>✨ Todo List</h1>
          <p>Organize your tasks with style</p>
        </div>

        <div className="todo-content">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-row">
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

              <button type="submit" className="btn btn-primary">
                {editingTodo ? <Edit size={18} /> : <Plus size={18} />}
                {editingTodo ? 'Update' : 'Add Todo'}
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add more details..."
                rows="3"
              />
            </div>

            {editingTodo && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                <X size={18} />
                Cancel
              </button>
            )}
          </form>

          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty-state">
                <h3>No todos yet</h3>
                <p>Create your first todo to get started!</p>
              </div>
            ) : (
              todos.map((todo) => (
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
                    <div>
                      {todo.dueDate && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={16} />
                          {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                    <div>
                      Created: {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>

                  <div className="todo-actions">
                    <button
                      className={`btn ${todo.completed ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => handleToggle(todo.id)}
                    >
                      <Check size={16} />
                      {todo.completed ? 'Completed' : 'Mark Complete'}
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(todo)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <Trash2 size={16} />
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
  );
}

export default App;
