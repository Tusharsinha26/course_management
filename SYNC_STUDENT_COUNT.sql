-- ============================================
-- UPDATE: Sync student count with actual enrollments
-- ============================================
-- This script updates the student count for all courses
-- based on the actual number of enrolled students

UPDATE courses 
SET students = (
  SELECT COUNT(*) 
  FROM enrollments 
  WHERE enrollments.course_id = courses.id
)
WHERE id IN (
  SELECT DISTINCT course_id FROM enrollments
);

-- Verify the update by showing courses with their student counts
SELECT 
  c.id,
  c.title,
  c.students,
  (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as actual_count
FROM courses c
WHERE c.students > 0 OR EXISTS (SELECT 1 FROM enrollments WHERE course_id = c.id)
ORDER BY c.created_at DESC;

COMMIT;
