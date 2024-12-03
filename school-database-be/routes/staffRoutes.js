const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Course management routes
router.post('/courses', staffController.createCourse);
router.delete('/courses/:id', staffController.deleteCourse);
router.put('/courses/:id', staffController.updateCourse);

// Instructor management routes
router.get('/instructors/:departmentId', staffController.getInstructorsByDepartment);
router.put('/courses/:id/instructor', staffController.assignInstructor);
router.delete('/courses/:id/instructor', staffController.removeInstructor);

module.exports = router;