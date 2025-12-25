-- ISSUE IDENTIFIED: RLS policy checks auth.uid() but app uses profile.id

-- These are DIFFERENT values:
-- auth.uid() = UUID from Supabase Auth table
-- user.id = UUID from profiles table (might be different structure)

-- SOLUTION: Change RLS policy to match the actual data structure

-- First, check what the instructor_id values look like in courses table
SELECT instructor_id, COUNT(*) FROM courses GROUP BY instructor_id;

-- Check what user IDs look like in profiles table
SELECT id, email FROM profiles LIMIT 5;

-- Check if instructor_id matches profile.id or if they're different
SELECT c.id, c.title, c.instructor_id, p.id, p.email 
FROM courses c
LEFT JOIN profiles p ON c.instructor_id = p.id
LIMIT 10;

-- The problem: If instructor_id in courses is NOT the same format/structure as profile.id,
-- then the RLS policy USING (instructor_id = auth.uid()) won't work!

-- SOLUTION: Update RLS policy to use the correct field
-- If instructor_id is storing profile.id (not auth.uid), we need to check it differently

-- Option 1: Store instructor_id as email instead (if email is unique)
-- Option 2: Store instructor_id as the actual auth.uid() when creating courses
-- Option 3: Change RLS policy to check against a different field

-- For now, let's verify the data structure:
SELECT 
  c.instructor_id,
  c.title,
  p.id,
  p.email,
  (c.instructor_id = p.id::text) AS ids_match
FROM courses c
LEFT JOIN profiles p ON c.instructor_id::text = p.id::text
LIMIT 5;
