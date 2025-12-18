-- ============================================
-- 2. CREATE FUNCTIONS & TRIGGERS
-- ============================================
-- Run this after creating tables

-- Function to calculate student GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(p_student_id UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(s.grade * 4.0 / 100), 2)
  FROM submissions s
  WHERE s.student_id = p_student_id AND s.grade IS NOT NULL;
$$ LANGUAGE SQL STABLE;

-- Function to get course statistics
CREATE OR REPLACE FUNCTION get_course_statistics(p_course_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_students', COUNT(DISTINCT e.student_id),
    'total_assignments', COUNT(DISTINCT a.id),
    'avg_completion', ROUND(AVG(e.progress), 2),
    'pending_submissions', COUNT(*) FILTER (WHERE s.grade IS NULL)
  )
  FROM enrollments e
  LEFT JOIN assignments a ON a.course_id = p_course_id
  LEFT JOIN submissions s ON s.assignment_id = a.id
  WHERE e.course_id = p_course_id;
$$ LANGUAGE SQL STABLE;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
