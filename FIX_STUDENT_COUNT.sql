-- ============================================
-- FIX COURSES TABLE - RENAME students TO student_count
-- Run this in Supabase SQL Editor
-- ============================================

-- Check if old column exists and rename it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'courses' 
        AND column_name = 'students'
    ) THEN
        ALTER TABLE public.courses 
        RENAME COLUMN students TO student_count;
    END IF;
END $$;

-- Make sure student_count column exists with default value
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0;

-- ============================================
-- DONE! student_count column is ready
-- ============================================
