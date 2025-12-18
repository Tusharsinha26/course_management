-- ============================================
-- 5. SEED DATA (Optional - For Testing)
-- ============================================
-- Run this AFTER creating users in Authentication tab

-- STEP 1: Create test users in Supabase Dashboard
-- Go to Authentication > Users > Add user
-- Create at least one instructor and one student

-- STEP 2: Get the user IDs from the auth.users table
-- Replace 'YOUR_INSTRUCTOR_UUID' and 'YOUR_STUDENT_UUID' below

-- Example: Get user IDs
-- SELECT id, email FROM auth.users;

-- Insert profiles for auth users
INSERT INTO profiles (id, email, full_name, role)
VALUES 
  ('YOUR_INSTRUCTOR_UUID', 'instructor@university.edu', 'Dr. Robert Smith', 'instructor'),
  ('YOUR_STUDENT_UUID', 'student@university.edu', 'Alex Johnson', 'student');

-- Insert sample courses
INSERT INTO courses (title, description, instructor_id, students, duration, progress)
VALUES 
  ('Introduction to Computer Science', 'Learn the fundamentals of programming, algorithms, and data structures.', 'YOUR_INSTRUCTOR_UUID', 45, '12 weeks', 75),
  ('Web Development with React', 'Build modern, responsive web applications using React and Tailwind CSS.', 'YOUR_INSTRUCTOR_UUID', 58, '10 weeks', 30),
  ('Advanced Mathematics', 'Deep dive into calculus, linear algebra, and discrete mathematics.', 'YOUR_INSTRUCTOR_UUID', 32, '14 weeks', 50),
  ('Database Design', 'Master SQL, NoSQL databases, and learn to design scalable database systems.', 'YOUR_INSTRUCTOR_UUID', 28, '8 weeks', 85),
  ('Mobile App Development', 'Create native mobile applications for iOS and Android platforms.', 'YOUR_INSTRUCTOR_UUID', 41, '16 weeks', 20),
  ('Machine Learning Basics', 'Introduction to ML algorithms, neural networks, and AI fundamentals.', 'YOUR_INSTRUCTOR_UUID', 36, '12 weeks', 60);

-- Enroll the student in some courses
INSERT INTO enrollments (student_id, course_id, progress)
SELECT 
  'YOUR_STUDENT_UUID',
  id,
  FLOOR(RANDOM() * 100)::INTEGER
FROM courses
LIMIT 3;
