# Manual Storage Bucket Setup (Alternative Method)

If the SQL script doesn't work, follow these steps to manually configure the storage bucket in Supabase Dashboard:

## Method 1: Using Supabase Dashboard UI

### Step 1: Create the Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **New bucket**
3. Configure:
   - **Name**: `course-images`
   - **Public bucket**: ✅ **CHECKED**
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/png, image/gif, image/webp`
4. Click **Create bucket**

### Step 2: Configure Policies

1. Click on the `course-images` bucket
2. Click **Policies** tab
3. Click **New Policy**

#### Policy 1: Public Read
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `true`
- Click **Review** → **Save policy**

#### Policy 2: Authenticated Upload
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `true`
- Click **Review** → **Save policy**

#### Policy 3: Authenticated Update
- **Policy name**: `Authenticated users can update`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `true`
- Click **Review** → **Save policy**

#### Policy 4: Authenticated Delete
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: `true`
- Click **Review** → **Save policy**

### Step 3: Verify

1. Go back to **Storage** → **course-images**
2. You should see all 4 policies listed
3. The bucket should show as **Public**

---

## Method 2: Nuclear Option (Use with caution)

If you're still having issues and just need it to work NOW:

### Disable RLS Temporarily

Run this in SQL Editor:

```sql
-- DISABLE RLS FOR TESTING (NOT RECOMMENDED FOR PRODUCTION)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **WARNING**: This disables all security on the storage.objects table. Only use for testing!

### Re-enable Later

When you're ready to properly configure policies:

```sql
-- RE-ENABLE RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

Then go back and properly configure the policies using Method 1.

---

## Troubleshooting

### Check if Bucket Exists

```sql
SELECT * FROM storage.buckets WHERE id = 'course-images';
```

### Check Current Policies

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%course%';
```

### Check if User is Authenticated

In your browser console while logged in:
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

If user is `null`, you're not properly authenticated!

---

## Still Not Working?

1. **Clear browser cache** and reload
2. **Log out and log back in** to refresh authentication
3. Check browser console for detailed errors
4. Verify the image URL in the database after "successful" upload
5. Try uploading a different image format (PNG vs JPEG)
