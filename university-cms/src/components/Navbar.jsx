import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <GraduationCap className="w-8 h-8 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="font-nunito text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              University CMS
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/instructors">Instructors</NavLink>
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-inter text-sm text-gray-700">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-inter text-sm hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 font-inter text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
  >
    {children}
  </Link>
);

export default Navbar;