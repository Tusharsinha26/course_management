-- ============================================
-- 4. STORAGE BUCKET SETUP
-- ============================================
-- Note: Create the bucket in Supabase Dashboard first
-- Storage > New bucket > Name: "assignments" > Private

-- Then run these policies in SQL Editor:

-- Allow students to upload to their own folder
CREATE POLICY "Students can upload their assignments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assignments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow students to view their own files
CREATE POLICY "Students can view their own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'assignments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow instructors to view all assignment files
CREATE POLICY "Instructors can view assignment files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'assignments' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('instructor', 'admin')
  )
);

-- Allow users to delete their own files
CREATE POLICY "Students can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assignments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
