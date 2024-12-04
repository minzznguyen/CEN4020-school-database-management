// controllers/instructorController.js
const db = require('../firebase');

// Helper function to generate new instructor ID
const generateNewId = async () => {
  const instructorsRef = db.collection('Instructor');
  const snapshot = await instructorsRef
    .orderBy('instructorId', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return "1";
  }

  const highestId = snapshot.docs[0].data().instructorId;
  return (parseInt(highestId) + 1).toString();
};

// Get all instructors
const getAllInstructors = async (req, res) => {
  try {
    const snapshot = await db.collection('Instructor').get();
    const instructors = [];
    snapshot.forEach(doc => {
      instructors.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
};

// Get instructor by ID
const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('Instructor').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching instructor:', error);
    res.status(500).json({ error: 'Failed to fetch instructor' });
  }
};

// Get instructor's courses
const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { semester } = req.query;

    const instructorRef = await db.collection('Instructor').doc(instructorId).get();
    if (!instructorRef.exists) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    let coursesQuery = db.collection('Course')
      .where('instructorId', '==', instructorId);
    
    if (semester) {
      coursesQuery = coursesQuery.where('semester', '==', semester);
    }

    const coursesSnapshot = await coursesQuery.get();
    const courses = [];

    coursesSnapshot.forEach(doc => {
      const data = doc.data();
      courses.push({
        courseId: doc.id,
        name: data.name,
        desc: data.courseDesc,
        semester: data.semester,
        classtime: data.classtime
      });
    });

    res.status(200).json(courses);

  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ error: 'Failed to fetch instructor courses' });
  }
};

// Get instructor's students
const getInstructorStudents = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { major } = req.query;

    // Get courses taught by instructor
    const coursesSnapshot = await db.collection('Course')
      .where('instructorId', '==', instructorId)
      .get();

    const courseIds = coursesSnapshot.docs.map(doc => doc.id);
    if (courseIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get student records for these courses
    const studentRecordsSnapshot = await db.collection('StudentCourseRecord')
      .where('courseId', 'in', courseIds)
      .get();

    // Get student details
    const studentsData = await Promise.all(
      studentRecordsSnapshot.docs.map(async (doc) => {
        const recordData = doc.data();
        const studentRef = await db.collection('Students').doc(recordData.studentId).get();
        if (!studentRef.exists) return null;

        const studentData = studentRef.data();
        // Skip if major filter is provided and doesn't match
        if (major && studentData.majorId !== major) return null;

        // Get major name
        const majorRef = await db.collection('Major').doc(studentData.majorId).get();
        const majorName = majorRef.exists ? majorRef.data().majorName : 'Unknown';

        // Get course name
        const courseRef = await db.collection('Course').doc(recordData.courseId).get();
        const courseName = courseRef.exists ? courseRef.data().name : 'Unknown';

        return {
          name: studentData.name,
          major: majorName,
          courseName: courseName,
          gpa: recordData.GPA
        };
      })
    );

    res.status(200).json(studentsData.filter(student => student !== null));

  } catch (error) {
    console.error('Error fetching instructor students:', error);
    res.status(500).json({ error: 'Failed to fetch instructor students' });
  }
};

// Create new instructor
const createInstructor = async (req, res) => {
  try {
    const { name, departmentId, newId } = req.body;

    if (!name || !departmentId || !newId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const instructorSnapshot = await db.collection('Instructor')
      .where('InstructorId', '==', newId)
      .get();

    if (!advisorSnapshot.empty) {
      return res.status(409).json({ error: 'Advisor with this AdvisorId already exists' });
    }


    const newInstructor = {
      name,
      departmentId,
      instructorId: newId,
      studentCourseRecord: []
    };

    await db.collection('Instructor').doc(newId).set(newInstructor);

    res.status(201).json({
      message: 'Instructor created successfully',
      instructorId: newId,
      ...newInstructor
    });

  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ 
      error: 'Failed to create instructor',
      details: error.message 
    });
  }
};

// Update instructor
const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentId } = req.body;

    if (!name && !departmentId) {
      return res.status(400).json({ error: 'At least one field (name or departmentId) is required' });
    }

    const instructorDoc = await db.collection('Instructor').doc(id).get();
    if (!instructorDoc.exists) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (departmentId) updatedData.departmentId = departmentId;

    await db.collection('Instructor').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({ error: 'Failed to update instructor' });
  }
};

// Delete instructor
const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorDoc = await db.collection('Instructor').doc(id).get();
    
    if (!instructorDoc.exists) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    // Check if instructor has any courses
    const coursesSnapshot = await db.collection('Course')
      .where('instructorId', '==', id)
      .get();

    if (!coursesSnapshot.empty) {
      return res.status(400).json({ 
        error: 'Cannot delete instructor with assigned courses. Please reassign or delete the courses first.' 
      });
    }

    await db.collection('Instructor').doc(id).delete();
    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
};

module.exports = {
  getAllInstructors,
  getInstructorById,
  getInstructorCourses,
  getInstructorStudents,
  createInstructor,
  updateInstructor,
  deleteInstructor
};
