# 📁 SQL Setup Files

Execute these files in **order** in your Supabase SQL Editor:

## 🔢 Execution Order:

### 1️⃣ [01-create-tables.sql](01-create-tables.sql)
Creates all database tables (profiles, courses, assignments, submissions, enrollments)

### 2️⃣ [02-create-functions.sql](02-create-functions.sql)
Creates database functions (GPA calculation, course statistics, auto-update timestamps)

### 3️⃣ [03-setup-security.sql](03-setup-security.sql)
Enables Row Level Security and creates all security policies

### 4️⃣ [04-storage-policies.sql](04-storage-policies.sql)
⚠️ **First create bucket in Dashboard:** Storage → New bucket → Name: "assignments" (Private)
Then run this SQL to set up storage policies

### 5️⃣ [05-seed-data.sql](05-seed-data.sql) *(Optional)*
Adds sample data for testing. Update UUIDs after creating test users.

---

## 🚀 Quick Setup:

### Option A: Run Individual Files (Recommended)
Copy and paste each file one by one into Supabase SQL Editor

### Option B: Run Everything at Once
Use [../database-schema.sql](../database-schema.sql) - Contains all SQL in one file

---

## 🔧 How to Execute:

1. Go to https://supabase.com/dashboard/project/odoydvtebvwausasofva
2. Click **SQL Editor** (left sidebar)
3. Click **New query**
4. Copy content from file
5. Click **Run**
6. Repeat for each file

---

## ✅ Verify Setup:

Run this to check table creation:
```sql
SELECT 
  'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'Submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments;
```

---

## 🐛 Fixed Issues:

- ✅ Fixed `get_course_statistics` function parameter naming conflict
- ✅ Fixed `calculate_student_gpa` function parameter naming
