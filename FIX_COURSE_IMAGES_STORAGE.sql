-- STEP 1: Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

-- STEP 2: Drop ALL existing policies on storage.objects for this bucket
DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname LIKE '%course%image%'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- STEP 3: Create SIMPLE and PERMISSIVE policies
-- Allow EVERYONE to view images (public bucket)
CREATE POLICY "Anyone can view course images"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-images');

-- Allow ALL authenticated users to upload (no restrictions)
CREATE POLICY "Allow authenticated uploads to course images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-images');

-- Allow ALL authenticated users to update
CREATE POLICY "Allow authenticated updates to course images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-images');

-- Allow ALL authenticated users to delete
CREATE POLICY "Allow authenticated deletes from course images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-images');
