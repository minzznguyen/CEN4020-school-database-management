const express = require('express');
const router = express.Router();
const studentCourseRecordController = require('../controllers/studentCourseRecordController');

// GET all records
router.get('/', studentCourseRecordController.getAllStudentCourseRecords);

// GET specific record by ID
router.get('/:id', studentCourseRecordController.getStudentCourseRecordById);

// POST new record
router.post('/', studentCourseRecordController.addStudentCourseRecord);

// PUT update record
router.put('/:id', studentCourseRecordController.updateStudentCourseRecord);

// DELETE record
router.delete('/:id', studentCourseRecordController.deleteStudentCourseRecord);

module.exports = router; 