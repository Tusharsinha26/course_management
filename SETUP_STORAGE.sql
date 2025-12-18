-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Instructors can upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own materials" ON storage.objects;

-- Allow public access to read files (since bucket is public)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials');

-- Allow authenticated users (instructors) to upload files
CREATE POLICY "Instructors can upload materials"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'materials');

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own materials"
ON storage.objects FOR UPDATE
USING (bucket_id = 'materials');

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own materials"
ON storage.objects FOR DELETE
USING (bucket_id = 'materials');

-- Create storage bucket for student assignments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assignments',
  'assignments',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing assignment policies if they exist
DROP POLICY IF EXISTS "Public Access to Assignments" ON storage.objects;
DROP POLICY IF EXISTS "Students can upload assignments" ON storage.objects;
DROP POLICY IF EXISTS "Students can update own assignments" ON storage.objects;
DROP POLICY IF EXISTS "Students can delete own assignments" ON storage.objects;

-- Allow public access to read assignment files
CREATE POLICY "Public Access to Assignments"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments');

-- Allow students to upload their assignments
CREATE POLICY "Students can upload assignments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assignments');

-- Allow students to update their own assignments
CREATE POLICY "Students can update own assignments"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assignments');

-- Allow students to delete their own assignments
CREATE POLICY "Students can delete own assignments"
ON storage.objects FOR DELETE
USING (bucket_id = 'assignments');
