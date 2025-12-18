import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, Plus, Edit, Trash2, UserCheck, X, FileText, Eye, Bell, Calendar, Upload, CheckCircle, XCircle, Clock, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const InstructorDashboard = () => {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showGrading, setShowGrading] = useState(false);
  const [showExams, setShowExams] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [exams, setExams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '12 weeks',
    image_url: '',
    course_time: '',
  });

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    max_points: 100,
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    priority: 'medium',
  });

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    week_number: 1,
  });

  const [gradeData, setGradeData] = useState({
    points_earned: '',
    feedback: '',
  });

  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    exam_date: '',
    start_time: '',
    duration: 60,
    total_marks: 100,
    room: '',
  });

  const [newSchedule, setNewSchedule] = useState({
    day_of_week: 1,
    start_time: '',
    end_time: '',
    room: '',
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    video_url: '',
    week_number: 1,
  });

  useEffect(() => {
    fetchInstructorData();
  }, [user]);

  const fetchInstructorData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('course_id', courseId);

      if (error) throw error;
      setEnrolledStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', courseId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles (
            full_name,
            email
          ),
          grades (
            points_earned,
            max_points,
            feedback
          )
        `)
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const fetchAnnouncements = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchMaterials = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('course_id', courseId)
        .order('week_number', { ascending: true });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const fetchAttendance = async (courseId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: students } = await supabase
        .from('enrollments')
        .select('student_id, profiles(full_name, email)')
        .eq('course_id', courseId);

      const studentsList = students?.map(s => ({
        student_id: s.student_id,
        name: s.profiles?.full_name,
        email: s.profiles?.email,
        status: 'absent'
      })) || [];

      // Get today's attendance
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('course_id', courseId)
        .eq('date', today);

      // Merge attendance data
      const attendanceMap = {};
      attendance?.forEach(a => {
        attendanceMap[a.student_id] = a.status;
      });

      studentsList.forEach(s => {
        s.status = attendanceMap[s.student_id] || 'absent';
      });

      setAttendanceData(studentsList);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchExams = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('course_id', courseId)
        .order('exam_date', { ascending: true });
      
      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchSchedules = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('course_schedule')
        .select('*')
        .eq('course_id', courseId)
        .order('day_of_week', { ascending: true });
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchVideos = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('course_videos')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.title) {
      alert('Please enter course title');
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .insert([
          {
            ...newCourse,
            instructor_id: user.id,
            student_count: 0,
          }
        ]);

      if (error) throw error;

      setShowAddCourse(false);
      setNewCourse({ title: '', description: '', duration: '12 weeks' });
      fetchInstructorData();
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course: ' + error.message);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse || !newCourse.title) {
      alert('Please enter course title');
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: newCourse.title,
          description: newCourse.description,
          duration: newCourse.duration,
        })
        .eq('id', editingCourse.id);

      if (error) throw error;

      setShowAddCourse(false);
      setEditingCourse(null);
      setNewCourse({ title: '', description: '', duration: '12 weeks' });
      fetchInstructorData();
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course: ' + error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      fetchInstructorData();
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course: ' + error.message);
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.title || !selectedCourse) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('assignments')
        .insert([
          {
            ...newAssignment,
            course_id: selectedCourse.id,
          }
        ]);

      if (error) throw error;

      setShowAddAssignment(false);
      setNewAssignment({ title: '', description: '', due_date: '', max_points: 100 });
      alert('Assignment created successfully!');
      fetchAssignments(selectedCourse.id);
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment: ' + error.message);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !selectedCourse) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .insert([
          {
            ...newAnnouncement,
            course_id: selectedCourse.id,
            instructor_id: user.id,
          }
        ]);

      if (error) throw error;
      setNewAnnouncement({ title: '', message: '', priority: 'medium' });
      alert('Announcement posted successfully!');
      fetchAnnouncements(selectedCourse.id);
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert('Failed to post announcement: ' + error.message);
    }
  };

  const handleUploadMaterial = async (file) => {
    if (!file || !selectedCourse) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('materials')
        .insert([
          {
            ...newMaterial,
            course_id: selectedCourse.id,
            file_url: publicUrl,
            file_type: file.type,
            uploaded_by: user.id,
          }
        ]);

      if (error) throw error;
      setNewMaterial({ title: '', description: '', week_number: 1 });
      alert('Material uploaded successfully!');
      fetchMaterials(selectedCourse.id);
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Failed to upload material: ' + error.message);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    if (!selectedCourse) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance')
        .upsert({
          course_id: selectedCourse.id,
          student_id: studentId,
          date: today,
          status: status,
          marked_by: user.id,
        }, {
          onConflict: 'course_id,student_id,date'
        });

      if (error) throw error;
      fetchAttendance(selectedCourse.id);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance: ' + error.message);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !gradeData.points_earned) {
      alert('Please enter points earned');
      return;
    }

    try {
      const { error } = await supabase
        .from('grades')
        .upsert({
          submission_id: selectedSubmission.id,
          assignment_id: selectedSubmission.assignment_id,
          student_id: selectedSubmission.student_id,
          points_earned: parseFloat(gradeData.points_earned),
          max_points: selectedAssignment?.max_points || 100,
          feedback: gradeData.feedback,
          graded_by: user.id,
        }, {
          onConflict: 'submission_id'
        });

      if (error) throw error;
      
      setShowGrading(false);
      setGradeData({ points_earned: '', feedback: '' });
      alert('Grade submitted successfully!');
      fetchSubmissions(selectedSubmission.assignment_id);
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to submit grade: ' + error.message);
    }
  };

  const showAttendanceModal = async (course) => {
    setSelectedCourse(course);
    await fetchAttendance(course.id);
    setShowAttendance(true);
  };

  const showAssignmentsModal = async (course) => {
    setSelectedCourse(course);
    await fetchAssignments(course.id);
    setShowAddAssignment(true);
  };

  const showSubmissionsModal = async (assignment) => {
    setSelectedAssignment(assignment);
    await fetchSubmissions(assignment.id);
    setShowSubmissions(true);
  };

  const showAnnouncementsModal = async (course) => {
    setSelectedCourse(course);
    await fetchAnnouncements(course.id);
    setShowAnnouncements(true);
  };

  const showMaterialsModal = async (course) => {
    setSelectedCourse(course);
    await fetchMaterials(course.id);
    setShowMaterials(true);
  };

  const openGradingModal = (submission, assignment) => {
    setSelectedSubmission(submission);
    setSelectedAssignment(assignment);
    if (submission.grades && submission.grades.length > 0) {
      setGradeData({
        points_earned: submission.grades[0].points_earned,
        feedback: submission.grades[0].feedback || '',
      });
    }
    setShowGrading(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title,
      description: course.description,
      duration: course.duration,
    });
    setShowAddCourse(true);
  };

  const showExamsModal = async (course) => {
    setSelectedCourse(course);
    await fetchExams(course.id);
    setShowExams(true);
  };

  const showScheduleModal = async (course) => {
    setSelectedCourse(course);
    await fetchSchedules(course.id);
    setShowSchedule(true);
  };

  const showVideosModal = async (course) => {
    setSelectedCourse(course);
    await fetchVideos(course.id);
    setShowVideos(true);
  };

  const handleAddExam = async () => {
    if (!newExam.title || !newExam.exam_date || !newExam.start_time) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('exams')
        .insert([{
          course_id: selectedCourse.id,
          created_by: user.id,
          ...newExam
        }]);

      if (error) throw error;

      alert('Exam scheduled successfully!');
      setNewExam({
        title: '',
        description: '',
        exam_date: '',
        start_time: '',
        duration: 60,
        total_marks: 100,
        room: '',
      });
      await fetchExams(selectedCourse.id);
    } catch (error) {
      console.error('Error adding exam:', error);
      alert('Failed to schedule exam');
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.start_time || !newSchedule.end_time) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('course_schedule')
        .insert([{
          course_id: selectedCourse.id,
          ...newSchedule
        }]);

      if (error) throw error;

      alert('Schedule added successfully!');
      setNewSchedule({
        day_of_week: 1,
        start_time: '',
        end_time: '',
        room: '',
      });
      await fetchSchedules(selectedCourse.id);
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('Failed to add schedule');
    }
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.video_url) {
      alert('Please fill title and video URL');
      return;
    }

    try {
      const { error } = await supabase
        .from('course_videos')
        .insert([{
          course_id: selectedCourse.id,
          uploaded_by: user.id,
          ...newVideo
        }]);

      if (error) throw error;

      alert('Video added successfully!');
      setNewVideo({
        title: '',
        description: '',
        video_url: '',
        week_number: 1,
      });
      await fetchVideos(selectedCourse.id);
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video');
    }
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.student_count || 0), 0);

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-nunito text-4xl font-bold text-gray-800 mb-2">
              Instructor Dashboard 👨‍🏫
            </h1>
            <p className="font-inter text-gray-600">
              Welcome back, {profile?.full_name || 'Instructor'}!
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <BookOpen className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-inter opacity-90">My Courses</h3>
              <p className="text-3xl font-bold">{courses.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <Users className="w-8 h-8 mb-2" />
              <h3 className="text-sm font-inter opacity-90">Total Students</h3>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </motion.div>
          </div>

          {/* Add Course Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                setEditingCourse(null);
                setNewCourse({ title: '', description: '', duration: '12 weeks' });
                setShowAddCourse(true);
              }}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add New Course
            </button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500">
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Students:</strong> {course.student_count || 0}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openEditModal(course)}
                    className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => showAttendanceModal(course)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1 text-sm relative"
                  >
                    <Users className="w-4 h-4" />
                    Students ({course.student_count || 0})
                  </button>
                  <button
                    onClick={() => showAttendanceModal(course)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    Attendance
                  </button>
                  <button
                    onClick={() => showAssignmentsModal(course)}
                    className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Assignments
                  </button>
                  <button
                    onClick={() => showAnnouncementsModal(course)}
                    className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Bell className="w-4 h-4" />
                    Announcements
                  </button>
                  <button
                    onClick={() => showMaterialsModal(course)}
                    className="bg-cyan-600 text-white px-3 py-2 rounded-lg hover:bg-cyan-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Materials
                  </button>
                  <button
                    onClick={() => showExamsModal(course)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Exams
                  </button>
                  <button
                    onClick={() => showScheduleModal(course)}
                    className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Clock className="w-4 h-4" />
                    Schedule
                  </button>
                  <button
                    onClick={() => showVideosModal(course)}
                    className="bg-cyan-600 text-white px-3 py-2 rounded-lg hover:bg-cyan-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Video className="w-4 h-4" />
                    Videos
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses yet. Create your first course!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      <AnimatePresence>
        {showAddCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCourse(false)}
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
                <button onClick={() => setShowAddCourse(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="Web Development Fundamentals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
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
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="12 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Image URL
                  </label>
                  <input
                    type="url"
                    value={newCourse.image_url}
                    onChange={(e) => setNewCourse({ ...newCourse, image_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: Add an image URL for the course card</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Time
                  </label>
                  <input
                    type="text"
                    value={newCourse.course_time}
                    onChange={(e) => setNewCourse({ ...newCourse, course_time: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="Mon, Wed, Fri - 10:00 AM to 12:00 PM"
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: Mon-Fri 9:00 AM or Weekends 2:00 PM</p>
                </div>

                <button
                  onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-semibold"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAttendance(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Enrolled Students - {selectedCourse?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: <span className="font-semibold text-indigo-600">{enrolledStudents.length}</span> {enrolledStudents.length === 1 ? 'student' : 'students'}
                  </p>
                </div>
                <button onClick={() => setShowAttendance(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {enrolledStudents.length > 0 ? (
                <div className="space-y-3">
                  {enrolledStudents.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {enrollment.profiles?.full_name || 'No Name'}
                        </p>
                        <p className="text-sm text-gray-600">{enrollment.profiles?.email}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No students enrolled yet</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignments Modal */}
      <AnimatePresence>
        {showAddAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddAssignment(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Assignments - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowAddAssignment(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Add Assignment Form */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4">Create New Assignment</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder="Homework 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      rows="2"
                      placeholder="Assignment details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newAssignment.due_date}
                      onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Points
                    </label>
                    <input
                      type="number"
                      value={newAssignment.max_points}
                      onChange={(e) => setNewAssignment({ ...newAssignment, max_points: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      min="1"
                      step="1"
                      placeholder="100"
                    />
                  </div>

                  <button
                    onClick={handleAddAssignment}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-semibold"
                  >
                    Create Assignment
                  </button>
                </div>
              </div>

              {/* Assignments List */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Existing Assignments</h4>
                {assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{assignment.title}</p>
                          <p className="text-sm text-gray-600">{assignment.description}</p>
                          <div className="flex gap-3 mt-1">
                            <p className="text-xs text-gray-500">
                              Due: {new Date(assignment.due_date).toLocaleString()}
                            </p>
                            <p className="text-xs text-teal-600 font-semibold">
                              Max Points: {assignment.max_points || 100}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => showSubmissionsModal(assignment)}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Submissions
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No assignments yet</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submissions Modal */}
      <AnimatePresence>
        {showSubmissions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmissions(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Submissions - {selectedAssignment?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold text-teal-600">{submissions.length}</span> {submissions.length === 1 ? 'submission' : 'submissions'} received
                    <span className="mx-2">•</span>
                    Max Points: <span className="font-semibold">{selectedAssignment?.max_points || 100}</span>
                  </p>
                </div>
                <button onClick={() => setShowSubmissions(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {submissions.length > 0 ? (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {submission.profiles?.full_name || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-gray-600">{submission.profiles?.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {new Date(submission.submitted_at).toLocaleString()}
                          </p>
                          {submission.grades && submission.grades.length > 0 && (
                            <div className="mt-2 p-2 bg-green-100 rounded">
                              <p className="text-sm font-semibold text-green-800">
                                Grade: {submission.grades[0].points_earned}/{submission.grades[0].max_points}
                              </p>
                              {submission.grades[0].feedback && (
                                <p className="text-xs text-gray-700 mt-1">
                                  Feedback: {submission.grades[0].feedback}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm whitespace-nowrap"
                          >
                            View File
                          </a>
                          <button
                            onClick={() => openGradingModal(submission, selectedAssignment)}
                            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                              submission.grades && submission.grades.length > 0
                                ? 'bg-amber-600 hover:bg-amber-700'
                                : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                          >
                            {submission.grades && submission.grades.length > 0 ? 'Re-Grade' : 'Grade'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No submissions yet</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAttendance(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Mark Attendance - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowAttendance(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Date: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-3">
                {attendanceData.map((student) => (
                  <div key={student.student_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkAttendance(student.student_id, 'present')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          student.status === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Present
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(student.student_id, 'late')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          student.status === 'late'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Late
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(student.student_id, 'absent')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          student.status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements Modal */}
      <AnimatePresence>
        {showAnnouncements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnnouncements(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Announcements - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowAnnouncements(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Post New Announcement */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Post New Announcement</h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <textarea
                  placeholder="Message"
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows="3"
                />
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button
                  onClick={handleAddAnnouncement}
                  className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700"
                >
                  Post Announcement
                </button>
              </div>

              {/* Announcements List */}
              <div>
                <h4 className="font-semibold mb-3">All Announcements</h4>
                <div className="space-y-3">
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Materials Modal */}
      <AnimatePresence>
        {showMaterials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMaterials(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Course Materials - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowMaterials(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Upload Material */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Upload New Material</h4>
                <input
                  type="text"
                  placeholder="Material Title"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows="2"
                />
                <input
                  type="number"
                  placeholder="Week Number"
                  value={newMaterial.week_number}
                  onChange={(e) => setNewMaterial({ ...newMaterial, week_number: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  min="1"
                />
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleUploadMaterial(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Materials List */}
              <div>
                <h4 className="font-semibold mb-3">Uploaded Materials</h4>
                <div className="space-y-3">
                  {materials.map((mat) => (
                    <div key={mat.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-800">{mat.title}</h5>
                          <p className="text-sm text-gray-600 mb-1">{mat.description}</p>
                          <span className="text-xs text-teal-600">Week {mat.week_number}</span>
                        </div>
                        <a
                          href={mat.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-cyan-600 text-white px-3 py-1 rounded-lg hover:bg-cyan-700 text-sm"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {showGrading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGrading(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Grade Submission</h3>
                <button onClick={() => setShowGrading(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Student: <strong>{selectedSubmission?.profiles?.full_name}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Max Points: <strong>{selectedAssignment?.max_points || 100}</strong>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Points Earned
                  </label>
                  <input
                    type="number"
                    value={gradeData.points_earned}
                    onChange={(e) => setGradeData({ ...gradeData, points_earned: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    max={selectedAssignment?.max_points || 100}
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                    placeholder="Provide feedback to student..."
                  />
                </div>

                <button
                  onClick={handleGradeSubmission}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Submit Grade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exams Modal */}
      <AnimatePresence>
        {showExams && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExams(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Exams - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowExams(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Schedule New Exam */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Schedule New Exam</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Exam Title"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    className="col-span-2 px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Description"
                    value={newExam.description}
                    onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                    className="col-span-2 px-4 py-2 border rounded-lg"
                    rows="2"
                  />
                  <input
                    type="date"
                    value={newExam.exam_date}
                    onChange={(e) => setNewExam({ ...newExam, exam_date: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="time"
                    value={newExam.start_time}
                    onChange={(e) => setNewExam({ ...newExam, start_time: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Total Marks"
                    value={newExam.total_marks}
                    onChange={(e) => setNewExam({ ...newExam, total_marks: parseInt(e.target.value) })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Room Number"
                    value={newExam.room}
                    onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                    className="col-span-2 px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={handleAddExam}
                  className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Schedule Exam
                </button>
              </div>

              {/* Exams List */}
              <div>
                <h4 className="font-semibold mb-3">Scheduled Exams</h4>
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <div key={exam.id} className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-800">{exam.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-700"><strong>Date:</strong> {new Date(exam.exam_date).toLocaleDateString()}</p>
                        <p className="text-gray-700"><strong>Time:</strong> {exam.start_time}</p>
                        <p className="text-gray-700"><strong>Duration:</strong> {exam.duration} min</p>
                        <p className="text-gray-700"><strong>Marks:</strong> {exam.total_marks}</p>
                        <p className="text-gray-700 col-span-2"><strong>Room:</strong> {exam.room || 'TBA'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule/Timetable Modal */}
      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSchedule(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Course Schedule - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowSchedule(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Add Schedule */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Add Class Timing</h4>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newSchedule.day_of_week}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(e.target.value) })}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Room Number"
                    value={newSchedule.room}
                    onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="time"
                    placeholder="Start Time"
                    value={newSchedule.start_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="time"
                    placeholder="End Time"
                    value={newSchedule.end_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={handleAddSchedule}
                  className="w-full mt-3 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
                >
                  Add Schedule
                </button>
              </div>

              {/* Schedule List */}
              <div>
                <h4 className="font-semibold mb-3">Weekly Schedule</h4>
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Day</th>
                      <th className="border px-4 py-2 text-left">Time</th>
                      <th className="border px-4 py-2 text-left">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="border px-4 py-2">
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.day_of_week]}
                        </td>
                        <td className="border px-4 py-2">
                          {schedule.start_time} - {schedule.end_time}
                        </td>
                        <td className="border px-4 py-2">{schedule.room || 'TBA'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Videos Modal */}
      <AnimatePresence>
        {showVideos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideos(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Course Videos - {selectedCourse?.title}
                </h3>
                <button onClick={() => setShowVideos(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Add Video */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Add New Video</h4>
                <input
                  type="text"
                  placeholder="Video Title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows="2"
                />
                <input
                  type="text"
                  placeholder="Video URL (YouTube, Vimeo, etc.)"
                  value={newVideo.video_url}
                  onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <input
                  type="number"
                  placeholder="Week Number"
                  value={newVideo.week_number}
                  onChange={(e) => setNewVideo({ ...newVideo, week_number: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  min="1"
                />
                <button
                  onClick={handleAddVideo}
                  className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700"
                >
                  Add Video
                </button>
              </div>

              {/* Videos List */}
              <div>
                <h4 className="font-semibold mb-3">Uploaded Videos</h4>
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div key={video.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">{video.title}</h5>
                        <p className="text-sm text-gray-600 mb-1">{video.description}</p>
                        <span className="text-xs text-teal-600 font-semibold">Week {video.week_number}</span>
                      </div>
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 text-sm flex items-center gap-2 whitespace-nowrap ml-4"
                      >
                        <Video className="w-4 h-4" />
                        Watch
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorDashboard;
