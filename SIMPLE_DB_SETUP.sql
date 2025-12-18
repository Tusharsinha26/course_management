-- ============================================
-- ESSENTIAL DATABASE SETUP FOR UNIVERSITY CMS
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration TEXT,
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 3. CREATE ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 4. CREATE ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREATE SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- ============================================
-- RLS POLICIES - ALLOW USERS TO MANAGE THEIR DATA
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- COURSES POLICIES
DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
CREATE POLICY "Anyone can view courses" 
  ON public.courses FOR SELECT 
  TO authenticated 
  USING (true);

DROP POLICY IF EXISTS "Instructors can create courses" ON public.courses;
CREATE POLICY "Instructors can create courses" 
  ON public.courses FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('instructor', 'admin')
    )
  );

DROP POLICY IF EXISTS "Instructors can update their courses" ON public.courses;
CREATE POLICY "Instructors can update their courses" 
  ON public.courses FOR UPDATE 
  TO authenticated 
  USING (instructor_id = auth.uid());

DROP POLICY IF EXISTS "Instructors can delete their courses" ON public.courses;
CREATE POLICY "Instructors can delete their courses" 
  ON public.courses FOR DELETE 
  TO authenticated 
  USING (instructor_id = auth.uid());

-- ENROLLMENTS POLICIES
DROP POLICY IF EXISTS "Users can view enrollments" ON public.enrollments;
CREATE POLICY "Users can view enrollments" 
  ON public.enrollments FOR SELECT 
  TO authenticated 
  USING (true);

DROP POLICY IF EXISTS "Students can enroll in courses" ON public.enrollments;
CREATE POLICY "Students can enroll in courses" 
  ON public.enrollments FOR INSERT 
  TO authenticated 
  WITH CHECK (student_id = auth.uid());

-- ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Users can view assignments" ON public.assignments;
CREATE POLICY "Users can view assignments" 
  ON public.assignments FOR SELECT 
  TO authenticated 
  USING (true);

DROP POLICY IF EXISTS "Instructors can manage assignments" ON public.assignments;
CREATE POLICY "Instructors can manage assignments" 
  ON public.assignments FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = course_id 
      AND instructor_id = auth.uid()
    )
  );

-- SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Users can view submissions" ON public.submissions;
CREATE POLICY "Users can view submissions" 
  ON public.submissions FOR SELECT 
  TO authenticated 
  USING (true);

DROP POLICY IF EXISTS "Students can submit assignments" ON public.submissions;
CREATE POLICY "Students can submit assignments" 
  ON public.submissions FOR INSERT 
  TO authenticated 
  WITH CHECK (student_id = auth.uid());

-- ============================================
-- DONE! Your database is ready to use.
-- ============================================
