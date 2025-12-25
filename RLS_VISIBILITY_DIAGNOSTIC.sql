-- RLS DIAGNOSTIC: Check if policies are actually filtering

-- Step 1: List all SELECT policies on courses
SELECT policyname, cmd, qual, with_check FROM pg_policies 
WHERE tablename = 'courses' AND cmd = 'SELECT';

-- Step 2: Check if RLS is enabled
SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses';

-- Step 3: Manual test - Run this as authenticated user (with their actual UUID)
-- This simulates what the app does - shows what the RLS policy allows
SELECT id, title, instructor_id FROM courses 
WHERE instructor_id = auth.uid()
LIMIT 5;

-- Step 4: See ALL courses (this is what's probably happening - no filtering)
SELECT id, title, instructor_id FROM courses LIMIT 10;

-- Step 5: Check if there's an admin bypass or service role bypass
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'courses';
