const db = require('../firebase');

// Helper function to generate new student ID
const generateNewId = async () => {
  const studentsRef = db.collection('Students');
  const snapshot = await studentsRef
    .orderBy('studentId', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return "1";
  }

  const highestId = snapshot.docs[0].data().studentId;
  return (parseInt(highestId) + 1).toString();
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const snapshot = await db.collection('Students').get();
    const students = [];
    snapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('Students').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const { name, majorId } = req.body;

    // Validate required fields
    if (!name || !majorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get all students to determine next ID
    const studentsSnapshot = await db.collection('Students').get();
    const nextId = (studentsSnapshot.size + 1).toString();

    // Create new student
    const newStudent = {
      name,
      majorId,
      studentCourseRecord: [],
    };

    // Add student document
    await db.collection('Students').doc(nextId).set(newStudent);

    // Update Major's studentId array
    const majorDoc = await db.collection('Major').doc(majorId).get();
    if (!majorDoc.exists) {
      return res.status(404).json({ error: 'Major not found' });
    }

    await db.collection('Major').doc(majorId).update({
      studentId: [...(majorDoc.data().studentId || []), nextId]
    });

    res.status(201).json({
      message: 'Student created successfully',
      studentId: nextId,
      ...newStudent
    });

  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ 
      error: 'Failed to create student',
      details: error.message 
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, majorId } = req.body;

    if (!name && !majorId) {
      return res.status(400).json({ error: 'At least one field (name or majorId) is required' });
    }

    const studentDoc = await db.collection('Students').doc(id).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (majorId) updatedData.majorId = majorId;

    await db.collection('Students').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentDoc = await db.collection('Students').doc(id).get();
    
    if (!studentDoc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await db.collection('Students').doc(id).delete();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};