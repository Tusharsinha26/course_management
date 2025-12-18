# 🚀 Quick Start Guide - Test All Features

## ⚠️ CRITICAL FIRST STEP

**YOU MUST RUN THE SQL SCRIPT FIRST!**

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open: `/home/anish/Desktop/ucm2/ADVANCED_FEATURES.sql`
4. Copy ALL content
5. Paste in SQL Editor
6. Click **"Run"**

Without this, NOTHING will work!

---

## 🎓 Instructor Testing Guide

### 1. Login as Instructor
- Use your instructor account

### 2. Create a Course (if not done)
- Click "**+ New Course**" button
- Fill in: Title, Description, Duration
- Click **"Create Course"**

### 3. Test Attendance Tracker
- Find your course card
- Click **Green "Attendance" button** (📅 icon)
- You'll see all enrolled students
- Click buttons to mark:
  - **Present** (Green)
  - **Late** (Yellow)
  - **Absent** (Red)

### 4. Test Announcements
- Click **Orange "Announcements" button** (📢 icon)
- Fill in:
  - Title: "Welcome to the course!"
  - Message: "First day of class is tomorrow"
  - Priority: Select **Urgent** / High / Medium / Low
- Click **"Post Announcement"**
- See it appear below with color coding

### 5. Test Materials Upload
- Click **Cyan "Materials" button** (📥 icon)
- Fill in:
  - Title: "Lecture 1 Slides"
  - Description: "Introduction to the course"
  - Week Number: 1
- Click **"Choose File"** and select a PDF
- File will upload automatically

### 6. Create Assignment (for grading test)
- Click **Purple "Assignments" button** (✏️ icon)
- Fill in:
  - Title: "Assignment 1"
  - Description: "Complete exercises 1-5"
  - Due Date: Pick a future date
  - **Max Points: 100** (important!)
- Click **"Create Assignment"**

### 7. Wait for Student Submission
(Do student steps below first)

### 8. Grade the Submission
- Click **"View Submissions"** button
- You'll see student submission
- Click green **"Grade"** button
- Enter:
  - Points Earned: 85
  - Feedback: "Great work! Improve on question 3"
- Click **"Submit Grade"**

---

## 👨‍🎓 Student Testing Guide

### 1. Login as Student
- Use your student account

### 2. Enroll in Course (if not done)
- Go to **"Courses"** page (navbar)
- Click **"Enroll"** on a course

### 3. Check Announcements Tab
- Go to **Dashboard**
- Click **Orange "Announcements" tab** at top
- See all course announcements
- Notice color coding by priority

### 4. Check Materials Tab
- Click **Cyan "Materials" tab**
- See all uploaded materials organized by week
- Click **"Download"** to get files

### 5. Submit Assignment
- Go back to **"My Courses" tab**
- Scroll down to **"Pending Assignments"** table
- Click **"Submit"** button
- Choose a file (any PDF/DOC)
- Wait for success message

### 6. Check Grades Tab
- Click **Green "My Grades" tab**
- See your graded assignments
- View:
  - Points earned / Max points
  - Percentage score
  - Instructor feedback
  - Grading timestamp

### 7. Check Analytics Tab
- Click **Purple "Analytics" tab**
- See 4 interactive charts:
  1. **Grade Distribution** (Doughnut) - A/B/C/D/F breakdown
  2. **Average Score** - Big percentage display
  3. **Performance Over Time** (Line chart) - Track progress
  4. **Assignment Breakdown** (Bar chart) - Points comparison

---

## 🎨 Visual Button Guide

### Instructor Course Card Buttons (3x2 Grid):

```
┌─────────────────┬─────────────────┬─────────────────┐
│   📅 GREEN      │   📢 ORANGE     │   📥 CYAN       │
│  Attendance     │ Announcements   │   Materials     │
└─────────────────┴─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┬─────────────────┐
│   ✏️ PURPLE     │   👥 BLUE       │   📊 PINK       │
│  Assignments    │   Students      │  Submissions    │
└─────────────────┴─────────────────┴─────────────────┘
```

### Student Dashboard Tabs (Horizontal):

```
┌──────────┬──────────────┬───────────┬───────────┬────────────┐
│ 📚 INDIGO│ 📢 ORANGE   │ 📥 CYAN   │ 📝 GREEN │ 📊 PURPLE │
│ Courses  │Announcements│ Materials │ My Grades│ Analytics │
└──────────┴──────────────┴───────────┴───────────┴────────────┘
```

---

## ✅ Features Checklist

### Instructor Features:
- [ ] Mark attendance (Present/Late/Absent)
- [ ] Post announcement with priority
- [ ] Upload course material with week number
- [ ] Create assignment with max_points
- [ ] View submissions
- [ ] Grade submission with feedback
- [ ] See grades displayed in submissions

### Student Features:
- [ ] View announcements (color-coded)
- [ ] Download materials by week
- [ ] Submit assignment file
- [ ] View grades with feedback
- [ ] See grade distribution chart
- [ ] See average score
- [ ] See performance over time
- [ ] See assignment breakdown

---

## 🔍 What to Look For

### Attendance:
- Buttons toggle colors when clicked
- Green = Present, Yellow = Late, Red = Absent

### Announcements:
- Priority colors:
  - 🔴 Urgent = Red background
  - 🟠 High = Orange background
  - 🟡 Medium = Yellow background
  - 🔵 Low = Blue background

### Materials:
- Organized by week number
- Download buttons work
- Files accessible

### Grading:
- Grade shows as: **85/100** (points earned / max points)
- Percentage calculated: **85.0%**
- Feedback displays in blue box
- Graded timestamp shows

### Analytics (Student):
- Doughnut chart shows A/B/C/D/F distribution
- Line chart shows trend over assignments
- Bar chart compares earned vs max points
- Average displays as large percentage

---

## 🐛 Troubleshooting

**Problem:** Can't see new buttons
- **Solution:** Refresh the page (Ctrl+R)

**Problem:** Upload fails
- **Solution:** Check Supabase Storage bucket exists

**Problem:** No students in attendance
- **Solution:** Enroll students in the course first

**Problem:** No data in analytics
- **Solution:** Grade at least one assignment first

**Problem:** Modal doesn't open
- **Solution:** Check browser console for errors

---

## 📞 Quick Test Sequence

**5-Minute Full Test:**

1. ✅ Run SQL script (1 min)
2. ✅ Login as instructor (30 sec)
3. ✅ Post announcement (30 sec)
4. ✅ Upload material (30 sec)
5. ✅ Mark attendance (30 sec)
6. ✅ Login as student (30 sec)
7. ✅ Check announcements tab (15 sec)
8. ✅ Download material (15 sec)
9. ✅ Submit assignment (30 sec)
10. ✅ Login as instructor (15 sec)
11. ✅ Grade submission (1 min)
12. ✅ Login as student (15 sec)
13. ✅ Check grades tab (15 sec)
14. ✅ Check analytics tab (30 sec)

**Done! All features tested!** ✅

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Attendance buttons change colors on click
- ✅ Announcements appear with correct colors
- ✅ Materials upload and can be downloaded
- ✅ Grades show in submissions view
- ✅ Students see grades with feedback
- ✅ Analytics charts display data
- ✅ No console errors

---

**Everything is ready to test! Start with running the SQL script!** 🚀
