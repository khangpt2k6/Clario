import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Simple date formatting function
const formatDate = (dateString, formatType) => {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    if (formatType === 'yyyy-MM-dd') {
      return date.toISOString().split('T')[0];
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Safe date formatting function
const safeFormatDate = (dateString, formatString) => {
  return formatDate(dateString, formatString);
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 animate-pulse">Loading todos...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white px-8 py-6 text-center shadow-lg">
            <h1 className="text-3xl font-bold mb-1 text-shadow">Clario</h1>
            <p className="text-teal-100 text-base font-medium">Organize your tasks efficiently</p>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
            {/* Left Sidebar - Add/Edit Panel */}
            <div className="w-full lg:w-80 xl:w-96 bg-gray-50/50 border-r border-teal-100 p-6">
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {editingTodo ? 'Edit Task' : 'Add New Task'}
                </h3>
                
                <div className="flex flex-col flex-1">
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="w-full px-4 py-3 border-2 border-teal-100 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all duration-200 bg-white hover:border-teal-200"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="What needs to be done?"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="w-full px-4 py-3 border-2 border-teal-100 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all duration-200 bg-white hover:border-teal-200 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add more details..."
                      rows="4"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="w-full px-4 py-3 border-2 border-teal-100 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all duration-200 bg-white hover:border-teal-200"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="w-full px-4 py-3 border-2 border-teal-100 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all duration-200 bg-white hover:border-teal-200"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (formData.title.trim()) {
                          handleSubmit(e);
                        }
                      }}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      {editingTodo ? 'Update Task' : 'Add Task'}
                    </button>

                    {editingTodo && (
                      <button 
                        type="button" 
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Area - Task List */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-teal-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Your Tasks</h3>
                {todos.length > 0 && (
                  <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                    {todos.length} task{todos.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-pulse">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 animate-pulse">
                  {success}
                </div>
              )}

              <div className="flex-1 overflow-y-auto pr-2">
                {todos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks yet</h3>
                    <p className="text-gray-600">Create your first task to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortTodosByPriority(todos).map((todo) => (
                      <div 
                        key={todo.id} 
                        className={`bg-white border-2 rounded-xl p-6 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                          todo.completed 
                            ? 'border-green-200 bg-green-50/50' 
                            : 'border-teal-100 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className={`text-lg font-semibold ${
                            todo.completed ? 'text-gray-600 line-through' : 'text-gray-800'
                          }`}>
                            {todo.title}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            todo.priority === 'high' 
                              ? 'bg-red-500 text-white' 
                              : todo.priority === 'medium'
                              ? 'bg-yellow-400 text-gray-900'
                              : 'bg-teal-500 text-white'
                          }`}>
                            {todo.priority}
                          </span>
                        </div>

                        {todo.description && (
                          <p className="text-gray-600 mb-4 leading-relaxed">{todo.description}</p>
                        )}

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-t border-b border-gray-100 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2 mb-2 sm:mb-0">
                            {todo.due_date && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">Due:</span>
                                {safeFormatDate(todo.due_date, 'MMM dd, yyyy')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Created:</span>
                            {safeFormatDate(todo.created_at, 'MMM dd, yyyy')}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              todo.completed 
                                ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400' 
                                : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'
                            }`}
                            onClick={() => handleToggle(todo.id)}
                          >
                            {todo.completed ? 'Completed' : 'Mark Complete'}
                          </button>

                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                            onClick={() => handleEdit(todo)}
                          >
                            Edit
                          </button>

                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            onClick={() => handleDelete(todo.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;