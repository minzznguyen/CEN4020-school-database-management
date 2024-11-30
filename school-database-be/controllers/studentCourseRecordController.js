// controllers/studentCourseRecordController.js
const db = require('../firebase');

// Fetch all documents from StudentCourseRecord collection
const getAllStudentCourseRecords = async (req, res) => {
  try {
    const snapshot = await db.collection('StudentCourseRecord').get();
    const records = [];
    snapshot.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

// Fetch a specific document by ID
const getStudentCourseRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('StudentCourseRecord').doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
};

// Add a new document to the StudentCourseRecord collection
const addStudentCourseRecord = async (req, res) => {
  try {
    const newRecord = req.body;
    const docRef = await db.collection('StudentCourseRecord').add(newRecord);
    res.status(201).json({ id: docRef.id, ...newRecord });
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ error: 'Failed to add record' });
  }
};

// Update an existing document by ID
const updateStudentCourseRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    await db.collection('StudentCourseRecord').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
};

// Delete a document by ID
const deleteStudentCourseRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('StudentCourseRecord').doc(id).delete();
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
};

module.exports = {
  getAllStudentCourseRecords,
  getStudentCourseRecordById,
  addStudentCourseRecord,
  updateStudentCourseRecord,
  deleteStudentCourseRecord,
};
