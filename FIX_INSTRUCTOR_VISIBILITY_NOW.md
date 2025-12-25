# URGENT FIX: Instructors Seeing Each Other's Courses

## Problem Confirmed
John Smith is seeing Michel Brown's courses and vice versa.

## Root Cause
One or more of these issues:
1. **Existing courses don't have `instructor_id` set** (MOST LIKELY!)
2. RLS policies not properly applied
3. RLS not enabled on the courses table

## Quick Diagnostic Steps

### Step 1: Run Diagnostic SQL
Go to Supabase SQL Editor and run `sql/08-diagnose-instructor-visibility.sql`

This will show you:
- ✅ Is RLS enabled? (should be TRUE)
- ✅ Are policies in place? (should show 5 policies)
- ⚠️ Any courses without instructor_id? (PROBLEM!)
- 📊 Course distribution by instructor

### Step 2: Review the Results

**If you see courses with `instructor_id = NULL`:**
```
id               | title                | instructor_id
===============================================================
abc-123          | Introduction to SQL  | NULL         ← PROBLEM!
def-456          | Python Basics        | NULL         ← PROBLEM!
```

**This is why instructors see all courses!**

### Step 3: Fix Courses Without instructor_id

You MUST assign each course to an instructor. 

**Find the instructor UUIDs:**
```sql
SELECT id, full_name, email FROM profiles WHERE role = 'instructor';
```

**Then assign courses:**
```sql
-- For John Smith's courses (replace with his actual UUID)
UPDATE courses 
SET instructor_id = 'john-smith-uuid-here'
WHERE title = 'Introduction to SQL' AND instructor_id IS NULL;

-- For Michel Brown's courses (replace with his actual UUID)  
UPDATE courses 
SET instructor_id = 'michel-brown-uuid-here'
WHERE title = 'Python Basics' AND instructor_id IS NULL;
```

## Complete Fix Process

### 1️⃣ Run Diagnostic (5 min)
```sql
-- Copy entire content of sql/08-diagnose-instructor-visibility.sql
-- Paste in Supabase SQL Editor
-- Click Run
-- Review results
```

### 2️⃣ Identify Problem Courses
From the diagnostic results, identify:
- Which courses are missing `instructor_id`
- Which instructor should own each course

### 3️⃣ Get Instructor UUIDs
```sql
SELECT id, full_name, email, role 
FROM profiles 
WHERE role = 'instructor'
ORDER BY full_name;
```

Copy down each instructor's UUID.

### 4️⃣ Fix Courses Without instructor_id
For each course without an instructor, run:
```sql
UPDATE courses 
SET instructor_id = '[INSTRUCTOR_UUID]'
WHERE id = '[COURSE_ID]' AND instructor_id IS NULL;
```

Example:
```sql
-- John Smith has UUID: 550e8400-e29b-41d4-a716-446655440000
-- Michel Brown has UUID: 6ba7b810-9dad-11d1-80b4-00c04fd430c8

UPDATE courses SET instructor_id = '550e8400-e29b-41d4-a716-446655440000' WHERE id = 'course-001' AND instructor_id IS NULL;
UPDATE courses SET instructor_id = '6ba7b810-9dad-11d1-80b4-00c04fd430c8' WHERE id = 'course-002' AND instructor_id IS NULL;
```

### 5️⃣ Apply RLS Policies
Run the complete migration from `sql/07-fix-instructor-visibility.sql`:
```sql
-- Copy entire content
-- Paste in Supabase SQL Editor  
-- Click Run
```

### 6️⃣ Verify the Fix
Run verification queries:
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'courses';
-- Should show: courses | true

-- Check policies exist
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'courses';
-- Should show: 5

-- Check all courses have instructor_id
SELECT COUNT(*) FROM courses WHERE instructor_id IS NULL;
-- Should show: 0
```

### 7️⃣ Test in Application
1. Log in as John Smith
   - Should see ONLY John Smith's courses
   - Should NOT see Michel Brown's courses
2. Log out
3. Log in as Michel Brown  
   - Should see ONLY Michel Brown's courses
   - Should NOT see John Smith's courses
4. Create a new course as either instructor
   - Should automatically be assigned to that instructor

## Why This Happens

### Scenario: Michel's course is visible to John

```
Courses Table:
┌─────────────┬──────────────────┬────────────────┐
│ id          │ title            │ instructor_id  │
├─────────────┼──────────────────┼────────────────┤
│ course-001  │ SQL Basics       │ john-uuid      │ ← John's
│ course-002  │ Python Advanced  │ michel-uuid    │ ← Michel's
│ course-003  │ Web Dev 101      │ NULL           │ ← NO OWNER!
└─────────────┴──────────────────┴────────────────┘

When John logs in:
- RLS checks: instructor_id = auth.uid() (John's UUID)
- ✅ Shows course-001 (matches John)
- ❌ Hides course-002 (doesn't match John)
- ❌ Hides course-003... BUT if instructor_id is NULL, 
       it might still be visible!
```

**Solution:** Make sure ALL courses have a valid instructor_id!

## Critical SQL Commands

**See what's wrong:**
```sql
SELECT * FROM courses WHERE instructor_id IS NULL;
```

**Fix it:**
```sql
UPDATE courses 
SET instructor_id = 'VALID_INSTRUCTOR_UUID'
WHERE instructor_id IS NULL;
```

**Verify it's fixed:**
```sql
SELECT 
    COUNT(*) as total_courses,
    COUNT(CASE WHEN instructor_id IS NULL THEN 1 END) as courses_without_instructor
FROM courses;
```

Should show: `total_courses | courses_without_instructor`
Expected: `10 | 0` (or whatever your numbers are, but second should be 0)

## If Still Having Issues

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh page** (Ctrl+Shift+R)
3. **Log out completely** and log in again
4. **Check browser console** (F12) for errors
5. **Run diagnostic SQL again** to confirm fix is applied

## Files to Run (In Order)

1. `sql/08-diagnose-instructor-visibility.sql` - See what's wrong
2. `sql/07-fix-instructor-visibility.sql` - Apply the fix
3. Test in the application

**Status:** 🔴 **NEEDS IMMEDIATE ACTION**
Your courses table likely has NULL instructor_ids that need to be fixed!
