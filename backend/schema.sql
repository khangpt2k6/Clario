-- This is code by Khang Phan 
-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on priority for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);

-- Create an index on completed status for filtering
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Create an index on due_date for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for development)
-- In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow all operations for todos" ON todos
    FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO todos (title, description, priority, due_date) VALUES
    ('Complete project setup', 'Set up the development environment and install dependencies', 'high', NOW() + INTERVAL '2 days'),
    ('Review code', 'Go through the existing codebase and identify areas for improvement', 'medium', NOW() + INTERVAL '5 days'),
    ('Write documentation', 'Create comprehensive documentation for the project', 'low', NOW() + INTERVAL '1 week')
ON CONFLICT DO NOTHING;
