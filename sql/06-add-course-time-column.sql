-- ============================================
-- ADD COURSE_TIME AND IMAGE_URL COLUMNS TO COURSES TABLE
-- ============================================

-- Add course_time column to courses table if it doesn't exist
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS course_time TEXT;

-- Add image_url column to courses table if it doesn't exist
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN courses.course_time IS 'Course schedule/timing information (e.g., Mon-Fri 9:00 AM - 5:00 PM)';
COMMENT ON COLUMN courses.image_url IS 'URL to the course thumbnail/cover image stored in Supabase Storage';
