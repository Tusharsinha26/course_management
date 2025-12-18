-- Add image_url and course_time columns to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_time TEXT;

-- Insert Demo Instructors
INSERT INTO profiles (email, password, full_name, role) VALUES
('john.smith@university.edu', 'instructor123', 'Dr. John Smith', 'instructor'),
('sarah.johnson@university.edu', 'instructor123', 'Prof. Sarah Johnson', 'instructor'),
('michael.brown@university.edu', 'instructor123', 'Dr. Michael Brown', 'instructor'),
('emily.davis@university.edu', 'instructor123', 'Prof. Emily Davis', 'instructor')
ON CONFLICT (email) DO NOTHING;

-- Insert Demo Admin
INSERT INTO profiles (email, password, full_name, role) VALUES
('admin@university.edu', 'admin123', 'System Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Demo Students
INSERT INTO profiles (email, password, full_name, role) VALUES
('alice.wilson@student.edu', 'student123', 'Alice Wilson', 'student'),
('bob.taylor@student.edu', 'student123', 'Bob Taylor', 'student'),
('carol.anderson@student.edu', 'student123', 'Carol Anderson', 'student'),
('david.thomas@student.edu', 'student123', 'David Thomas', 'student'),
('emma.martinez@student.edu', 'student123', 'Emma Martinez', 'student'),
('frank.garcia@student.edu', 'student123', 'Frank Garcia', 'student'),
('grace.lee@student.edu', 'student123', 'Grace Lee', 'student'),
('henry.white@student.edu', 'student123', 'Henry White', 'student')
ON CONFLICT (email) DO NOTHING;

-- Insert Demo Courses with Images
DO $$
DECLARE
    instructor1_id UUID;
    instructor2_id UUID;
    instructor3_id UUID;
    instructor4_id UUID;
BEGIN
    -- Get instructor IDs
    SELECT id INTO instructor1_id FROM profiles WHERE email = 'john.smith@university.edu';
    SELECT id INTO instructor2_id FROM profiles WHERE email = 'sarah.johnson@university.edu';
    SELECT id INTO instructor3_id FROM profiles WHERE email = 'michael.brown@university.edu';
    SELECT id INTO instructor4_id FROM profiles WHERE email = 'emily.davis@university.edu';
    
    -- Insert Courses
    INSERT INTO courses (title, description, instructor_id, duration, progress, image_url, course_time) VALUES
    ('Introduction to Computer Science', 'Learn the fundamentals of programming, algorithms, and data structures. Perfect for beginners starting their journey in computer science.', instructor1_id, '12 weeks', 0, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop', 'Mon, Wed, Fri - 9:00 AM to 11:00 AM'),
    ('Web Development Bootcamp', 'Master HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and become a full-stack developer.', instructor2_id, '16 weeks', 0, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop', 'Tue, Thu - 2:00 PM to 5:00 PM'),
    ('Data Science & Machine Learning', 'Explore data analysis, visualization, and machine learning algorithms using Python. Work with real datasets.', instructor3_id, '14 weeks', 0, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop', 'Mon, Wed - 10:00 AM to 1:00 PM'),
    ('Digital Marketing Fundamentals', 'Learn SEO, social media marketing, content strategy, and analytics to grow your online presence.', instructor4_id, '8 weeks', 0, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop', 'Weekends - 11:00 AM to 1:00 PM'),
    ('Mobile App Development', 'Build native iOS and Android apps using React Native. Learn mobile design patterns and best practices.', instructor1_id, '10 weeks', 0, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop', 'Tue, Thu - 9:00 AM to 12:00 PM'),
    ('Graphic Design Essentials', 'Master Adobe Photoshop, Illustrator, and Figma. Create stunning visuals and user interfaces.', instructor2_id, '12 weeks', 0, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop', 'Mon, Wed, Fri - 3:00 PM to 5:00 PM')
    ON CONFLICT DO NOTHING;
    
END $$;

-- Enroll students in courses (using subqueries to get IDs)
INSERT INTO enrollments (student_id, course_id, enrolled_at)
SELECT 
    s.id,
    c.id,
    NOW()
FROM profiles s
CROSS JOIN courses c
WHERE 
    (s.email = 'alice.wilson@student.edu' AND c.title IN ('Introduction to Computer Science', 'Web Development Bootcamp'))
    OR (s.email = 'bob.taylor@student.edu' AND c.title IN ('Introduction to Computer Science', 'Data Science & Machine Learning'))
    OR (s.email = 'carol.anderson@student.edu' AND c.title IN ('Web Development Bootcamp', 'Digital Marketing Fundamentals'))
    OR (s.email = 'david.thomas@student.edu' AND c.title IN ('Data Science & Machine Learning', 'Mobile App Development'))
ON CONFLICT DO NOTHING;
