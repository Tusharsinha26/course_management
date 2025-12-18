-- ============================================
-- DISABLE RLS FOR SIMPLE AUTH
-- Run this in Supabase SQL Editor
-- ============================================

-- Disable RLS on all tables since we're using simple auth
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
DROP POLICY IF EXISTS "Instructors can create courses" ON public.courses;
DROP POLICY IF EXISTS "Instructors can update their courses" ON public.courses;
DROP POLICY IF EXISTS "Instructors can delete their courses" ON public.courses;

DROP POLICY IF EXISTS "Users can view enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Students can enroll in courses" ON public.enrollments;

DROP POLICY IF EXISTS "Users can view assignments" ON public.assignments;
DROP POLICY IF EXISTS "Instructors can manage assignments" ON public.assignments;

DROP POLICY IF EXISTS "Users can view submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students can submit assignments" ON public.submissions;

-- ============================================
-- DONE! RLS is disabled, signup will work now
-- ============================================
