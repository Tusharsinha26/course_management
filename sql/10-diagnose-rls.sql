-- ============================================
-- DIAGNOSTIC: Check Current RLS Status
-- ============================================

-- See what policies currently exist
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'courses'
ORDER BY policyname;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'courses';

-- Check for any constraints or triggers that might be blocking
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'courses';

SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'courses';
