# 🎓 University Course Management System

A modern, beautiful, and feature-rich University CMS built with React, Tailwind CSS, Framer Motion, and Supabase.

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, organic design with glassmorphism effects
- 🎭 **Smooth Animations** - Powered by Framer Motion
- 🔐 **Role-Based Access** - Student, Instructor, and Admin roles
- 📚 **Course Management** - View, create, and manage courses
- 📝 **Assignment Portal** - Upload and track assignments
- 📊 **Interactive Dashboard** - Dynamic stats and to-do lists
- 🎯 **Responsive Design** - Works on all devices
- ⚡ **Serverless Architecture** - 100% Supabase (no Express server needed!)

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router** for navigation

### Backend (Serverless!)
- **Supabase** - Complete backend solution:
  - PostgreSQL database
  - Authentication & Authorization
  - Row Level Security (RLS)
  - File Storage
  - Real-time subscriptions
  - Database functions for complex logic

### Fonts
- **Nunito** - Friendly headings
- **Inter** - Readable body text

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works!)

### Installation

**Dependencies are already installed! ✅**

### Setup (3 Steps):

#### 1. Configure Environment Variables

Edit `/home/anish/Desktop/ucm2/university-cms/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 2. Set Up Supabase Database

Follow the complete guide: **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

This will create:
- Database tables
- RLS policies for security
- Database functions (GPA calculation, stats)
- Storage buckets for file uploads

#### 3. Run the App

```bash
cd /home/anish/Desktop/ucm2/university-cms
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📦 Project Structure

```
ucm2/
├── university-cms/          # Frontend React app (100% of the app!)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── CourseCard.jsx    (Animated, glassmorphic)
│   │   │   ├── Navbar.jsx        (Glassmorphic, sticky)
│   │   │   ├── Sidebar.jsx       (Animated navigation)
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx      (Time-based greeting, stats)
│   │   │   ├── Login.jsx          (Beautiful auth page)
│   │   │   ├── Courses.jsx        (Grid with animations)
│   │   │   ├── CourseDetails.jsx  (Assignment portal)
│   │   │   ├── Students.jsx       (Table view)
│   │   │   └── Instructors.jsx    (Card grid)
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.jsx    (Supabase auth)
│   │   ├── services/       # API layer
│   │   │   └── api.js             (All Supabase queries)
│   │   ├── utils/          # Utilities
│   │   │   └── supabaseClient.js  (Supabase initialization)
│   │   └── styles/         # CSS
│   │       └── index.css
│   ├── package.json
│   └── .env                # Supabase credentials
│
├── SUPABASE_SETUP.md       # Complete database setup guide
└── README.md               # You are here
```

**No Express server needed!** Everything runs through Supabase's APIs with Row Level Security.

## 🎨 Design Features

### Typography
- **Nunito** (rounded sans-serif) for headings - friendly, approachable feel
- **Inter** for body text - excellent readability

### Animations (Framer Motion)
- ✨ Staggered list reveals for courses (delay: index * 0.1s)
- 🎯 Soft hover effects (scale: 1.02 + shadow-2xl)
- 📄 Page transitions (fade in/slide up)
- 📊 Smooth progress bar animations (1s duration)
- 🎪 Navbar slide down animation
- 📱 Sidebar slide in animation

### UI Elements
- **Glassmorphism** on Navbar (backdrop-blur-lg)
- **Gradient backgrounds** (from-indigo-500 to-purple-500)
- **Rounded corners** (rounded-2xl = 16px)
- **Shadow layering** for depth
- **Hover effects** on all interactive elements

## 🔑 Authentication

The app uses Supabase Auth:

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Update `.env` files in both client and server
4. Create test users in Supabase Auth dashboard

## 📝 Available Scripts

### Client (university-cms/)
- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌟 Key Components

### CourseCard
Highly animated card featuring:
- Gradient header with course icon
- Progress bar with animation
- Student count and duration
- Hover effects (scale + lift)
- Staggered entrance animation

### Dashboard
Features:
- Time-based greetings ("Good Morning/Afternoon/Evening")
- 4 stat cards with icons and gradients
- Interactive to-do list with checkboxes
- Responsive grid layout
- Smooth animations

### Login
Beautiful auth page with:
- Glassmorphic form container
- Icon-based input fields
- Loading states with spinner
- Error handling with animations
- Gradient submit button

## 🎯 Next Steps

To make this production-ready:

1. ✅ **Already completed:**
   - Frontend setup with all components
### ✅ Already Completed:
- Frontend with all components & animations
- Supabase integration (100% serverless!)
- Authentication flow
- API service layer (direct Supabase queries)

### 📋 To Start Using:

1. **Set up Supabase Database** (5 minutes)
   - Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
   - Copy/paste SQL queries to create tables & policies

2. **Add Test Data**
   - Create test users in Supabase Dashboard → Authentication
   - Or use the seed data from setup guide

3. **Start Building Features**
   - Add more courses
   - Create assignments
   - Upload files to Supabase Storage

### 🚀 Deploy to Production:

**Frontend (Vercel - Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd university-cms
vercel
```

**Configure on Vercel:**
- Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Done! No backend deployment needed ✨- `#4F46E5`
- **Secondary:** Purple (600) - `#9333EA`
- **Accent:** Pink (500) - `#EC4899`
- **Success:** Green (500) - `#10B981`
- **Warning:** Yellow (500) - `#F59E0B`
- **Danger:** Red (500) - `#EF4444`

## 📄 License

MIT

---

**Built with ❤️ using GitHub Copilot**

Ready to use! Just add your Supabase credentials to the .env files and run the dev servers! 🚀
