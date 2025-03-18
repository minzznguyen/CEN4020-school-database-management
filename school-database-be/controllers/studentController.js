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

// Get student's overall GPA
const getStudentGPA = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const studentRef = await db.collection('Students').doc(studentId).get();
    if (!studentRef.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const studentData = studentRef.data();
    const recordIds = studentData.studentCourseRecord || [];

    let totalGPA = 0;
    let validCourses = 0;

    await Promise.all(recordIds.map(async (recordId) => {
      const recordRef = await db.collection('StudentCourseRecord').doc(recordId).get();
      if (recordRef.exists) {
        const recordData = recordRef.data();
        if (recordData.GPA) {
          totalGPA += parseFloat(recordData.GPA);
          validCourses++;
        }
      }
    }));

    const overallGPA = validCourses > 0 ? (totalGPA / validCourses).toFixed(2) : 0;
    res.status(200).json({ overallGPA: parseFloat(overallGPA) });

  } catch (error) {
    console.error('Error calculating GPA:', error);
    res.status(500).json({ error: 'Failed to calculate GPA' });
  }
};

// Get student's course information
const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const studentRef = await db.collection('Students').doc(studentId).get();
    if (!studentRef.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentData = studentRef.data();
    const recordIds = studentData.studentCourseRecord || [];

    const courseDetails = await Promise.all(recordIds.map(async (recordId) => {
      const recordRef = await db.collection('StudentCourseRecord').doc(recordId).get();
      if (!recordRef.exists) return null;

      const recordData = recordRef.data();
      const courseRef = await db.collection('Course').doc(recordData.courseId).get();
      if (!courseRef.exists) return null;

      const courseData = courseRef.data();
      const instructorRef = await db.collection('Instructor')
        .doc(courseData.instructorId).get();
      const instructorData = instructorRef.exists ? instructorRef.data() : { name: 'Unknown' };

      return {
        courseName: courseData.name,
        GPA: recordData.GPA,
        desc: courseData.courseDesc,
        instructorName: instructorData.name,
        semester: courseData.semester
      };
    }));

    res.status(200).json(courseDetails.filter(course => course !== null));

  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'Failed to fetch student courses' });
  }
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const { name, majorId, newId } = req.body;

    if (!name || !majorId || !newId) {
      console.log('Request Body:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const studentSnapshot = await db.collection('Students')
      .where('newId', '==', newId)
      .get();

    if (!studentSnapshot.empty) {
      return res.status(409).json({ error: 'Advisor with this AdvisorId already exists' });
    }



    const newStudent = {
      name,
      majorId,
      studentId: newId,
      studentCourseRecord: [],
      departmentId: "1" // Default department ID
    };

    // Add student document
    await db.collection('Students').doc(newId).set(newStudent);

    // Update Major's studentId array
    const majorDoc = await db.collection('Major').doc(majorId).get();
    if (!majorDoc.exists) {
      return res.status(404).json({ error: 'Major not found' });
    }

    await db.collection('Major').doc(majorId).update({
      studentId: [...(majorDoc.data().studentId || []), newId]
    });

    res.status(201).json({
      message: 'Student created successfully',
      studentId: newId,
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
    if (majorId) {
      updatedData.majorId = majorId;
      
      // Update old major's studentId array
      const oldMajorId = studentDoc.data().majorId;
      if (oldMajorId) {
        const oldMajorDoc = await db.collection('Major').doc(oldMajorId).get();
        if (oldMajorDoc.exists) {
          const oldStudentIds = oldMajorDoc.data().studentId || [];
          await db.collection('Major').doc(oldMajorId).update({
            studentId: oldStudentIds.filter(sId => sId !== id)
          });
        }
      }

      // Update new major's studentId array
      const newMajorDoc = await db.collection('Major').doc(majorId).get();
      if (newMajorDoc.exists) {
        await db.collection('Major').doc(majorId).update({
          studentId: [...(newMajorDoc.data().studentId || []), id]
        });
      }
    }

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

    // Remove student from major's studentId array
    const majorId = studentDoc.data().majorId;
    if (majorId) {
      const majorDoc = await db.collection('Major').doc(majorId).get();
      if (majorDoc.exists) {
        const studentIds = majorDoc.data().studentId || [];
        await db.collection('Major').doc(majorId).update({
          studentId: studentIds.filter(sId => sId !== id)
        });
      }
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
  getStudentGPA,
  getStudentCourses,
  createStudent,
  updateStudent,
  deleteStudent
};