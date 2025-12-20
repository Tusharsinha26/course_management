-- ============================================
-- TRIGGER: Auto-update student count when enrollment changes
-- ============================================

-- Function to update course student count
CREATE OR REPLACE FUNCTION update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET students = (SELECT COUNT(*) FROM enrollments WHERE course_id = NEW.course_id)
    WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET students = (SELECT COUNT(*) FROM enrollments WHERE course_id = OLD.course_id)
    WHERE id = OLD.course_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
DROP TRIGGER IF EXISTS update_student_count_on_enroll ON enrollments;
CREATE TRIGGER update_student_count_on_enroll
AFTER INSERT ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_course_student_count();

-- Create trigger for DELETE
DROP TRIGGER IF EXISTS update_student_count_on_unenroll ON enrollments;
CREATE TRIGGER update_student_count_on_unenroll
AFTER DELETE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_course_student_count();

-- Update existing courses with correct student count
UPDATE courses 
SET students = (SELECT COUNT(*) FROM enrollments WHERE enrollments.course_id = courses.id);

COMMIT;
