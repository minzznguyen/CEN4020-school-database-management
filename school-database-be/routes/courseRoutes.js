const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router; 