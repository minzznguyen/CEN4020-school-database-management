const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// GET all departments
router.get('/', getAllDepartments);

// GET specific department by ID
router.get('/:id', getDepartmentById);

// POST new department
router.post('/', addDepartment);

// PUT update department
router.put('/:id', updateDepartment);

// DELETE department
router.delete('/:id', deleteDepartment);

module.exports = router; 