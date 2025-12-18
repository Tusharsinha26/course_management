-- Additional Features: Exams, Schedule, Videos, Student Attendance View

-- 1. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  total_marks INTEGER DEFAULT 100,
  room VARCHAR(100),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Course Schedule Table (Timetable)
CREATE TABLE IF NOT EXISTS course_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Course Videos Table
CREATE TABLE IF NOT EXISTS course_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  week_number INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Exam Results Table
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(5,2),
  total_marks INTEGER,
  percentage DECIMAL(5,2),
  grade VARCHAR(2),
  remarks TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- Disable RLS on new tables
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_schedule_course ON course_schedule(course_id);
CREATE INDEX idx_schedule_day ON course_schedule(day_of_week);
CREATE INDEX idx_videos_course ON course_videos(course_id);
CREATE INDEX idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
