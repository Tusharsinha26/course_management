import { motion } from 'framer-motion';
import { BookOpen, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      {/* Course Image or Header with Gradient */}
      {course.image_url ? (
        <div className="h-48 relative overflow-hidden">
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 items-center justify-center p-6">
            <BookOpen className="text-white w-12 h-12" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="font-nunito text-xl font-bold text-white truncate">
              {course.title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 p-6 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
            transition={{ duration: 0.3 }}
          />
          <BookOpen className="text-white w-8 h-8 mb-2" />
          <h3 className="font-nunito text-xl font-bold text-white truncate">
            {course.title}
          </h3>
        </div>
      )}

      {/* Course Body */}
      <div className="p-6">
        <p className="font-inter text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Meta */}
        <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students || 0} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration || '12 weeks'}</span>
            </div>
          </div>
          {course.course_time && (
            <div className="flex items-center gap-1 text-teal-600 font-medium">
              <Clock className="w-4 h-4" />
              <span>🕒 {course.course_time}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-inter text-xs text-gray-500">Progress</span>
            <span className="font-nunito text-sm font-semibold text-teal-600">
              {course.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress || 0}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;