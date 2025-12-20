-- ============================================
-- FIX: Foreign Key Constraint on Exams Table
-- ============================================
-- This migration fixes the issue where deleting an instructor
-- fails due to orphaned exams with created_by references

-- Step 1: Drop the existing constraint
ALTER TABLE exams 
DROP CONSTRAINT IF EXISTS "exams_created_by_fkey";

-- Step 2: Add the constraint back with ON DELETE CASCADE
ALTER TABLE exams 
ADD CONSTRAINT exams_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 3: Similarly fix course_videos table if it has the same issue
ALTER TABLE course_videos 
DROP CONSTRAINT IF EXISTS "course_videos_uploaded_by_fkey";

ALTER TABLE course_videos 
ADD CONSTRAINT course_videos_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) 
REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 4: Fix materials table
ALTER TABLE materials 
DROP CONSTRAINT IF EXISTS "materials_uploaded_by_fkey";

ALTER TABLE materials 
ADD CONSTRAINT materials_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) 
REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 5: Fix grades table (graded_by reference)
ALTER TABLE grades 
DROP CONSTRAINT IF EXISTS "grades_graded_by_fkey";

ALTER TABLE grades 
ADD CONSTRAINT grades_graded_by_fkey 
FOREIGN KEY (graded_by) 
REFERENCES profiles(id) ON DELETE SET NULL;

-- Step 6: Fix announcements table
ALTER TABLE announcements 
DROP CONSTRAINT IF EXISTS "announcements_instructor_id_fkey";

ALTER TABLE announcements 
ADD CONSTRAINT announcements_instructor_id_fkey 
FOREIGN KEY (instructor_id) 
REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 7: Fix attendance table (marked_by reference)
ALTER TABLE attendance 
DROP CONSTRAINT IF EXISTS "attendance_marked_by_fkey";

ALTER TABLE attendance 
ADD CONSTRAINT attendance_marked_by_fkey 
FOREIGN KEY (marked_by) 
REFERENCES profiles(id) ON DELETE SET NULL;

-- Step 8: Fix courses table (instructor_id reference) - IMPORTANT
ALTER TABLE courses 
DROP CONSTRAINT IF EXISTS "courses_instructor_id_fkey";

ALTER TABLE courses 
ADD CONSTRAINT courses_instructor_id_fkey 
FOREIGN KEY (instructor_id) 
REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 9: Fix exam_results table (graded_by reference)
ALTER TABLE exam_results 
DROP CONSTRAINT IF EXISTS "exam_results_graded_by_fkey";

ALTER TABLE exam_results 
ADD CONSTRAINT exam_results_graded_by_fkey 
FOREIGN KEY (graded_by) 
REFERENCES profiles(id) ON DELETE SET NULL;

-- Step 10: Fix submissions table (student_id reference)
ALTER TABLE submissions 
DROP CONSTRAINT IF EXISTS "submissions_student_id_fkey";

ALTER TABLE submissions 
ADD CONSTRAINT submissions_student_id_fkey 
FOREIGN KEY (student_id) 
REFERENCES profiles(id) ON DELETE CASCADE;

COMMIT;
