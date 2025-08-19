# Clario - Full-Stack To do list

**This is my practice app using Golang and Supabase. It apply CRUD operations with GET, POST, PUT, and DELETE method of REST API**

A clean, professional, and responsive todo list application built with Go backend and React frontend. Clario provides an intuitive interface for managing tasks with priority-based organization and modern design principles.
<img width="1914" height="914" alt="image" src="https://github.com/user-attachments/assets/383a9109-8cd1-4bb9-8f01-1edd1e120e79" />

## Live Demo  
Access the deployed application: [https://clario-frontend.onrender.com/](https://clario-frontend.onrender.com/)  

**Deployment Environment:** Dockerized application hosted on Render.

## Features

### Core Functionality
- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Priority System**: Organize tasks by High, Medium, and Low priority with automatic sorting
- **Due Date Tracking**: Set and track due dates for tasks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant synchronization between frontend and backend

### User Interface
- **Clean Design**: Minimalist interface with amber accent colors
- **Responsive Layout**: Left sidebar for task creation, right panel for task display
- **Priority Sorting**: High priority tasks appear first, followed by Medium and Low
- **Integrated Scrolling**: Task list scrolls independently within the interface
- **Professional Aesthetics**: Consistent typography, spacing, and color scheme

### Technical Features
- **RESTful API**: Full CRUD operations for task management
- **Database Integration**: PostgreSQL with Supabase for data persistence
- **CORS Support**: Proper cross-origin resource sharing configuration
- **Error Handling**: Comprehensive error handling and user feedback
- **Form Validation**: Input validation and user experience optimization

## Technology Stack

### Backend
- **Go (Golang)**: High-performance server-side language
- **Gin Framework**: Fast HTTP web framework
- **Supabase**: PostgreSQL database with real-time capabilities
- **GORM**: Object-relational mapping for database operations

### Frontend
-**Figma**: prototyped design
- **React 18**: Modern JavaScript library for user interfaces
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with responsive design principles
- **Axios**: HTTP client for API communication

### Database
- **PostgreSQL**: Robust relational database
- **Row Level Security**: Secure data access policies
- **Automatic Timestamps**: Created and updated timestamps for all records

## Architecture



## Getting Started

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/khangpt2k6/To_do_list-Golang-.git
   cd backend
   ```

2. **Install Go dependencies**
   ```bash
   go mod tidy
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   SUPABASE_URL =
   SUPABASE_ANON_KEY = 
   PORT = 8080
   GIN_MODE = debug
   ```

4. **Set up database**
   - Create a Supabase project
   - Execute the SQL from `schema.sql` in your Supabase SQL editor
   - Update the `.env` file with your Supabase credentials

5. **Run the backend**
   ```bash
   go run main.go
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### Tasks
- `GET /api/todos` - Retrieve all tasks
- `GET /api/todos/:id` - Retrieve a specific task
- `POST /api/todos` - Create a new task
- `PUT /api/todos/:id` - Update an existing task
- `DELETE /api/todos/:id` - Delete a task
- `PATCH /api/todos/:id/toggle` - Toggle task completion status

## Database Schema

The application uses a PostgreSQL database with the following structure:

- **todos table**: Stores task information including title, description, priority, due date, and completion status
- **Indexes**: Optimized queries for priority, completion status, and dates
- **Triggers**: Automatic timestamp updates for record modifications
- **Row Level Security**: Configurable access policies

