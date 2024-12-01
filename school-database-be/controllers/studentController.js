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

// Add new student
const addStudent = async (req, res) => {
  try {
    const { name, departmentId } = req.body;

    if (!name || !departmentId) {
      return res.status(400).json({ error: 'Name and departmentId are required' });
    }

    // Generate new student ID
    const studentId = await generateNewId();

    const newStudent = {
      studentId,
      name,
      departmentId,
      courses: [] // Initialize empty courses array
    };

    const docRef = await db.collection('Students').add(newStudent);
    res.status(201).json({ id: docRef.id, ...newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentId } = req.body;

    if (!name && !departmentId) {
      return res.status(400).json({ error: 'At least one field (name or departmentId) is required' });
    }

    const studentDoc = await db.collection('Students').doc(id).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (departmentId) updatedData.departmentId = departmentId;

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

// Register student for course
const registerStudentForCourse = async (req, res) => {
  try {
    const { studentId, courseId, advisorId } = req.body;

    if (!studentId || !courseId || !advisorId) {
      return res.status(400).json({ error: 'studentId, courseId, and advisorId are required' });
    }

    // Get student, advisor, and course details
    const [studentDoc, advisorDoc, courseDoc] = await Promise.all([
      db.collection('Students').doc(studentId).get(),
      db.collection('Advisor').doc(advisorId).get(),
      db.collection('Course').doc(courseId).get()
    ]);

    if (!studentDoc.exists || !advisorDoc.exists || !courseDoc.exists) {
      return res.status(404).json({ error: 'Student, advisor, or course not found' });
    }

    const student = studentDoc.data();
    const advisor = advisorDoc.data();

    if (student.departmentId !== advisor.departmentId) {
      return res.status(403).json({ error: 'Advisor can only register students from their department' });
    }

    // Check if student is already registered for this course
    const existingRegistration = await db.collection('StudentCourseRecord')
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingRegistration.empty) {
      return res.status(409).json({ error: 'Student is already registered for this course' });
    }

    const registration = {
      studentId,
      courseId,
      advisorId,
      registrationDate: new Date().toISOString()
    };

    const docRef = await db.collection('StudentCourseRecord').add(registration);
    res.status(201).json({ id: docRef.id, ...registration });
  } catch (error) {
    console.error('Error registering student for course:', error);
    res.status(500).json({ error: 'Failed to register student for course' });
  }
};

// Drop student from course
const dropStudentFromCourse = async (req, res) => {
  try {
    const { studentId, courseId, advisorId } = req.body;

    if (!studentId || !courseId || !advisorId) {
      return res.status(400).json({ error: 'studentId, courseId, and advisorId are required' });
    }

    // Get student and advisor details
    const [studentDoc, advisorDoc] = await Promise.all([
      db.collection('Students').doc(studentId).get(),
      db.collection('Advisor').doc(advisorId).get()
    ]);

    if (!studentDoc.exists || !advisorDoc.exists) {
      return res.status(404).json({ error: 'Student or advisor not found' });
    }

    const student = studentDoc.data();
    const advisor = advisorDoc.data();

    if (student.departmentId !== advisor.departmentId) {
      return res.status(403).json({ error: 'Advisor can only drop students from their department' });
    }

    const registrationSnapshot = await db.collection('StudentCourseRecord')
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();

    if (registrationSnapshot.empty) {
      return res.status(404).json({ error: 'Registration record not found' });
    }

    await registrationSnapshot.docs[0].ref.delete();
    res.status(200).json({ message: 'Student successfully dropped from course' });
  } catch (error) {
    console.error('Error dropping student from course:', error);
    res.status(500).json({ error: 'Failed to drop student from course' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  registerStudentForCourse,
  dropStudentFromCourse
};