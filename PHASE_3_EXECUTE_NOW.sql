-- PHASE 3: RE-ENABLE RLS WITH CORRECT POLICIES
-- Copy and run this ENTIRE block in Supabase SQL Editor

-- Step 1: Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies (do this even if you think they don't exist)
DROP POLICY IF EXISTS "rls_insert" ON courses;
DROP POLICY IF EXISTS "rls_select" ON courses;
DROP POLICY IF EXISTS "rls_update" ON courses;
DROP POLICY IF EXISTS "rls_delete" ON courses;
DROP POLICY IF EXISTS "insert_courses" ON courses;
DROP POLICY IF EXISTS "select_own_courses" ON courses;
DROP POLICY IF EXISTS "update_own_courses" ON courses;
DROP POLICY IF EXISTS "delete_own_courses" ON courses;
DROP POLICY IF EXISTS "authenticated users can create courses" ON courses;
DROP POLICY IF EXISTS "users can see their own courses" ON courses;
DROP POLICY IF EXISTS "users can update their own courses" ON courses;
DROP POLICY IF EXISTS "users can delete their own courses" ON courses;

-- Step 3: Create the 4 working policies
CREATE POLICY "rls_insert" ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "rls_select" ON courses
  FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "rls_update" ON courses
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "rls_delete" ON courses
  FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());

-- Step 4: Verify the policies were created (check results below)
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'courses' ORDER BY policyname;

-- Expected result: 4 rows showing rls_delete, rls_insert, rls_select, rls_update
