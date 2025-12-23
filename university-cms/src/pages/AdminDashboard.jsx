import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, UserPlus, GraduationCap, Trash2, Edit, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // users, courses
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Form states
  const [userForm, setUserForm] = useState({ email: '', full_name: '', role: 'student' });
  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '', instructor_id: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStudents(), fetchInstructors(), fetchCourses()]);
    setLoading(false);
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'instructor')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstructors(data || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // User Management Functions
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({ email: '', full_name: '', role: 'student' });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ email: user.email, full_name: user.full_name, role: user.role });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            email: userForm.email,
            full_name: userForm.full_name,
            role: userForm.role,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        alert('User updated successfully!');
      } else {
        // For new users, they need to sign up themselves
        // Admin can only modify existing users
        alert('To add new users, they need to sign up on the signup page.');
        setShowUserModal(false);
        return;
      }

      setShowUserModal(false);
      fetchAllData();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their data.')) {
      return;
    }

    try {
      // First, delete or update dependent records
      // Delete exams created by this instructor
      await supabase
        .from('exams')
        .delete()
        .eq('created_by', userId);

      // Delete announcements created by this instructor
      await supabase
        .from('announcements')
        .delete()
        .eq('instructor_id', userId);

      // Delete courses taught by this instructor
      await supabase
        .from('courses')
        .delete()
        .eq('instructor_id', userId);

      // Set graded_by to NULL in grades where this instructor is the grader
      await supabase
        .from('grades')
        .update({ graded_by: null })
        .eq('graded_by', userId);

      // Set graded_by to NULL in exam_results where this instructor is the grader
      await supabase
        .from('exam_results')
        .update({ graded_by: null })
        .eq('graded_by', userId);

      // Set marked_by to NULL in attendance where this instructor marked
      await supabase
        .from('attendance')
        .update({ marked_by: null })
        .eq('marked_by', userId);

      // Set uploaded_by to NULL in materials
      await supabase
        .from('materials')
        .update({ uploaded_by: null })
        .eq('uploaded_by', userId);

      // Set uploaded_by to NULL in course_videos
      await supabase
        .from('course_videos')
        .update({ uploaded_by: null })
        .eq('uploaded_by', userId);

      // Finally, delete the user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      alert('User deleted successfully!');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + error.message);
    }
  };

  // Course Management Functions
  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({ title: '', description: '', duration: '', instructor_id: '' });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      instructor_id: course.instructor_id || '',
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (!courseForm.title || !courseForm.instructor_id) {
        alert('Please fill in all required fields');
        return;
      }

      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: courseForm.title,
            description: courseForm.description,
            duration: courseForm.duration,
            instructor_id: courseForm.instructor_id,
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        alert('Course updated successfully!');
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([{
            title: courseForm.title,
            description: courseForm.description,
            duration: courseForm.duration,
            instructor_id: courseForm.instructor_id,
            student_count: 0,
          }]);

        if (error) throw error;
        alert('Course created successfully!');
      }

      setShowCourseModal(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course: ' + error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-16">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-nunito text-4xl font-bold text-gray-800 mb-2">
              Admin Dashboard 🛠️
            </h1>
            <p className="font-inter text-gray-600">
              Manage users, courses, and system settings
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <Users className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-inter opacity-90">Total Students</h3>
              <p className="text-3xl font-bold">{students.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <GraduationCap className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-inter opacity-90">Total Instructors</h3>
              <p className="text-3xl font-bold">{instructors.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <BookOpen className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-inter opacity-90">Total Courses</h3>
              <p className="text-3xl font-bold">{courses.length}</p>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-2 px-4 font-semibold transition-all ${
                activeTab === 'users'
                  ? 'text-teal-600 border-b-4 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users Management
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`pb-2 px-4 font-semibold transition-all ${
                activeTab === 'courses'
                  ? 'text-teal-600 border-b-4 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Course Management
            </button>
          </div>

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Students Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Students</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 text-gray-600 font-semibold">Name</th>
                        <th className="text-left p-3 text-gray-600 font-semibold">Email</th>
                        <th className="text-left p-3 text-gray-600 font-semibold">Joined</th>
                        <th className="text-right p-3 text-gray-600 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">{student.full_name || 'N/A'}</td>
                          <td className="p-3">{student.email}</td>
                          <td className="p-3">{new Date(student.created_at).toLocaleDateString()}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleEditUser(student)}
                              className="text-teal-600 hover:text-teal-800 mr-3"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instructors Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Instructors</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 text-gray-600 font-semibold">Name</th>
                        <th className="text-left p-3 text-gray-600 font-semibold">Email</th>
                        <th className="text-left p-3 text-gray-600 font-semibold">Joined</th>
                        <th className="text-right p-3 text-gray-600 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructors.map((instructor) => (
                        <tr key={instructor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">{instructor.full_name || 'N/A'}</td>
                          <td className="p-3">{instructor.email}</td>
                          <td className="p-3">{new Date(instructor.created_at).toLocaleDateString()}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleEditUser(instructor)}
                              className="text-teal-600 hover:text-teal-800 mr-3"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(instructor.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Courses Management Tab */}
          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
                <button
                  onClick={handleAddCourse}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                >
                  <Plus className="w-5 h-5" />
                  Add Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 border-2 border-gray-100"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-500">
                        <strong>Instructor:</strong> {course.profiles?.full_name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Duration:</strong> {course.duration || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Students:</strong> {course.student_count || 0}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingUser ? 'Edit User' : 'Add User'}
                </h3>
                <button onClick={() => setShowUserModal(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="john@example.com"
                    disabled={editingUser} // Can't change email
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveUser}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-semibold"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Modal */}
      <AnimatePresence>
        {showCourseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCourseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button onClick={() => setShowCourseModal(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    rows="3"
                    placeholder="Course description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="10 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructor *
                  </label>
                  <select
                    value={courseForm.instructor_id}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor_id: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.full_name || instructor.email}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveCourse}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-semibold"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
