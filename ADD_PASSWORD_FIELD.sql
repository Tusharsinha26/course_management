-- ============================================
-- ADD PASSWORD FIELD TO PROFILES
-- Run this in Supabase SQL Editor
-- ============================================

-- Add password field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'password123';

-- Remove the foreign key constraint to auth.users since we're not using Supabase Auth
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Make id a regular UUID with default generation (not tied to auth.users)
ALTER TABLE public.profiles 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Make email unique
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- ============================================
-- DONE! Now you can use simple email/password auth
-- ============================================
