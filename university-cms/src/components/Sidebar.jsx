import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Users, GraduationCap, Calendar, Clock, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { profile } = useAuth();
  
  // Base menu items for all users
  const baseMenuItems = [
    { icon: LayoutDashboard, label: 'Profile', path: '/dashboard' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
  ];

  // Additional items for students
  const studentMenuItems = [
    { icon: Calendar, label: 'My Attendance', path: '/dashboard' }, // Will use tab navigation
    { icon: Clock, label: 'Timetable', path: '/dashboard' }, // Will use tab navigation
    { icon: FileCheck, label: 'Exams', path: '/dashboard' }, // Will use tab navigation
  ];

  // Additional items for instructors/admins
  const instructorMenuItems = [
    { icon: Users, label: 'Students', path: '/students' },
    { icon: GraduationCap, label: 'Instructors', path: '/instructors' },
  ];

  // Combine menu items based on role
  const menuItems = profile?.role === 'student' 
    ? [...baseMenuItems, ...studentMenuItems]
    : [...baseMenuItems, ...instructorMenuItems];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm hidden lg:block"
    >
      <div className="p-6 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-inter font-medium">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;