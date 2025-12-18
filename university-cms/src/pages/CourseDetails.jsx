import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from Supabase
  const course = {
    id,
    title: 'Web Development with React',
    description: 'Master modern web development with React, Tailwind CSS, and industry best practices.',
    instructor: 'Dr. Sarah Chen',
    duration: '12 weeks',
    progress: 45,
  };

  const assignments = [
    { id: 1, title: 'Build a Todo App', dueDate: '2025-12-20', status: 'pending' },
    { id: 2, title: 'Create a Blog Platform', dueDate: '2025-12-25', status: 'submitted' },
    { id: 3, title: 'E-commerce Dashboard', dueDate: '2025-12-30', status: 'graded', grade: 'A' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Sidebar />
      
      <div className="lg:ml-64 pt-16">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-inter mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </motion.button>

          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 mb-8 text-white"
          >
            <h1 className="font-nunito text-4xl font-bold mb-2">{course.title}</h1>
            <p className="font-inter text-lg mb-4 opacity-90">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="opacity-75">Instructor:</span>
                <span className="ml-2 font-semibold">{course.instructor}</span>
              </div>
              <div>
                <span className="opacity-75">Duration:</span>
                <span className="ml-2 font-semibold">{course.duration}</span>
              </div>
              <div>
                <span className="opacity-75">Progress:</span>
                <span className="ml-2 font-semibold">{course.progress}%</span>
              </div>
            </div>
          </motion.div>

          {/* Assignment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-nunito text-2xl font-bold text-gray-800">Assignments</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-inter hover:bg-teal-700"
              >
                <Upload className="w-4 h-4" />
                Upload Assignment
              </motion.button>
            </div>

            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-teal-300 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-teal-600" />
                    <div>
                      <h3 className="font-inter font-semibold text-gray-800">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Due: {assignment.dueDate}
                      </div>
                    </div>
                  </div>

                  <div>
                    {assignment.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                    {assignment.status === 'submitted' && (
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                        Submitted
                      </span>
                    )}
                    {assignment.status === 'graded' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Grade: {assignment.grade}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;