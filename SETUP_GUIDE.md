# University CMS - Setup Instructions

## 🚀 Database Setup (IMPORTANT - Do This First!)

Before you can sign up and use the application, you need to create the database tables in Supabase.

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (the one with URL: `https://odoydvtebvwausasofva.supabase.co`)
3. Click on **SQL Editor** in the left sidebar
4. Click on **New Query** button

### Step 2: Run the Setup Script

1. Open the file `QUICK_SETUP.sql` in this project root
2. Copy **ALL** the contents
3. Paste it into the Supabase SQL Editor
4. Click **Run** button at the bottom right

You should see: "Success. No rows returned"

### Step 3: Verify Tables Were Created

1. Click on **Table Editor** in the left sidebar
2. You should now see these tables:
   - ✅ profiles
   - ✅ courses
   - ✅ enrollments
   - ✅ assignments
   - ✅ submissions

## 📝 Using the Application

### Sign Up Process

1. Go to http://localhost:5173
2. Click **Sign Up** button
3. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - **Select your role**: Student, Instructor, or Admin
4. Click **Sign Up**
5. You'll see "Signup successful!" message

### Login

1. Click **Login** or go directly to http://localhost:5173/login
2. Enter your email and password
3. Click **Sign In**
4. You'll be redirected to the Dashboard at `/dashboard`

## 🔐 User Roles

The system supports three types of users:

- **👨‍🎓 Student**: Can view courses, enroll in courses, submit assignments
- **👨‍🏫 Instructor**: Can create and manage courses, create assignments, grade submissions
- **🛡️ Admin**: Full access to all features, can manage users and system settings

## 🛠️ Troubleshooting

### "Failed to sign up" Error

**Problem**: Database tables don't exist yet
**Solution**: Run the `QUICK_SETUP.sql` script in Supabase SQL Editor (see Step 2 above)

### "Failed to login" Error

**Problem**: User profile not created in database
**Solution**: 
1. Make sure you ran the `QUICK_SETUP.sql` script
2. Try signing up again
3. Check Supabase Dashboard → Authentication → Users to see if your user exists

### Can't Access Protected Pages

**Problem**: Not logged in or session expired
**Solution**: Log in again at http://localhost:5173/login

## 📊 Adding Sample Data (Optional)

If you want to test with some sample courses:

1. First, sign up as an **Instructor** or **Admin**
2. Go to Supabase SQL Editor
3. Run this query (replace YOUR_USER_ID with your actual user ID from the profiles table):

```sql
INSERT INTO courses (title, description, instructor_id, students, duration, progress) VALUES
('Introduction to Computer Science', 'Learn the fundamentals of programming', 'YOUR_USER_ID', 45, '12 weeks', 65),
('Web Development Fundamentals', 'Master HTML, CSS, and JavaScript', 'YOUR_USER_ID', 38, '10 weeks', 45),
('Data Structures and Algorithms', 'Deep dive into efficient data organization', 'YOUR_USER_ID', 52, '14 weeks', 30);
```

To find YOUR_USER_ID:
- Go to Supabase → Table Editor → profiles
- Copy the `id` column value for your user

## 🎨 Features

- ✨ Beautiful glassmorphic design
- 🔐 Secure authentication with Supabase
- 👥 Role-based access control
- 📚 Course management
- 📝 Assignment submission system
- 📊 Dashboard with analytics
- 🎯 Real-time updates

## 🌐 URLs

- **Landing Page**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Sign Up**: http://localhost:5173/signup
- **Dashboard**: http://localhost:5173/dashboard (requires login)
- **Courses**: http://localhost:5173/courses (requires login)
- **Students**: http://localhost:5173/students (requires login)
- **Instructors**: http://localhost:5173/instructors (requires login)

## 📞 Need Help?

If you're still having issues:
1. Check the browser console for errors (F12)
2. Check the terminal where vite is running for server errors
3. Verify your Supabase credentials in `.env` file
4. Make sure the vite server is running: `cd university-cms && npx vite`

---

**Happy Learning! 🎓**
