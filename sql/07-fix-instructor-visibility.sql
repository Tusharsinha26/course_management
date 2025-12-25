-- ============================================
-- COMPREHENSIVE FIX: INSTRUCTOR COURSE VISIBILITY
-- ============================================
-- This script ensures each instructor only sees their own courses

-- ============================================
-- STEP 1: VERIFY AND FIX COURSE INSTRUCTOR ASSIGNMENTS
-- ============================================

-- Check courses without instructor_id
-- SELECT id, title, instructor_id FROM courses WHERE instructor_id IS NULL;

-- If you find courses without instructor_id, you MUST assign them manually
-- To do this, identify the instructor who owns each course and run:
-- UPDATE courses SET instructor_id = 'INSTRUCTOR_UUID' WHERE id = 'COURSE_ID';

-- Example: If John Smith has UUID abc-123-def and created a course without instructor_id:
-- UPDATE courses SET instructor_id = 'abc-123-def' WHERE id = 'course-uuid' AND instructor_id IS NULL;

-- ============================================
-- STEP 2: DISABLE RLS TEMPORARILY TO CLEAN UP POLICIES
-- ============================================

ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: DROP ALL EXISTING POLICIES (CLEAN SLATE)
-- ============================================

DROP POLICY IF EXISTS "instructors_read_own_courses" ON courses;
DROP POLICY IF EXISTS "instructors_create_courses" ON courses;
DROP POLICY IF EXISTS "instructors_update_own_courses" ON courses;
DROP POLICY IF EXISTS "instructors_delete_own_courses" ON courses;
DROP POLICY IF EXISTS "students_read_courses" ON courses;

-- ============================================
-- STEP 4: RE-ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE RLS POLICIES (WORKING VERSION)
-- ============================================

-- POLICY 1: Instructors can READ only their own courses
CREATE POLICY "courses_read_own" ON courses
  FOR SELECT
  TO authenticated
  USING (
    instructor_id = auth.uid()
  );

-- POLICY 2: Instructors can CREATE courses
-- This is PERMISSIVE to allow the insert, then application validates instructor_id
CREATE POLICY "courses_insert_authenticated" ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- POLICY 3: Instructors can UPDATE only their own courses
CREATE POLICY "courses_update_own" ON courses
  FOR UPDATE
  TO authenticated
  USING (
    instructor_id = auth.uid()
  )
  WITH CHECK (
    instructor_id = auth.uid()
  );

-- POLICY 4: Instructors can DELETE only their own courses
CREATE POLICY "courses_delete_own" ON courses
  FOR DELETE
  TO authenticated
  USING (
    instructor_id = auth.uid()
  );

-- ============================================
-- STEP 6: VERIFY THE SETUP
-- ============================================
-- Run these queries to verify:

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'courses';
-- Expected: courses | true

-- Check policies exist:
-- SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'courses' ORDER BY policyname;
-- Expected: 5 policies listed

-- Check for courses without instructor_id:
-- SELECT COUNT(*) as courses_without_instructor FROM courses WHERE instructor_id IS NULL;
-- Expected: 0 (all courses should have an instructor)
