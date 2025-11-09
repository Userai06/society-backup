/*
  # Create Users and Tracking System

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Firebase auth uid
      - `email` (text, unique, not null) - immutable identifier
      - `name` (text) - user's display name (can be changed)
      - `role` (text) - user role (EB, EC, Core, Member)
      - `photo_url` (text) - profile photo URL
      - `created_at` (timestamptz) - account creation timestamp
      - `updated_at` (timestamptz) - last update timestamp
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_id` (text)
      - `domain` (text)
      - `priority` (text)
      - `status` (text)
      - `assigned_to_email` (text) - links to users.email
      - `assigned_to_name` (text) - denormalized for display
      - `due_date` (timestamptz)
      - `created_by_email` (text)
      - `created_by_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `attendance`
      - `id` (uuid, primary key)
      - `event_id` (text)
      - `user_email` (text) - links to users.email
      - `user_name` (text) - denormalized for display
      - `status` (text)
      - `marked_by_email` (text)
      - `marked_by_name` (text)
      - `marked_at` (timestamptz)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `time` (text)
      - `venue` (text)
      - `priority` (text)
      - `type` (text)
      - `created_by_email` (text)
      - `created_by_name` (text)
      - `created_at` (timestamptz)
    
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `priority` (text)
      - `event_date` (text)
      - `event_time` (text)
      - `venue` (text)
      - `created_by_email` (text)
      - `created_by_name` (text)
      - `created_at` (timestamptz)
    
    - `feedback`
      - `id` (uuid, primary key)
      - `event_id` (text)
      - `user_email` (text)
      - `user_name` (text)
      - `rating` (integer)
      - `comments` (text)
      - `created_at` (timestamptz)
    
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `department` (text)
      - `created_by_email` (text)
      - `created_by_name` (text)
      - `created_at` (timestamptz)
    
    - `academic_materials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `category` (text)
      - `subject` (text)
      - `semester` (text)
      - `year` (text)
      - `created_by_email` (text)
      - `created_by_name` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Users can update their own profile
    - Seniors (EB/EC/Core) can create/manage content
    - All authenticated users can read content
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('EB', 'EC', 'Core', 'Member')),
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_id text,
  domain text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status text NOT NULL CHECK (status IN ('Upcoming', 'Today', 'Completed')),
  assigned_to_email text,
  assigned_to_name text,
  due_date timestamptz NOT NULL,
  created_by_email text NOT NULL,
  created_by_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seniors can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  user_email text NOT NULL,
  user_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('Present', 'Absent')),
  marked_by_email text NOT NULL,
  marked_by_name text NOT NULL,
  marked_at timestamptz DEFAULT now()
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seniors can mark attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  time text NOT NULL,
  venue text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  type text NOT NULL CHECK (type IN ('Workshop', 'Hackathon', 'Meet', 'Event')),
  created_by_email text NOT NULL,
  created_by_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seniors can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  event_date text,
  event_time text,
  venue text,
  created_by_email text NOT NULL,
  created_by_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seniors can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can update announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  user_email text NOT NULL,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  department text NOT NULL CHECK (department IN ('Tech', 'Marketing', 'Content', 'Media')),
  created_by_email text NOT NULL,
  created_by_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seniors can create resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can delete resources"
  ON resources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

-- Academic materials table
CREATE TABLE IF NOT EXISTS academic_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  category text NOT NULL CHECK (category IN ('PYQ', 'Solution', 'Material')),
  subject text,
  semester text,
  year text,
  created_by_email text NOT NULL,
  created_by_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE academic_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read academic materials"
  ON academic_materials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seniors can create academic materials"
  ON academic_materials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

CREATE POLICY "Seniors can delete academic materials"
  ON academic_materials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('EB', 'EC', 'Core')
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_email ON tasks(assigned_to_email);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by_email ON tasks(created_by_email);
CREATE INDEX IF NOT EXISTS idx_attendance_user_email ON attendance(user_email);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_email ON feedback(user_email);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tasks table
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
