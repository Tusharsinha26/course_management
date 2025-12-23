import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/Navbar';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const Timetable = () => {
  const { user, profile } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, [user]);

  const fetchTimetable = async () => {
    if (!user) return;
    try {
      // Try to fetch schedules for courses taught by this instructor
      const { data, error } = await supabase
        .from('course_schedule')
        .select('*, courses(id, title, instructor_id)')
        .eq('courses.instructor_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (!error && data && data.length > 0) {
        setSchedules(data);
      } else {
        // Provide demo timetable if none exists
        const demo = [
          { id: 'd1', course_title: 'Intro to Web Dev', day_of_week: 1, start_time: '09:00', end_time: '10:30', room: 'A101' },
          { id: 'd2', course_title: 'Data Structures', day_of_week: 2, start_time: '11:00', end_time: '12:30', room: 'B202' },
          { id: 'd3', course_title: 'Databases 101', day_of_week: 4, start_time: '14:00', end_time: '15:30', room: 'C303' },
          { id: 'd4', course_title: 'Algorithms Lab', day_of_week: 5, start_time: '10:00', end_time: '11:30', room: 'Lab 2' },
        ];
        setSchedules(demo);
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="pt-16">
        <div className="p-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-teal-600" />
              My Timetable
            </h1>
            <p className="text-sm text-gray-600">Scheduled classes for {profile?.full_name || 'Instructor'}</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <p className="text-gray-600">No scheduled classes found.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3">Day</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 align-top">{days[s.day_of_week] || 'N/A'}</td>
                          <td className="px-4 py-3 align-top">{s.start_time} - {s.end_time}</td>
                          <td className="px-4 py-3 align-top">{s.course_title || s.courses?.title || 'Course'}</td>
                          <td className="px-4 py-3 align-top">{s.room || s.location || 'TBA'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
