const express = require('express');
const router = express.Router();
const {
  getAllAdvisors,
  getAdvisorById,
  addAdvisor,
  updateAdvisor,
  deleteAdvisor
} = require('../controllers/advisorController');

// Basic CRUD routes
router.get('/', getAllAdvisors);
router.get('/:id', getAdvisorById);
router.post('/', addAdvisor);
router.put('/:id', updateAdvisor);
router.delete('/:id', deleteAdvisor);

module.exports = router; 