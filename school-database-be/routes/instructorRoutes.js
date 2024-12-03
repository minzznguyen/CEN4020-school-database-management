const express = require('express');
const router = express.Router();
const {
  getAllInstructors,
  getInstructorById,
  getInstructorCourses,
  getInstructorStudents,
  createInstructor,
  updateInstructor,
  deleteInstructor
} = require('../controllers/instructorController');

// Basic CRUD routes
router.get('/', getAllInstructors);
router.get('/:id', getInstructorById);
router.post('/', createInstructor);
router.put('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);

// Additional instructor routes
router.get('/:instructorId/courses', getInstructorCourses);
router.get('/:instructorId/students', getInstructorStudents);

module.exports = router;