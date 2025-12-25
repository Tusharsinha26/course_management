# Instructor Visibility Fix - Checklist & Action Plan

## 🔴 PROBLEM
John Smith sees Michel Brown's courses and vice versa

## 🔧 SOLUTION - IMMEDIATE ACTIONS (Do in This Order)

### Action 1: DIAGNOSE (5 minutes)
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Open file: `sql/08-diagnose-instructor-visibility.sql`
- [ ] Copy entire content
- [ ] Paste in SQL Editor
- [ ] Click **Run**
- [ ] **SCREENSHOT results** (for reference)

### Action 2: ANALYZE RESULTS
From diagnostic output, check:
- [ ] Is RLS enabled on courses table? (Should be: TRUE)
- [ ] How many policies exist? (Should be: 5)
- [ ] Are there courses with `instructor_id IS NULL`? (Should be: 0)
- [ ] Which instructor owns which course? (Verify correctness)

### Action 3: FIX COURSES WITHOUT INSTRUCTOR_ID
If diagnostic showed courses with NULL instructor_id:
- [ ] Run this query to see them:
  ```sql
  SELECT id, title, instructor_id FROM courses WHERE instructor_id IS NULL;
  ```
- [ ] For each course, decide which instructor should own it
- [ ] Run UPDATE for each course:
  ```sql
  UPDATE courses SET instructor_id = 'INSTRUCTOR_UUID' WHERE id = 'COURSE_ID';
  ```
- [ ] Verify fix: 
  ```sql
  SELECT COUNT(*) FROM courses WHERE instructor_id IS NULL;
  -- Should show: 0
  ```

### Action 4: APPLY RLS POLICIES
- [ ] Open file: `sql/07-fix-instructor-visibility.sql`
- [ ] Copy entire content
- [ ] Paste in SQL Editor
- [ ] Click **Run**
- [ ] Wait for completion

### Action 5: VERIFY RLS IS WORKING
Run verification queries:
```sql
-- Check 1: RLS enabled?
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'courses';
-- Should show: courses | true

-- Check 2: Policies in place?
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'courses';
-- Should show: 5

-- Check 3: All courses have instructor?
SELECT COUNT(*) FROM courses WHERE instructor_id IS NULL;
-- Should show: 0
```

- [ ] All three checks pass ✅

### Action 6: TEST IN APPLICATION
#### Test with John Smith:
- [ ] Log in as John Smith
- [ ] Navigate to Instructor Dashboard → Courses section
- [ ] Should see ONLY John Smith's courses
- [ ] Should NOT see Michel Brown's courses
- [ ] Can create a new course
- [ ] New course appears in list

#### Test with Michel Brown:
- [ ] Log out
- [ ] Log in as Michel Brown
- [ ] Navigate to Instructor Dashboard → Courses section  
- [ ] Should see ONLY Michel Brown's courses
- [ ] Should NOT see John Smith's courses
- [ ] Can create a new course
- [ ] New course appears in list

- [ ] Both instructors pass all tests ✅

### Action 7: FINAL VERIFICATION
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Test one more time with each instructor
- [ ] No courses leaking between instructors ✅

## 📊 Understanding the Fix

**Three-Layer Security:**
1. **Database Level (RLS)** - Prevents database from returning other instructor's courses
2. **Application Level** - JavaScript explicitly filters by instructor_id
3. **Data Level** - All courses have valid instructor_id assigned

**How it works:**
```
John Smith logs in (UUID: abc-123)
↓
Frontend requests courses
↓
Application code: .eq('instructor_id', 'abc-123')
↓
Database RLS policy: Only return courses where instructor_id = 'abc-123'
↓
Result: ONLY John's courses shown ✅
```

## 🚨 Common Mistakes to Avoid

❌ **Don't:**
- Skip the diagnostic step - you need to see what's wrong
- Apply RLS policies if there are still NULL instructor_ids
- Test with same browser for multiple users (use incognito)

✅ **Do:**
- Run diagnostic first to understand the issue
- Fix all NULL instructor_ids before applying RLS
- Test with different browsers or incognito windows
- Keep screenshots of each step for reference

## 📝 SQL Files Ready to Use

| File | Status | Action |
|------|--------|--------|
| `sql/08-diagnose-instructor-visibility.sql` | ✅ Ready | Run FIRST to diagnose |
| `sql/07-fix-instructor-visibility.sql` | ✅ Ready | Run SECOND to apply RLS |

## ✅ Success Criteria

When fixed, you should see:
- ✅ John Smith sees only his 5 courses
- ✅ Michel Brown sees only his 3 courses  
- ✅ No course appears in both lists
- ✅ Each can create courses and only they see it
- ✅ Edit/Delete only works for own courses
- ✅ No error messages in browser console

## 🆘 Need Help?

If still having issues after following all steps:
1. Run diagnostic SQL again
2. Check browser console (F12) for JavaScript errors
3. Verify your instructor UUIDs are correct
4. Ensure RLS is actually enabled
5. Check that all policies were created

## 📞 Quick Reference

**Get instructor UUIDs:**
```sql
SELECT id, full_name FROM profiles WHERE role = 'instructor';
```

**See who owns what:**
```sql
SELECT c.title, p.full_name FROM courses c
LEFT JOIN profiles p ON c.instructor_id = p.id;
```

**Fix a specific course:**
```sql
UPDATE courses SET instructor_id = 'INSTRUCTOR_UUID' WHERE id = 'COURSE_ID';
```

---

**⏱️ Total Time to Fix: ~15-20 minutes**

Start with Action 1 (Diagnose) and work through each step!
