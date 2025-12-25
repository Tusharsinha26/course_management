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

  const dayMap = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
    sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
  };

  const parseCourseTime = (text) => {
    // Accept formats like: "Monday 09:00-10:30", "Mon 09:00-10:30", or "09:00-10:30"
    if (!text) return null;
    const t = String(text).trim();
    // Try to find day
    const dayMatch = t.match(/^(\w+)\s+/);
    let dayOfWeek = null;
    let rest = t;
    if (dayMatch) {
      const d = dayMatch[1].toLowerCase();
      if (dayMap.hasOwnProperty(d)) {
        dayOfWeek = dayMap[d];
        rest = t.slice(dayMatch[0].length).trim();
      }
    }
    // Find times
    const timeMatch = rest.match(/(\d{1,2}:?\d{2})\s*-\s*(\d{1,2}:?\d{2})/);
    if (timeMatch) {
      const start = timeMatch[1].includes(':') ? timeMatch[1] : timeMatch[1].slice(0,2) + ':' + timeMatch[1].slice(2);
      const end = timeMatch[2].includes(':') ? timeMatch[2] : timeMatch[2].slice(0,2) + ':' + timeMatch[2].slice(2);
      return { day_of_week: dayOfWeek ?? 1, start_time: start, end_time: end };
    }
    // If only single time provided, treat as start with 1h duration
    const singleMatch = rest.match(/(\d{1,2}:?\d{2})/);
    if (singleMatch) {
      const start = singleMatch[1].includes(':') ? singleMatch[1] : singleMatch[1].slice(0,2) + ':' + singleMatch[1].slice(2);
      // default end time +1h
      const [h, m] = start.split(':').map(Number);
      const endH = (h + 1) % 24;
      const end = `${String(endH).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      return { day_of_week: dayOfWeek ?? 1, start_time: start, end_time: end };
    }
    return null;
  };

  const fetchTimetable = async () => {
    if (!user) return;
    try {
      if (profile?.role === 'instructor') {
        // For instructors, derive schedule from their courses' course_time
        const { data: coursesData, error: courseErr } = await supabase
          .from('courses')
          .select('id, title, course_time, image_url, location')
          .eq('instructor_id', user.id);

        if (courseErr) throw courseErr;

        const mapped = (coursesData || []).map((c) => {
          const parsed = parseCourseTime(c.course_time);
          return {
            id: `course-${c.id}`,
            course_title: c.title,
            day_of_week: parsed?.day_of_week ?? 1,
            start_time: parsed?.start_time ?? '09:00',
            end_time: parsed?.end_time ?? '10:00',
            room: c.location || 'TBA',
          };
        });

        setSchedules(mapped);
      } else {
        // For students, derive schedule from enrollments -> courses
        const { data: enrollData, error: enrollErr } = await supabase
          .from('enrollments')
          .select('course_id, courses(id, title, course_time, location)')
          .eq('student_id', user.id);

        if (enrollErr) throw enrollErr;

        const mapped = (enrollData || []).map((e) => {
          const c = e.courses || {};
          const parsed = parseCourseTime(c.course_time);
          return {
            id: `enroll-${e.course_id}`,
            course_title: c.title,
            day_of_week: parsed?.day_of_week ?? 1,
            start_time: parsed?.start_time ?? '09:00',
            end_time: parsed?.end_time ?? '10:00',
            room: c.location || 'TBA',
          };
        });

        // sort by day and start_time
        mapped.sort((a, b) => (a.day_of_week - b.day_of_week) || a.start_time.localeCompare(b.start_time));
        setSchedules(mapped);
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
