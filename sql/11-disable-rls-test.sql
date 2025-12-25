-- ============================================
-- NUCLEAR FIX: Disable RLS Completely
-- ============================================
-- Use this ONLY for testing to confirm RLS is the problem
-- After confirming it works, we'll re-enable with proper policies

-- Step 1: Disable RLS completely
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'courses';
-- Should show: courses | false

-- Step 3: Test course creation
-- Try creating a course through the app now
-- If it works, RLS was the problem
-- If it still fails, something else is blocking

-- ============================================
-- After testing works, run the proper fix below:
-- ============================================

-- Re-enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop ALL old policies first
DROP POLICY IF EXISTS "instructor_select_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_insert_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_update_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_delete_own_courses" ON courses;
DROP POLICY IF EXISTS "students_select_all_courses" ON courses;
DROP POLICY IF EXISTS "courses_read_own" ON courses;
DROP POLICY IF EXISTS "courses_create_own" ON courses;
DROP POLICY IF EXISTS "courses_update_own" ON courses;
DROP POLICY IF EXISTS "courses_delete_own" ON courses;
DROP POLICY IF EXISTS "courses_insert_authenticated" ON courses;
DROP POLICY IF EXISTS "instructors_read_own_courses" ON courses;
DROP POLICY IF EXISTS "instructors_create_courses" ON courses;
DROP POLICY IF EXISTS "instructors_update_own_courses" ON courses;
DROP POLICY IF EXISTS "instructors_delete_own_courses" ON courses;
DROP POLICY IF EXISTS "students_read_courses" ON courses;
DROP POLICY IF EXISTS "allow_insert" ON courses;
DROP POLICY IF EXISTS "allow_select_own" ON courses;
DROP POLICY IF EXISTS "allow_update_own" ON courses;
DROP POLICY IF EXISTS "allow_delete_own" ON courses;

-- Create new simple policies with EXPLICIT names and permissions
CREATE POLICY "insert_courses" ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "select_own_courses" ON courses
  FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "update_own_courses" ON courses
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "delete_own_courses" ON courses
  FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());

-- Verify
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'courses';
