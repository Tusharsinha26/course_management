import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Users, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Courses = () => {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user.id);

      if (error) throw error;
      setEnrolledCourses(data?.map(e => e.course_id) || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      alert('Please login to enroll in courses');
      return;
    }

    if (profile?.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            student_id: user.id,
            course_id: courseId,
          }
        ]);

      if (error) throw error;

      // Update student count
      const course = courses.find(c => c.id === courseId);
      await supabase
        .from('courses')
        .update({ students: (course.students || 0) + 1 })
        .eq('id', courseId);

      setEnrolledCourses([...enrolledCourses, courseId]);
      fetchCourses();
      alert('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling:', error);
      if (error.code === '23505') {
        alert('You are already enrolled in this course');
      } else {
        alert('Failed to enroll: ' + error.message);
      }
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  const mockCourses = [
    { 
      id: 'mock-1', 
      title: 'Introduction to Computer Science', 
      description: 'Learn the fundamentals of programming, algorithms, and data structures.', 
      progress: 75,
      students: 45,
      duration: '12 weeks',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      course_time: 'Mon, Wed, Fri - 9:00 AM to 11:00 AM',
      isMock: true
    },
    { 
      id: 'mock-2', 
      title: 'Advanced Mathematics', 
      description: 'Deep dive into calculus, linear algebra, and discrete mathematics.', 
      progress: 50,
      students: 32,
      duration: '14 weeks',
      image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop',
      course_time: 'Tue, Thu - 1:00 PM to 3:00 PM',
      isMock: true
    },
    { 
      id: 'mock-3', 
      title: 'Web Development with React', 
      description: 'Build modern, responsive web applications using React and Tailwind CSS.', 
      progress: 30,
      students: 58,
      duration: '10 weeks',
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
      course_time: 'Mon to Fri - 6:00 PM to 8:00 PM',
      isMock: true
    },
  ];

  const displayCourses = filteredCourses.length > 0 ? filteredCourses : mockCourses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Sidebar />
      
      <div className="lg:ml-64 pt-16">
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-nunito text-4xl font-bold text-gray-800 mb-2">
              All Courses
            </h1>
            <p className="font-inter text-gray-600">
              {displayCourses.length} courses available
            </p>
          </motion.div>

          {/* Latest Courses Marquee */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-2xl shadow-lg"
            >
              <div className="py-4 px-6">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="animate-pulse">🔥</span> Latest & Trending Courses
                </h3>
                <div className="relative overflow-hidden">
                  <div className="flex gap-4 animate-marquee whitespace-nowrap">
                    {/* Duplicate courses for seamless loop */}
                    {courses.concat(courses).map((course, index) => (
                      <div
                        key={`marquee-${index}`}
                        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[300px]"
                      >
                        {course.image_url && (
                          <img
                            src={course.image_url}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm truncate">
                            {course.title}
                          </p>
                          <p className="text-white/70 text-xs">
                            {course.duration || 'N/A'} • {course.students || 0} students
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-inter focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
              />
            </div>
          </motion.div>

          {/* Courses Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                {/* Course Image/Thumbnail */}
                {course.image_url ? (
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 items-center justify-center">
                      <div className="text-white text-6xl opacity-20">📚</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                    <div className="text-white text-6xl opacity-20">📚</div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students || 0} Students
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration || 'N/A'}
                      </span>
                    </div>
                    {course.course_time && (
                      <div className="flex items-center text-teal-600 font-medium">
                        <Clock className="w-4 h-4 mr-1" />
                        🕒 {course.course_time}
                      </div>
                    )}
                  </div>

                  {course.profiles && (
                    <p className="text-sm text-gray-500 mb-4">
                      Instructor: {course.profiles.full_name}
                    </p>
                  )}

                  {!course.isMock && profile?.role === 'student' && (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolledCourses.includes(course.id)}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        enrolledCourses.includes(course.id)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {enrolledCourses.includes(course.id) ? 'Enrolled' : 'Enroll Now'}
                    </button>
                  )}

                  {course.isMock && (
                    <div className="text-center text-sm text-gray-500 italic">
                      Sample course - Create real courses as instructor
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Courses;