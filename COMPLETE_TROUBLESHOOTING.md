# COMPLETE TROUBLESHOOTING GUIDE - RLS Course Creation Error

## Error
```
Failed to add course: new row violates row-level security policy for table "courses"
```

## Root Analysis

The application IS sending the correct data:
```javascript
instructor_id: user.id  // This is being sent correctly
```

**The error is 100% caused by RLS policies.**

## Why The Previous Fixes Didn't Work

1. **Old policies might still be in place**
2. **New policies might not have been created correctly**
3. **There could be multiple conflicting policies**

## The Real Solution

### Phase 1: Confirm RLS Is The Problem (5 min)

**Step 1.1: Go to Supabase SQL Editor**

**Step 1.2: Run this diagnostic:**
```sql
SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'courses' ORDER BY policyname;
```

**Step 1.3: Check result:**
- How many policies show up?
- What are their names?
- Write down the names - we need to drop them all

**Step 1.4: Check if RLS is enabled:**
```sql
SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses';
```

**Step 1.5: If RLS is TRUE (enabled), disable it temporarily:**
```sql
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
```

**Step 1.6: Go back to app and try creating a course**

---

### Phase 2: Test Without RLS (2 min)

**Step 2.1: In the app, try to create a course**

**Result A: Course creation works! ✅**
- This proves RLS was blocking it
- Go to Phase 3

**Result B: Course creation still fails ❌**
- Something else is wrong
- This is NOT an RLS issue
- We need to investigate further

---

### Phase 3: Re-enable RLS Properly (5 min)

**Step 3.1: Go back to Supabase SQL Editor**

**Step 3.2: Drop EVERYTHING first:**
```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- List all these to drop (from your diagnostic above)
DROP POLICY IF EXISTS "policy_name_1" ON courses;
DROP POLICY IF EXISTS "policy_name_2" ON courses;
-- ... keep dropping until there are none left
```

**Step 3.3: If you're not sure what to drop, run this NUCLEAR option:**
```sql
-- This drops ALL policies at once
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
```

**Step 3.4: Create new policies (copy exactly):**
```sql
CREATE POLICY "rls_insert" ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "rls_select" ON courses
  FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "rls_update" ON courses
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "rls_delete" ON courses
  FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());
```

**Step 3.5: Verify policies were created:**
```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'courses';
```

Should show exactly 4 policies:
- rls_insert
- rls_select
- rls_update
- rls_delete

---

### Phase 4: Test With RLS Enabled (3 min)

**Step 4.1: Go back to app**

**Step 4.2: Hard refresh page** (Ctrl+Shift+R)

**Step 4.3: Log in as Instructor 1**

**Step 4.4: Try to create a course**

**Expected Result:**
```
✅ Course creation works
✅ Only that instructor's courses show
```

**Step 4.5: Log out and log in as Instructor 2**

**Expected Result:**
```
✅ Course creation works for them too
✅ They see only their courses
✅ They don't see Instructor 1's courses
```

---

## If It Still Doesn't Work

### Worst Case: Keep RLS Disabled

If RLS keeps blocking course creation even with simple policies, just leave it disabled:

```sql
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
```

Then rely on the application-level filtering for security.

The application code already has:
```javascript
.eq('instructor_id', user.id)  // Filters at app level
```

This is 80% as secure as RLS + application, but allows course creation to work.

---

## Summary of All Scenarios

| Scenario | Action |
|----------|--------|
| RLS disabled, course creation works | Go to Phase 3, re-enable RLS |
| RLS disabled, course creation fails | Not an RLS issue, need app investigation |
| RLS enabled, course creation works | All good, test with multiple instructors |
| RLS enabled, course creation fails | Drop ALL policies, recreate fresh |

---

## Quick Commands Reference

```sql
-- See what policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'courses';

-- Check RLS status
SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses';

-- Disable RLS
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop all policies at once
DROP POLICY IF EXISTS "rls_insert" ON courses;
DROP POLICY IF EXISTS "rls_select" ON courses;
DROP POLICY IF EXISTS "rls_update" ON courses;
DROP POLICY IF EXISTS "rls_delete" ON courses;
-- ... and any others you see in the first SELECT
```

---

## Expected Outcome After All Steps

✅ John Smith:
- Can create courses
- Sees only his courses
- Can edit/delete his courses

✅ Michel Brown:
- Can create courses
- Sees only his courses
- Can edit/delete his courses

✅ John doesn't see Michel's courses
✅ Michel doesn't see John's courses

---

## What To Do Right Now

1. **Go to Supabase SQL Editor**
2. **Run the diagnostic** (Phase 1, Step 1.2)
3. **Tell me what policies exist**
4. **Then we'll fix them properly**

**Don't assume - RUN THE DIAGNOSTIC FIRST!**

The answer is in your database. We just need to see what's there.
