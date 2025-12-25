# DIRECT FIX - RLS Still Blocking Course Creation

## The Real Problem
The RLS policies we created might not have actually been applied. Let's fix this directly.

## STEP 1: Run Diagnostic (See What's Actually There)

Go to Supabase SQL Editor and run:

```sql
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'courses';
```

**Note what policies you see.** Write them down.

Then run:

```sql
SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses';
```

**Note if it shows: true (RLS enabled) or false (RLS disabled)**

---

## STEP 2: Clear Everything and Start Fresh

If RLS is enabled, run THIS to disable RLS completely:

```sql
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
```

Verify it worked:
```sql
SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses';
```
Should show: **false**

---

## STEP 3: Test Course Creation WITHOUT RLS

1. **Go back to app**
2. **Refresh browser** (Ctrl+Shift+R)
3. **Log in as instructor**
4. **Try to create a course**

### If it works now ✅
**Then RLS is definitely the problem!** Continue to STEP 4.

### If it STILL fails ❌
**Then something else is blocking.** Let me know and we'll investigate further.

---

## STEP 4: Re-enable RLS with Working Policies

Once course creation works WITHOUT RLS, run this to add working policies:

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop any old policies
DROP POLICY IF EXISTS "instructor_select_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_insert_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_update_own_courses" ON courses;
DROP POLICY IF EXISTS "instructor_delete_own_courses" ON courses;
DROP POLICY IF EXISTS "students_select_all_courses" ON courses;
DROP POLICY IF EXISTS "courses_read_own" ON courses;
DROP POLICY IF EXISTS "courses_create_own" ON courses;
DROP POLICY IF EXISTS "courses_update_own" ON courses;
DROP POLICY IF EXISTS "courses_delete_own" ON courses;
DROP POLICY IF EXISTS "courses_insert_authenticated" ON courses;
DROP POLICY IF EXISTS "instructors_read_own_courses" ON courses;
DROP POLICY IF EXISTS "instructors_create_courses" ON courses;
DROP POLICY IF EXISTS "instructors_update_own_courses" ON courses;
DROP POLICY IF EXISTS "instructors_delete_own_courses" ON courses;
DROP POLICY IF EXISTS "students_read_courses" ON courses;
DROP POLICY IF EXISTS "allow_insert" ON courses;
DROP POLICY IF EXISTS "allow_select_own" ON courses;
DROP POLICY IF EXISTS "allow_update_own" ON courses;
DROP POLICY IF EXISTS "allow_delete_own" ON courses;
DROP POLICY IF EXISTS "insert_courses" ON courses;
DROP POLICY IF EXISTS "select_own_courses" ON courses;
DROP POLICY IF EXISTS "update_own_courses" ON courses;
DROP POLICY IF EXISTS "delete_own_courses" ON courses;

-- Create 4 working policies
CREATE POLICY "insert_courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "select_own_courses" ON courses FOR SELECT TO authenticated USING (instructor_id = auth.uid());
CREATE POLICY "update_own_courses" ON courses FOR UPDATE TO authenticated USING (instructor_id = auth.uid()) WITH CHECK (instructor_id = auth.uid());
CREATE POLICY "delete_own_courses" ON courses FOR DELETE TO authenticated USING (instructor_id = auth.uid());
```

---

## STEP 5: Test Again with RLS Enabled

1. **Refresh browser** (Ctrl+Shift+R)
2. **Create a course** - should still work
3. **Verify only own courses show** - check by logging in as different instructor

---

## Quick Reference

| Goal | Command |
|------|---------|
| See all policies | `SELECT policyname FROM pg_policies WHERE tablename = 'courses';` |
| Check RLS status | `SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses';` |
| Disable RLS | `ALTER TABLE courses DISABLE ROW LEVEL SECURITY;` |
| Enable RLS | `ALTER TABLE courses ENABLE ROW LEVEL SECURITY;` |
| Drop specific policy | `DROP POLICY IF EXISTS "policy_name" ON courses;` |

---

## If Still Not Working

Please run the diagnostic and tell me:
1. What policies currently exist?
2. Is RLS enabled (true) or disabled (false)?
3. After disabling RLS, can you create a course?
4. Any error messages in browser console (F12)?

---

## Expected Timeline

1. **Diagnostic** - 1 minute
2. **Disable RLS** - 1 minute
3. **Test** - 1 minute (to see if it works)
4. **Re-enable with policies** - 2 minutes
5. **Final test** - 2 minutes

**Total: ~7 minutes**

**START WITH STEP 1 NOW!**
