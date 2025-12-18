import { supabase } from '../utils/supabaseClient';

// ============================================
// COURSES
// ============================================

export const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchCourseById = async (id) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createCourse = async (courseData) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCourse = async (id, courseData) => {
  const { data, error } = await supabase
    .from('courses')
    .update(courseData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCourse = async (id) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return { success: true };
};

// ============================================
// STUDENTS
// ============================================

export const fetchStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchStudentById = async (id) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================
// INSTRUCTORS
// ============================================

export const fetchInstructors = async () => {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchInstructorById = async (id) => {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================
// ASSIGNMENTS
// ============================================

export const fetchAssignmentsByCourse = async (courseId) => {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const submitAssignment = async (assignmentData) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([assignmentData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({ 
      grade: gradeData.grade, 
      feedback: gradeData.feedback,
      graded_at: new Date().toISOString()
    })
    .eq('id', submissionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================
// FILE UPLOAD (Supabase Storage)
// ============================================

export const uploadFile = async (bucket, filePath, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

export const deleteFile = async (bucket, filePath) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  
  if (error) throw error;
  return { success: true };
};

// ============================================
// ANALYTICS / STATS (Using Database Functions)
// ============================================

export const getStudentGPA = async (studentId) => {
  // Call a Supabase database function
  const { data, error } = await supabase
    .rpc('calculate_student_gpa', { student_id: studentId });
  
  if (error) throw error;
  return data;
};

export const getCourseStats = async (courseId) => {
  const { data, error } = await supabase
    .rpc('get_course_statistics', { course_id: courseId });
  
  if (error) throw error;
  return data;
};