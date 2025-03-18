const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentMajors,
  getDepartmentGPA,
  getHighestGPADepartments
} = require('../controllers/departmentController');

// GET all departments
router.get('/', getAllDepartments);

// Add new route for getting departments sorted by their GPAs
// This needs to come before /:id routes
router.get('/highestGPAeach', getHighestGPADepartments);

// GET specific department by ID
router.get('/:id', getDepartmentById);

// POST new department
router.post('/', addDepartment);

// PUT update department
router.put('/:id', updateDepartment);

// DELETE department
router.delete('/:id', deleteDepartment);

// Add new route for getting majors in a department
router.get('/:id/majors', getDepartmentMajors);

// Add new route for getting department's overall GPA
router.get('/:id/gpa', getDepartmentGPA);

module.exports = router; 