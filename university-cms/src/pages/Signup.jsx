import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, UserCircle, Users } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting signup process...');
      
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Insert user directly into profiles table
      const { data: newUser, error: dbError } = await supabase
        .from('profiles')
        .insert([
          {
            email: email,
            password: password,
            full_name: fullName,
            role: role,
          }
        ])
        .select()
        .single();

      console.log('User creation response:', newUser, dbError);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(dbError.message || 'Failed to create account');
      }

      console.log('User created successfully!');

      // Auto-login the user
      localStorage.setItem('cms_user', JSON.stringify(newUser));
      
      setLoading(false);
      alert('Signup successful! Redirecting to dashboard...');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Reload to update auth context
      }, 500);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
      alert(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <GraduationCap className="w-12 h-12 text-teal-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              University CMS
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h2>
          <p className="text-gray-600 mt-2">Start managing courses today</p>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="you@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    role === 'student'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-300 hover:border-teal-300 text-gray-600'
                  }`}
                >
                  <UserCircle className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">Student</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                    role === 'instructor'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-300 hover:border-teal-300 text-gray-600'
                  }`}
                >
                  <Users className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">Instructor</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
