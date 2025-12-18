# 🔍 Debugging 500 Error

## What You're Seeing:
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

## Most Likely Cause:
**Database schema mismatch** - The `student_count` column is missing or named wrong.

## Step-by-Step Fix:

### 1. Check Which Request Failed
1. Open browser (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for red/failed requests
5. Click on the failed request
6. Check the **Response** tab
7. **Tell me the exact error message**

### 2. Run Database Fix (If Not Done Yet)

Open Supabase SQL Editor and run:

```sql
-- Add student_count column if missing
ALTER TABLE courses ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0;

-- Rename old 'students' column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'students'
  ) THEN
    ALTER TABLE courses RENAME COLUMN students TO student_count;
  END IF;
END $$;
```

### 3. Verify Database Schema

Run this to check your columns:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses';
```

**Expected columns:**
- `id` (uuid)
- `title` (text)
- `description` (text)
- `instructor_id` (uuid)
- `duration` (text)
- `student_count` (integer) ← **MUST HAVE THIS!**
- `created_at` (timestamp)

### 4. Common Scenarios:

#### Scenario A: Dashboard loads but crashes
**Error location**: Fetching courses or enrollments
**Fix**: Run the SQL above

#### Scenario B: Can't create courses
**Error**: "column student_count does not exist"
**Fix**: Run the SQL above

#### Scenario C: Can't sign up
**Error**: "relation profiles does not exist" or auth error
**Fix**: Your profiles table might be missing. Run:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### 5. Quick Test

After running SQL:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page
3. Try signing up as instructor
4. Try creating a course

## Tell Me:
1. ✅ Have you run the SQL fix yet?
2. ✅ What does the Network tab show? (screenshot or paste the error)
3. ✅ Which page are you on when the error happens?
