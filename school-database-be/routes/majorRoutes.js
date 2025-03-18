const express = require('express');
const router = express.Router();
const {
  getAllMajors,
  getMajorById,
  createMajor,
  updateMajor,
  deleteMajor,
  getOverallGPAInfo,
} = require('../controllers/majorController');

// Basic CRUD routes
router.get('/', getAllMajors);
router.get('/:id', getMajorById);
router.post('/', createMajor);
router.put('/:id', updateMajor);
router.delete('/:id', deleteMajor);

// Special routes
router.get('/:id/overallGPAInfo', getOverallGPAInfo);

module.exports = router; 