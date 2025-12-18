-- ============================================
-- University CMS - Complete Database Schema
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLES
-- ============================================

-- Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'instructor', 'admin')) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id),
  students INTEGER DEFAULT 0,
  duration TEXT DEFAULT '12 weeks',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  max_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id),
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  grade INTEGER,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE
);

-- Enrollments table (many-to-many relationship)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(student_id, course_id)
);

-- ============================================
-- 2. DATABASE FUNCTIONS
-- ============================================

-- Function to calculate student GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(student_id UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(s.grade * 4.0 / 100), 2)
  FROM submissions s
  WHERE s.student_id = student_id AND s.grade IS NOT NULL;
$$ LANGUAGE SQL STABLE;

-- Function to get course statistics
CREATE OR REPLACE FUNCTION get_course_statistics(p_course_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_students', COUNT(DISTINCT e.student_id),
    'total_assignments', COUNT(DISTINCT a.id),
    'avg_completion', ROUND(AVG(e.progress), 2),
    'pending_submissions', COUNT(*) FILTER (WHERE s.grade IS NULL)
  )
  FROM enrollments e
  LEFT JOIN assignments a ON a.course_id = p_course_id
  LEFT JOIN submissions s ON s.assignment_id = a.id
  WHERE e.course_id = p_course_id;
$$ LANGUAGE SQL STABLE;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can update their courses"
  ON courses FOR UPDATE
  USING (
    instructor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Assignments policies
CREATE POLICY "Students can view assignments for enrolled courses"
  ON assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE course_id = assignments.course_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = assignments.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can create assignments for their courses"
  ON assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- Submissions policies
CREATE POLICY "Students can view their own submissions"
  ON submissions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Instructors can view submissions for their courses"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit assignments"
  ON submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors can grade submissions"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

-- Enrollments policies
CREATE POLICY "Students can view their enrollments"
  ON enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- ============================================
-- 4. SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample profiles (Note: You'll need to create auth users first)
-- Then insert corresponding profiles with matching UUIDs

-- Example seed data (uncomment after creating auth users):
/*
INSERT INTO courses (title, description, instructor_id, students, duration, progress)
VALUES 
  ('Introduction to Computer Science', 'Learn the fundamentals of programming, algorithms, and data structures.', 'YOUR_INSTRUCTOR_UUID', 45, '12 weeks', 75),
  ('Web Development with React', 'Build modern, responsive web applications using React and Tailwind CSS.', 'YOUR_INSTRUCTOR_UUID', 58, '10 weeks', 30),
  ('Advanced Mathematics', 'Deep dive into calculus, linear algebra, and discrete mathematics.', 'YOUR_INSTRUCTOR_UUID', 32, '14 weeks', 50),
  ('Database Design', 'Master SQL, NoSQL databases, and learn to design scalable database systems.', 'YOUR_INSTRUCTOR_UUID', 28, '8 weeks', 85),
  ('Mobile App Development', 'Create native mobile applications for iOS and Android platforms.', 'YOUR_INSTRUCTOR_UUID', 41, '16 weeks', 20),
  ('Machine Learning Basics', 'Introduction to ML algorithms, neural networks, and AI fundamentals.', 'YOUR_INSTRUCTOR_UUID', 36, '12 weeks', 60);
*/

-- ============================================
-- Setup complete! 🎉
-- ============================================
-- Next steps:
-- 1. Create users in Authentication tab
-- 2. Create Storage bucket named "assignments"
-- 3. Configure storage policies (see SUPABASE_SETUP.md)
