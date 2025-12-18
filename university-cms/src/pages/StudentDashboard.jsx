import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Upload, FileText, Calendar, Clock, Bell, Download, BarChart3, TrendingUp, CheckCircle, XCircle, Video, Play, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [grades, setGrades] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [exams, setExams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // courses, announcements, materials, grades, analytics, attendance, timetable, exams, videos

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;

    try {
      // Fetch enrolled courses
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            duration,
            progress
          )
        `)
        .eq('student_id', user.id);

      if (enrollError) throw enrollError;
      setEnrolledCourses(enrollments || []);

      // Fetch assignments for enrolled courses
      if (enrollments && enrollments.length > 0) {
        const courseIds = enrollments.map(e => e.course_id);
        const { data: assignmentsData, error: assignError } = await supabase
          .from('assignments')
          .select('*')
          .in('course_id', courseIds)
          .order('due_date', { ascending: true });

        if (assignError) throw assignError;
        setAssignments(assignmentsData || []);

        // Fetch announcements
        const { data: announcementsData, error: announcementsError } = await supabase
          .from('announcements')
          .select('*')
          .in('course_id', courseIds)
          .order('created_at', { ascending: false });
        
        if (!announcementsError) {
          setAnnouncements(announcementsData || []);
        }

        // Fetch materials
        const { data: materialsData, error: materialsError } = await supabase
          .from('materials')
          .select('*')
          .in('course_id', courseIds)
          .order('week_number', { ascending: true });
        
        if (!materialsError) {
          setMaterials(materialsData || []);
        }

        // Fetch grades
        const { data: gradesData, error: gradesError } = await supabase
          .from('grades')
          .select(`
            *,
            assignments (
              title,
              courses (
                title
              )
            )
          `)
          .eq('student_id', user.id)
          .order('graded_at', { ascending: false });
        
        if (!gradesError) {
          setGrades(gradesData || []);
        }

        // Fetch my attendance
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select(`
            *,
            courses (
              title
            )
          `)
          .eq('student_id', user.id)
          .order('date', { ascending: false });
        
        if (!attendanceError) {
          setMyAttendance(attendanceData || []);
        }

        // Fetch timetable
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('course_schedule')
          .select(`
            *,
            courses (
              id,
              title
            )
          `)
          .in('course_id', courseIds)
          .order('day_of_week', { ascending: true });
        
        if (!scheduleError) {
          setTimetable(scheduleData || []);
        }

        // Fetch exams
        const { data: examsData, error: examsError } = await supabase
          .from('exams')
          .select(`
            *,
            courses (
              title
            )
          `)
          .in('course_id', courseIds)
          .order('exam_date', { ascending: true });
        
        if (!examsError) {
          setExams(examsData || []);
        }

        // Fetch course videos
        const { data: videosData, error: videosError } = await supabase
          .from('course_videos')
          .select('*')
          .in('course_id', courseIds)
          .order('created_at', { ascending: false });
        
        if (!videosError) {
          setVideos(videosData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (assignmentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${assignmentId}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assignments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('assignments')
          .getPublicUrl(fileName);

        // Create submission record
        const { error: submitError } = await supabase
          .from('submissions')
          .insert([
            {
              assignment_id: assignmentId,
              student_id: user.id,
              file_url: publicUrl,
            }
          ]);

        if (submitError) throw submitError;

        alert('Assignment submitted successfully!');
        fetchStudentData();
      } catch (error) {
        console.error('Error uploading assignment:', error);
        alert('Failed to upload assignment: ' + error.message);
      }
    };
    input.click();
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
      <Sidebar />
      
      <div className="lg:ml-64 pt-16">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-nunito text-4xl font-bold text-gray-800 mb-2">
              Welcome, {profile?.full_name || user?.email?.split('@')[0]}! 👨‍🎓
            </h1>
            <p className="font-inter text-gray-600">
              Student Dashboard - Track your courses and assignments
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-teal-600">{enrolledCourses.length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-teal-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pending Assignments</p>
                  <p className="text-3xl font-bold text-amber-600">{assignments.length}</p>
                </div>
                <FileText className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Overall Progress</p>
                  <p className="text-3xl font-bold text-green-600">
                    {enrolledCourses.length > 0
                      ? Math.round(
                          enrolledCourses.reduce((acc, e) => acc + (e.courses?.progress || 0), 0) /
                            enrolledCourses.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Clock className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'courses' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'announcements' ? 'bg-amber-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-5 h-5" />
              Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'materials' ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Download className="w-5 h-5" />
              Materials
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'grades' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              My Grades
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'attendance' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              My Attendance
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'timetable' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5" />
              Timetable
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'exams' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileCheck className="w-5 h-5" />
              Exams
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'videos' ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Video className="w-5 h-5" />
              Videos
            </button>
          </div>

          {/* Courses Tab */}
          {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            {/* Latest Courses Marquee */}
            <div className="mb-8 overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-2xl shadow-lg">
              <div className="py-4 px-6">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="animate-pulse">🔥</span> Latest & Trending Courses
                </h3>
                <div className="relative overflow-hidden">
                  <div className="flex gap-4 animate-marquee whitespace-nowrap">
                    {/* First set of courses */}
                    {enrolledCourses.concat(enrolledCourses).map((enrollment, index) => (
                      <div
                        key={`marquee-${index}`}
                        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[300px]"
                      >
                        {enrollment.courses?.image_url && (
                          <img
                            src={enrollment.courses.image_url}
                            alt={enrollment.courses?.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm truncate">
                            {enrollment.courses?.title}
                          </p>
                          <p className="text-white/70 text-xs">
                            {enrollment.courses?.duration || 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>
            {enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You're not enrolled in any courses yet.</p>
                <a href="/courses" className="mt-4 inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  Browse Courses
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((enrollment, index) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {enrollment.courses?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {enrollment.courses?.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className="text-sm font-semibold text-teal-600">
                        {enrollment.courses?.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${enrollment.courses?.progress || 0}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          {/* Assignments for Courses */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Assignments</h2>
            {assignments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending assignments.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assignment</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Max Points</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment, index) => (
                        <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-800">{assignment.title}</p>
                              <p className="text-sm text-gray-500">{assignment.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {assignment.due_date
                                ? new Date(assignment.due_date).toLocaleDateString()
                                : 'No due date'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">
                            {assignment.max_points} pts
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleFileUpload(assignment.id)}
                              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          </motion.div>
          )}
          
          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Announcements</h2>
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No announcements yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-lg ${
                        ann.priority === 'urgent'
                          ? 'bg-red-50 border-l-4 border-red-600'
                          : ann.priority === 'high'
                          ? 'bg-amber-50 border-l-4 border-amber-600'
                          : ann.priority === 'medium'
                          ? 'bg-yellow-50 border-l-4 border-yellow-600'
                          : 'bg-teal-50 border-l-4 border-teal-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-800">{ann.title}</h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          ann.priority === 'urgent' ? 'bg-red-600 text-white' :
                          ann.priority === 'high' ? 'bg-amber-600 text-white' :
                          ann.priority === 'medium' ? 'bg-yellow-600 text-white' :
                          'bg-teal-600 text-white'
                        }`}>
                          {ann.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{ann.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(ann.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Materials</h2>
              {materials.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No materials available yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {materials.map((mat) => (
                    <div key={mat.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">{mat.title}</h5>
                        <p className="text-sm text-gray-600 mb-1">{mat.description}</p>
                        <span className="text-xs text-teal-600 font-semibold">Week {mat.week_number}</span>
                      </div>
                      <a
                        href={mat.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 text-sm flex items-center gap-2 whitespace-nowrap ml-4"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Grades Tab */}
          {activeTab === 'grades' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Grades</h2>
              {grades.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No graded assignments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {grades.map((grade) => (
                    <div key={grade.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-800">{grade.assignments?.title}</h5>
                          <p className="text-sm text-gray-600">{grade.assignments?.courses?.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {grade.points_earned}/{grade.max_points}
                          </p>
                          <p className="text-sm text-gray-600">
                            {((grade.points_earned / grade.max_points) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      {grade.feedback && (
                        <div className="mt-3 p-3 bg-teal-50 rounded">
                          <p className="text-sm text-gray-700"><strong>Feedback:</strong> {grade.feedback}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Graded: {new Date(grade.graded_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Analytics</h2>
              
              {grades.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No data available yet. Complete graded assignments to see analytics.</p>
                </div>
              ) : (
                <>
                  {/* Grade Distribution */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Grade Distribution</h3>
                    <div className="max-w-md mx-auto">
                      <Doughnut
                        data={{
                          labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (<60)'],
                          datasets: [{
                            data: [
                              grades.filter(g => (g.points_earned / g.max_points) * 100 >= 90).length,
                              grades.filter(g => (g.points_earned / g.max_points) * 100 >= 80 && (g.points_earned / g.max_points) * 100 < 90).length,
                              grades.filter(g => (g.points_earned / g.max_points) * 100 >= 70 && (g.points_earned / g.max_points) * 100 < 80).length,
                              grades.filter(g => (g.points_earned / g.max_points) * 100 >= 60 && (g.points_earned / g.max_points) * 100 < 70).length,
                              grades.filter(g => (g.points_earned / g.max_points) * 100 < 60).length,
                            ],
                            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
                          }]
                        }}
                        options={{
                          plugins: {
                            legend: { position: 'bottom' }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Average Score */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Average Score</h3>
                    <div className="text-center">
                      <p className="text-6xl font-bold text-teal-600">
                        {(grades.reduce((acc, g) => acc + (g.points_earned / g.max_points) * 100, 0) / grades.length).toFixed(1)}%
                      </p>
                      <p className="text-gray-600 mt-2">Overall Average</p>
                    </div>
                  </div>

                  {/* Performance Over Time */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Over Time</h3>
                    <Line
                      data={{
                        labels: grades.map((g, i) => `Assignment ${i + 1}`),
                        datasets: [{
                          label: 'Score (%)',
                          data: grades.map(g => (g.points_earned / g.max_points) * 100),
                          borderColor: '#6366f1',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          tension: 0.4,
                        }]
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: { display: true, text: 'Score (%)' }
                          }
                        },
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>

                  {/* Assignment Breakdown */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Assignment Breakdown</h3>
                    <Bar
                      data={{
                        labels: grades.map(g => g.assignments?.title || 'Assignment'),
                        datasets: [{
                          label: 'Points Earned',
                          data: grades.map(g => g.points_earned),
                          backgroundColor: '#10b981',
                        }, {
                          label: 'Max Points',
                          data: grades.map(g => g.max_points),
                          backgroundColor: '#e5e7eb',
                        }]
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Points' }
                          }
                        }
                      }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* My Attendance Tab */}
          {activeTab === 'attendance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Attendance Record</h2>
              {myAttendance.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No attendance records yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAttendance.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-800">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-gray-800">
                            {record.courses?.title}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.status === 'present' ? '✓ Present' :
                               record.status === 'late' ? '⏰ Late' :
                               '✗ Absent'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Attendance Summary */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {myAttendance.filter(a => a.status === 'present').length}
                      </p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {myAttendance.filter(a => a.status === 'late').length}
                      </p>
                      <p className="text-sm text-gray-600">Late</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {myAttendance.filter(a => a.status === 'absent').length}
                      </p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Timetable Tab */}
          {activeTab === 'timetable' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Timetable</h2>
              {timetable.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No schedule available yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Day</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Course</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((schedule) => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 border text-gray-800 font-semibold">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.day_of_week]}
                          </td>
                          <td className="px-4 py-4 border text-gray-800">
                            {schedule.courses?.title}
                          </td>
                          <td className="px-4 py-4 border text-gray-700">
                            {schedule.start_time} - {schedule.end_time}
                          </td>
                          <td className="px-4 py-4 border text-gray-600">
                            {schedule.room || 'TBA'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Exams</h2>
              {exams.length === 0 ? (
                <div className="text-center py-8">
                  <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No exams scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{exam.title}</h3>
                          <p className="text-sm text-gray-600">{exam.courses?.title}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          new Date(exam.exam_date) < new Date() ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-800'
                        }`}>
                          {new Date(exam.exam_date) < new Date() ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{exam.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(exam.exam_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Time</p>
                          <p className="font-semibold text-gray-800">{exam.start_time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold text-gray-800">{exam.duration} min</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Room</p>
                          <p className="font-semibold text-gray-800">{exam.room || 'TBA'}</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-teal-50 rounded">
                        <p className="text-sm text-teal-800">
                          <strong>Total Marks:</strong> {exam.total_marks}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Videos</h2>
              {videos.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No videos available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                        {video.thumbnail_url ? (
                          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <Play className="w-16 h-16 text-gray-400" />
                        )}
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all"
                        >
                          <div className="bg-white rounded-full p-4">
                            <Play className="w-8 h-8 text-teal-600" />
                          </div>
                        </a>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Week {video.week_number || 'N/A'}</span>
                          {video.duration && (
                            <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
