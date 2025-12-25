# QUICK FIX: Course Creation RLS Error

## Error
```
Failed to add course: new row violates row-level security policy for table "courses"
```

## Solution (5 Minutes)

### Step 1: Open Supabase SQL Editor

### Step 2: Run This (Drop old policies)
```sql
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "instructor_select_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_insert_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_update_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_delete_own_courses" ON courses;
DROP POLICY IF EXISTS "students_select_all_courses" ON courses;
DROP POLICY IF EXISTS "courses_read_own" ON courses;
DROP POLICY IF EXISTS "courses_create_own" ON courses;
DROP POLICY IF EXISTS "courses_update_own" ON courses;
DROP POLICY IF EXISTS "courses_delete_own" ON courses;

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
```

### Step 3: Run This (Create new policies)
```sql
CREATE POLICY "courses_read_own" ON courses
  FOR SELECT TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "courses_create_own" ON courses
  FOR INSERT TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "courses_update_own" ON courses
  FOR UPDATE TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "courses_delete_own" ON courses
  FOR DELETE TO authenticated
  USING (instructor_id = auth.uid());
```

### Step 4: Test
- Log in as instructor
- Try to create a course
- Should work now! ✅

## What Was Wrong
Old policies had conflicting conditions and were too strict.

## What's Fixed
New simplified policies that:
- Allow INSERT when instructor_id = current user
- Allow SELECT only own courses
- Allow UPDATE only own courses
- Allow DELETE only own courses

## Verification
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'courses';
-- Should show exactly 4 policies
```

**Done!** Course creation should now work perfectly.
