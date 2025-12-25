# Instructor Course Visibility Fix

## Problem
Instructors were seeing all courses instead of just their own courses.

## Root Cause
Existing courses in the database may not have the `instructor_id` field populated, or Row Level Security (RLS) policies are not set up.

## Solution

### Step 1: Run the SQL Migration for Visibility
Run this in your Supabase SQL Editor (file: `sql/07-fix-instructor-visibility.sql`):

```sql
-- Enable Row Level Security on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses table

-- Allow instructors to read only their own courses
DROP POLICY IF EXISTS "instructors_read_own_courses" ON courses;
CREATE POLICY "instructors_read_own_courses" ON courses
  FOR SELECT
  USING (instructor_id = auth.uid());

-- Allow instructors to insert their own courses
DROP POLICY IF EXISTS "instructors_create_courses" ON courses;
CREATE POLICY "instructors_create_courses" ON courses
  FOR INSERT
  WITH CHECK (instructor_id = auth.uid());

-- Allow instructors to update their own courses
DROP POLICY IF EXISTS "instructors_update_own_courses" ON courses;
CREATE POLICY "instructors_update_own_courses" ON courses
  FOR UPDATE
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

-- Allow instructors to delete their own courses
DROP POLICY IF EXISTS "instructors_delete_own_courses" ON courses;
CREATE POLICY "instructors_delete_own_courses" ON courses
  FOR DELETE
  USING (instructor_id = auth.uid());

-- Allow students and admins to read courses they're enrolled in or all courses
DROP POLICY IF EXISTS "students_read_courses" ON courses;
CREATE POLICY "students_read_courses" ON courses
  FOR SELECT
  USING (true);
```

### Step 2: Check for Courses Without instructor_id

Run this query to check if any courses are missing the instructor_id:

```sql
SELECT id, title, instructor_id FROM courses WHERE instructor_id IS NULL;
```

### Step 3: Assign instructor_id to Orphaned Courses (If Needed)

If you have courses without an instructor_id, you need to assign them. First, identify which instructor should own each course. Then run:

```sql
UPDATE courses 
SET instructor_id = 'INSERT_INSTRUCTOR_UUID_HERE' 
WHERE instructor_id IS NULL AND title = 'Course Title Here';
```

Replace `INSERT_INSTRUCTOR_UUID_HERE` with the actual instructor's UUID from the profiles table.

### Step 4: Verify the Fix

1. **Check your Supabase Dashboard:**
   - Go to **Authentication** → **Users**
   - Copy the UUID of an instructor
   - Go to your database and check the `profiles` table
   - Verify that instructor has role = 'instructor'

2. **Test in the Application:**
   - Log in as Instructor A
   - Only courses with `instructor_id` = Instructor A's UUID should show
   - Create a new course as Instructor A
   - Verify that `instructor_id` is automatically set to Instructor A's UUID
   - Log out and log in as Instructor B
   - Only Instructor B's courses should show

## Additional Notes

### How It Works Now:

1. **Frontend Filtering:** JavaScript filters courses using `.eq('instructor_id', user.id)`
2. **Backend Security:** RLS policies prevent database queries from returning other instructors' courses
3. **Automatic Assignment:** New courses automatically get the creating instructor's UUID as `instructor_id`

### Files Modified:
- `src/pages/InstructorDashboard.jsx` - Added better logging and error handling
- `sql/06-add-course-time-column.sql` - Added `course_time` and `image_url` columns
- `sql/07-fix-instructor-visibility.sql` - New file with RLS policies

### Testing Checklist:
- [ ] Run SQL migration for RLS policies
- [ ] Check for orphaned courses (courses without instructor_id)
- [ ] Assign instructor_id to orphaned courses if any exist
- [ ] Create a new course as an instructor
- [ ] Verify course appears only for that instructor
- [ ] Log in as different instructor
- [ ] Verify first instructor's course doesn't appear
- [ ] Edit course
- [ ] Delete course
- [ ] All operations work as expected

## Troubleshooting

**Still seeing all courses?**
- Check browser console for any JavaScript errors
- Make sure RLS policies are enabled
- Verify the user UUID is being passed correctly
- Run SQL query to check if instructor_id is populated

**Cannot create courses?**
- Make sure the RLS policy allows INSERT with `instructor_id = auth.uid()`
- Check that you're logged in as a user with role = 'instructor'

**"Permission denied" error?**
- RLS policies are blocking the operation
- Verify the policy conditions match your query
- Check that auth.uid() is returning the correct UUID
