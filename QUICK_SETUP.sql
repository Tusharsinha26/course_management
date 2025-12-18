-- ============================================
-- QUICK SETUP FOR UNIVERSITY CMS
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- Copy and paste this entire file and click "Run"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (User Information)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'instructor', 'admin')) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
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

-- ============================================
-- 3. ENROLLMENTS TABLE (Students in Courses)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ============================================
-- 4. ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  max_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id),
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  grade INTEGER,
  feedback TEXT
);

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. RLS POLICIES
-- ============================================

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses Policies
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Instructors can create courses" ON courses;
CREATE POLICY "Instructors can create courses" ON courses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('instructor', 'admin')
    )
  );

DROP POLICY IF EXISTS "Instructors can update own courses" ON courses;
CREATE POLICY "Instructors can update own courses" ON courses
  FOR UPDATE USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enrollments Policies
DROP POLICY IF EXISTS "Users can view enrollments" ON enrollments;
CREATE POLICY "Users can view enrollments" ON enrollments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can enroll in courses" ON enrollments;
CREATE POLICY "Students can enroll in courses" ON enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Assignments Policies
DROP POLICY IF EXISTS "Users can view assignments" ON assignments;
CREATE POLICY "Users can view assignments" ON assignments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Instructors can manage assignments" ON assignments;
CREATE POLICY "Instructors can manage assignments" ON assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = assignments.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Submissions Policies
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
CREATE POLICY "Users can view own submissions" ON submissions
  FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = submissions.assignment_id
      AND c.instructor_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can create submissions" ON submissions;
CREATE POLICY "Students can create submissions" ON submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- ============================================
-- 8. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample courses (only after you have users)
-- You can run this after signing up
/*
INSERT INTO courses (title, description, instructor_id, students, duration, progress) VALUES
('Introduction to Computer Science', 'Learn the fundamentals of programming and computer science', NULL, 45, '12 weeks', 65),
('Web Development Fundamentals', 'Master HTML, CSS, and JavaScript', NULL, 38, '10 weeks', 45),
('Data Structures and Algorithms', 'Deep dive into efficient data organization', NULL, 52, '14 weeks', 30);
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You can now:
-- 1. Sign up through your application
-- 2. User profiles will be automatically created
-- 3. Start using the CMS!
