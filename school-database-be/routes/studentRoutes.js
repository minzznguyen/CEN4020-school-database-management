const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentGPA,
  getStudentCourses
} = require('../controllers/studentController');

// Basic CRUD routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

// Additional student routes
router.get('/:studentId/gpa', getStudentGPA);
router.get('/:studentId/courses', getStudentCourses);

module.exports = router;