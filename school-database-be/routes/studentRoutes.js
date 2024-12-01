const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  registerStudentForCourse,
  dropStudentFromCourse
} = require('../controllers/studentController');

// Basic CRUD routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

// Special course registration routes
router.post('/course/register', registerStudentForCourse);
router.post('/course/drop', dropStudentFromCourse);

module.exports = router;