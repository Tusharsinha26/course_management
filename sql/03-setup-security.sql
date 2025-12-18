-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
-- Run this after creating tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- COURSES POLICIES
-- ============================================

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can update their courses"
  ON courses FOR UPDATE
  USING (
    instructor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- ASSIGNMENTS POLICIES
-- ============================================

CREATE POLICY "Students can view assignments for enrolled courses"
  ON assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE course_id = assignments.course_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = assignments.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can create assignments for their courses"
  ON assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- ============================================
-- SUBMISSIONS POLICIES
-- ============================================

CREATE POLICY "Students can view their own submissions"
  ON submissions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Instructors can view submissions for their courses"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit assignments"
  ON submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors can grade submissions"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    )
  );

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================

CREATE POLICY "Students can view their enrollments"
  ON enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());
