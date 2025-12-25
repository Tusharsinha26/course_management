-- ============================================
-- DIAGNOSTIC SCRIPT: CHECK INSTRUCTOR VISIBILITY SETUP
-- ============================================
-- Run this to diagnose why instructors are seeing each other's courses

-- 1. CHECK IF RLS IS ENABLED
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'courses';
-- Expected result: courses | true
-- If false, RLS is NOT enabled - policies won't work!

-- 2. LIST ALL RLS POLICIES ON COURSES
SELECT 
    policyname, 
    cmd, 
    permissive, 
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'courses' 
ORDER BY policyname;
-- Expected: Should see policies for instructors and students

-- 3. CHECK FOR COURSES WITHOUT INSTRUCTOR_ID (THIS IS THE MAIN PROBLEM!)
SELECT 
    id, 
    title, 
    instructor_id,
    created_at
FROM courses 
WHERE instructor_id IS NULL;
-- Expected: 0 rows
-- If you see rows here, THIS IS THE PROBLEM! Courses without instructor_id are visible to everyone

-- 4. LIST ALL INSTRUCTORS AND THEIR COURSES
SELECT 
    p.full_name as instructor_name,
    p.id as instructor_id,
    COUNT(c.id) as course_count,
    STRING_AGG(c.title, ', ') as courses
FROM profiles p
LEFT JOIN courses c ON p.id = c.instructor_id
WHERE p.role = 'instructor'
GROUP BY p.id, p.full_name
ORDER BY p.full_name;
-- This shows which courses are assigned to which instructor

-- 5. CHECK COURSE DISTRIBUTION
SELECT 
    instructor_id,
    COUNT(*) as course_count,
    CASE 
        WHEN instructor_id IS NULL THEN 'NO INSTRUCTOR (PROBLEM!)'
        ELSE 'HAS INSTRUCTOR'
    END as status
FROM courses
GROUP BY instructor_id
ORDER BY course_count DESC;
-- If you see a row with instructor_id=NULL with high count, that's the problem!

-- 6. DETAILED COURSE VIEW WITH INSTRUCTOR INFO
SELECT 
    c.id,
    c.title,
    c.instructor_id,
    p.full_name as instructor_name,
    c.created_at
FROM courses c
LEFT JOIN profiles p ON c.instructor_id = p.id
ORDER BY c.created_at DESC;
-- Shows all courses and who they're assigned to

-- ============================================
-- IF YOU FIND COURSES WITHOUT INSTRUCTOR_ID:
-- ============================================
-- You need to assign them manually!
-- First, figure out which instructor should own each course
-- Then run:

-- UPDATE courses 
-- SET instructor_id = 'INSTRUCTOR_UUID_HERE'
-- WHERE id = 'COURSE_ID_TO_FIX'
-- AND instructor_id IS NULL;

-- Example for John Smith (if his UUID is 123e4567-e89b-12d3-a456-426614174000):
-- UPDATE courses 
-- SET instructor_id = '123e4567-e89b-12d3-a456-426614174000'
-- WHERE title LIKE '%John%' AND instructor_id IS NULL;

-- ============================================
-- IF RLS IS NOT ENABLED:
-- ============================================
-- Run this to enable it:
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- Then run 07-fix-instructor-visibility.sql
