# Fix Course Image Upload Error

## Problem
Getting error: "Failed to upload image: new row violates row-level security policy"

## Solution

### Step 1: Run the SQL Script in Supabase

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `FIX_COURSE_IMAGES_STORAGE.sql`
5. Click **Run** (or press Ctrl+Enter)

### Step 2: Verify the Bucket Exists

1. Go to **Storage** in the Supabase Dashboard
2. You should see a bucket named `course-images`
3. If not, click **New bucket** and create it with these settings:
   - Name: `course-images`
   - Public: **Yes** (checked)
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

### Step 3: Test the Upload

1. Go to your app
2. Try to add or edit a course
3. Upload an image
4. It should now work without errors!

## What This Fixes

The SQL script:
- Creates the `course-images` storage bucket if it doesn't exist
- Sets it as public so images can be displayed
- Creates proper RLS policies that allow:
  - Anyone to READ images (public access)
  - Authenticated users (instructors) to UPLOAD images
  - Authenticated users to UPDATE images
  - Authenticated users to DELETE images

## Alternative: Disable RLS (Not Recommended)

If you still have issues, you can temporarily disable RLS for the bucket:

1. Go to **Storage** → **Policies**
2. Find `course-images` bucket
3. Add a permissive policy for all operations

However, the SQL script above is the proper solution!
