# Quick Setup Reference - Instructor Visibility Fix

## The Problem ❌
Instructors saw ALL courses from all instructors instead of just their own.

## The Solution ✅
1. Database filtering via instructor_id
2. Row Level Security (RLS) policies
3. Enhanced error handling and logging

## Quick Setup (5 minutes)

### 1️⃣ Run SQL Migration 1 - Add Columns
In Supabase SQL Editor, run `sql/06-add-course-time-column.sql`:
```sql
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_time TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### 2️⃣ Run SQL Migration 2 - Enable RLS
In Supabase SQL Editor, run `sql/07-fix-instructor-visibility.sql`:
```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Copy all policies from the file and run them
```

### 3️⃣ Create Storage Bucket
Supabase Dashboard → Storage → Create bucket:
- Name: `course-images`
- Type: Public
- Click Create

### 4️⃣ Fix Old Courses (if any)
```sql
-- Check for courses without instructor
SELECT * FROM courses WHERE instructor_id IS NULL;

-- If found, update them:
UPDATE courses SET instructor_id = '[INSTRUCTOR_ID]' WHERE id = '[COURSE_ID]';
```

### 5️⃣ Test
- Log in as Instructor A → See only Instructor A's courses
- Log in as Instructor B → See only Instructor B's courses ✅
- Create a course → Automatically assigned to logged-in instructor ✅

## What Changed in Code

### Before:
```javascript
// Might return all courses if filtering wasn't applied
const { data } = await supabase.from('courses').select('*');
```

### After:
```javascript
// Only returns logged-in instructor's courses
const { data } = await supabase
  .from('courses')
  .select('*')
  .eq('instructor_id', user.id)  // ← Filter by instructor
  .order('created_at', { ascending: false });
```

## Database Security Added

### RLS Policies:
- ✅ Instructors can only READ their own courses
- ✅ Instructors can only CREATE courses for themselves  
- ✅ Instructors can only UPDATE/DELETE their own courses
- ✅ Students can READ all courses (for browsing)

This prevents unauthorized access at the database level!

## Files to Run

| File | Purpose | Status |
|------|---------|--------|
| `sql/06-add-course-time-column.sql` | Add new columns | ✅ Ready |
| `sql/07-fix-instructor-visibility.sql` | Enable RLS policies | ✅ Ready |
| `src/pages/InstructorDashboard.jsx` | Code changes | ✅ Done |

## Verification Commands

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'courses';
-- Expected output: courses | true

-- Check policies exist
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'courses';
-- Expected output: 5 (or more)

-- Check courses have instructor_id
SELECT COUNT(*) FROM courses WHERE instructor_id IS NULL;
-- Expected output: 0
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Still seeing all courses | Run RLS migration from file 07 |
| Cannot create courses | Check if user has role='instructor' |
| Image not uploading | Create public bucket named `course-images` |
| "Permission denied" error | RLS policy needs adjustment or auth.uid() not working |

## Support Files

📄 `COMPLETE_INSTRUCTOR_SETUP.md` - Full detailed guide  
📄 `INSTRUCTOR_VISIBILITY_FIX.md` - Detailed problem/solution  
📄 `COURSE_IMAGE_SETUP.md` - Image upload guide  

---

**Status: ✅ READY TO DEPLOY**

All code is written, all migrations are prepared. Just run the SQL and you're done!
