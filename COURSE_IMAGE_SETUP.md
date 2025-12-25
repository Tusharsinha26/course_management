# Course Image Upload Setup

## Steps to Complete:

### 1. **Run the SQL Migration**
Go to your Supabase SQL Editor and run the migration in [sql/06-add-course-time-column.sql](sql/06-add-course-time-column.sql):

```sql
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS course_time TEXT;

ALTER TABLE courses
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### 2. **Create Storage Bucket for Course Images**
In your Supabase project:
1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name it: `course-images`
4. Select **Public** (so images can be accessed publicly)
5. Click **Create bucket**

### 3. **Set Storage Policies (Optional but Recommended)**
In the bucket settings:
- Allow authenticated users to upload files
- Make files publicly readable

### 4. **Features Now Available:**

✅ **Instructors can upload course images** when creating/editing courses  
✅ **Only instructor's own courses are displayed** in their dashboard  
✅ **Course images are stored** in Supabase Storage  
✅ **Course images display** on course cards  
✅ **Supported image formats:** JPG, PNG, GIF, WebP, etc.  
✅ **Course time scheduling** for each course  
✅ **All course details** (title, description, duration, time, image) are saved

### 5. **Course Creation Form Now Includes:**
- Course Title (required)
- Course Description
- Duration (e.g., "12 weeks")
- Course Time (e.g., "Mon-Fri 9:00 AM - 5:00 PM")
- Course Image (file upload with preview)

### 6. **Dashboard Shows:**
- Only the current instructor's courses
- Course images if uploaded
- Course time information
- Student count
- Course progress

## Troubleshooting:

**Error: "Could not find bucket 'course-images'"**
- You need to create the storage bucket in Supabase first

**Image not uploading?**
- Make sure the bucket is set to Public
- Check your Supabase Storage policies

**Only one instructor's courses showing?**
- This is correct! Each instructor only sees their own courses due to the `.eq('instructor_id', user.id)` filter
