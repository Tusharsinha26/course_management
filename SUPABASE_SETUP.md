# 🗄️ Supabase Database Setup Guide

This guide will help you set up your Supabase database for the University CMS.

## 📋 Prerequisites

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project credentials from Settings → API

## 🔧 Configuration

Add these to your `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📊 Database Schema

Go to your Supabase project → SQL Editor and run these queries:

### 1. Create Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
```

### 2. Create Database Functions

```sql
-- Function to calculate student GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(student_id UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(s.grade * 4.0 / 100), 2)
  FROM submissions s
  WHERE s.student_id = student_id AND s.grade IS NOT NULL;
$$ LANGUAGE SQL STABLE;

-- Function to get course statistics
CREATE OR REPLACE FUNCTION get_course_statistics(course_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_students', COUNT(DISTINCT e.student_id),
    'total_assignments', COUNT(DISTINCT a.id),
    'avg_completion', ROUND(AVG(e.progress), 2),
    'pending_submissions', COUNT(*) FILTER (WHERE s.grade IS NULL)
  )
  FROM enrollments e
  LEFT JOIN assignments a ON a.course_id = course_id
  LEFT JOIN submissions s ON s.assignment_id = a.id
  WHERE e.course_id = course_id;
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
```

### 3. Row Level Security (RLS) Policies

```sql
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
```

### 4. Create Storage Buckets

Go to Storage → Create a new bucket:

**Bucket name:** `assignments`
**Public:** No (private files)

#### Storage Policies

```sql
-- Allow students to upload to their own folder
CREATE POLICY "Students can upload their assignments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assignments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow students to view their own files
CREATE POLICY "Students can view their own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'assignments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow instructors to view all assignment files
CREATE POLICY "Instructors can view assignment files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'assignments' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('instructor', 'admin')
  )
);
```

## 🌱 Seed Data (Optional)

```sql
-- Insert sample instructor
INSERT INTO profiles (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'instructor@university.edu', 'Dr. Robert Smith', 'instructor'),
  ('00000000-0000-0000-0000-000000000002', 'student@university.edu', 'Alex Johnson', 'student');

-- Insert sample courses
INSERT INTO courses (title, description, instructor_id, students, duration)
VALUES 
  ('Introduction to Computer Science', 'Learn the fundamentals of programming, algorithms, and data structures.', '00000000-0000-0000-0000-000000000001', 45, '12 weeks'),
  ('Web Development with React', 'Build modern, responsive web applications using React and Tailwind CSS.', '00000000-0000-0000-0000-000000000001', 58, '10 weeks');
```

## 🔐 Authentication Setup

1. Go to Authentication → Settings
2. Configure Email templates (optional)
3. Enable Email provider
4. For testing, you can disable email confirmation temporarily

## ✅ Testing Your Setup

Run this in the SQL Editor to verify:

```sql
SELECT 
  'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'Submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments;
```

## 🚀 You're Ready!

Now start your development server:
```bash
cd /home/anish/Desktop/ucm2/university-cms
npm run dev
```

Visit `http://localhost:5173` and start building! 🎉
