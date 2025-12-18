# University Course Management System

This project is a University Course Management System (CMS) built using React, Vite, and Tailwind CSS. It provides a platform for managing courses, students, and instructors, with features such as authentication and role-based access control.

## Features

- **User Authentication**: Secure login for students, instructors, and admin users.
- **Protected Routes**: Access control for different user roles to ensure that only authorized users can access certain pages.
- **Course Management**: View and manage courses with detailed information.
- **Responsive Design**: Built with Tailwind CSS for a modern and responsive user interface.
- **Dynamic Dashboard**: An interactive dashboard that displays user-specific information and tasks.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express (not included in this repository)
- **Database**: Supabase (not included in this repository)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd university-cms
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the development server:
   ```
   npm run dev
   ```

## Folder Structure

```
university-cms
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── components
│   │   ├── CourseCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── Students.jsx
│   │   ├── Instructors.jsx
│   │   ├── Login.jsx
│   │   └── CourseDetails.jsx
│   ├── context
│   │   └── AuthContext.jsx
│   ├── services
│   │   └── api.js
│   ├── utils
│   │   └── helpers.js
│   └── styles
│       └── index.css
├── public
│   └── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.