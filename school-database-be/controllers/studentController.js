const db = require('../firebase');

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
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// Add new student
const addStudent = async (req, res) => {
  try {
    const { StudentId, Name, departmentId } = req.body;

    if (!StudentId || !Name || !departmentId) {
      return res.status(400).json({ error: 'StudentId, Name, and departmentId are required' });
    }

    // Check for duplicate StudentId
    const studentSnapshot = await db.collection('Students')
      .where('StudentId', '==', StudentId)
      .get();

    if (!studentSnapshot.empty) {
      return res.status(409).json({ error: 'Student with this StudentId already exists' });
    }

    const newStudent = {
      StudentId,
      Name,
      departmentId
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
    const { Name } = req.body;

    if (!Name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedData = { Name };
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

    // Validate required fields
    if (!studentId || !courseId || !advisorId) {
      return res.status(400).json({ error: 'studentId, courseId, and advisorId are required' });
    }

    // Get student and advisor details
    const studentDoc = await db.collection('Students').doc(studentId).get();
    const advisorDoc = await db.collection('Advisor').doc(advisorId).get();
    const courseDoc = await db.collection('Course').doc(courseId).get();

    if (!studentDoc.exists || !advisorDoc.exists || !courseDoc.exists) {
      return res.status(404).json({ error: 'Student, advisor, or course not found' });
    }

    const student = studentDoc.data();
    const advisor = advisorDoc.data();
    const course = courseDoc.data();

    // Check if student and advisor are in the same department
    if (student.departmentId !== advisor.departmentId) {
      return res.status(403).json({ error: 'Advisor can only register students from their department' });
    }

    // Create new registration record
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

    // Validate required fields
    if (!studentId || !courseId || !advisorId) {
      return res.status(400).json({ error: 'studentId, courseId, and advisorId are required' });
    }

    // Get student and advisor details
    const studentDoc = await db.collection('Students').doc(studentId).get();
    const advisorDoc = await db.collection('Advisor').doc(advisorId).get();

    if (!studentDoc.exists || !advisorDoc.exists) {
      return res.status(404).json({ error: 'Student or advisor not found' });
    }

    const student = studentDoc.data();
    const advisor = advisorDoc.data();

    // Check if student and advisor are in the same department
    if (student.departmentId !== advisor.departmentId) {
      return res.status(403).json({ error: 'Advisor can only drop students from their department' });
    }

    // Find and delete the registration record
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