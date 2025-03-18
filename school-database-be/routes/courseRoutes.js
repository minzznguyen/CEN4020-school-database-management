const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  enrollStudent,
  unenrollStudent
} = require('../controllers/courseController');

// Student enrollment routes
// POST /courses/:id/:studentId - Enroll a student in a course
router.post('/:id/:studentId', enrollStudent);

// DELETE /courses/:id/:studentId - Remove a student from a course
router.delete('/:id/:studentId', unenrollStudent);

// GET /courses/:id/students - Get all students enrolled in a course
router.get('/:id/students', getCourseStudents);

// Basic CRUD operations for courses
// GET /courses - Get all courses
router.get('/', getAllCourses);

// POST /courses - Create a new course
router.post('/', addCourse);

// GET /courses/:id - Get a specific course by ID
router.get('/:id', getCourseById);

// PUT /courses/:id - Update a course's information
router.put('/:id', updateCourse);

// DELETE /courses/:id - Delete a course
router.delete('/:id', deleteCourse);

module.exports = router; 