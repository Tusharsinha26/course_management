-- ============================================
-- FIX FOREIGN KEY CONSTRAINTS
-- Run this in Supabase SQL Editor to fix deletion issues
-- ============================================

-- Drop the old constraint without CASCADE
ALTER TABLE public.courses 
DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

-- Add the new constraint WITH CASCADE
ALTER TABLE public.courses
ADD CONSTRAINT courses_instructor_id_fkey 
FOREIGN KEY (instructor_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Also fix other constraints to be safe
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_student_id_fkey;

ALTER TABLE public.enrollments
ADD CONSTRAINT enrollments_student_id_fkey 
FOREIGN KEY (student_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;

ALTER TABLE public.enrollments
ADD CONSTRAINT enrollments_course_id_fkey 
FOREIGN KEY (course_id) 
REFERENCES public.courses(id) 
ON DELETE CASCADE;

ALTER TABLE public.assignments 
DROP CONSTRAINT IF EXISTS assignments_course_id_fkey;

ALTER TABLE public.assignments
ADD CONSTRAINT assignments_course_id_fkey 
FOREIGN KEY (course_id) 
REFERENCES public.courses(id) 
ON DELETE CASCADE;

ALTER TABLE public.submissions 
DROP CONSTRAINT IF EXISTS submissions_assignment_id_fkey;

ALTER TABLE public.submissions
ADD CONSTRAINT submissions_assignment_id_fkey 
FOREIGN KEY (assignment_id) 
REFERENCES public.assignments(id) 
ON DELETE CASCADE;

ALTER TABLE public.submissions 
DROP CONSTRAINT IF EXISTS submissions_student_id_fkey;

ALTER TABLE public.submissions
ADD CONSTRAINT submissions_student_id_fkey 
FOREIGN KEY (student_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- ============================================
-- DONE! Now you can delete profiles without errors
-- ============================================
