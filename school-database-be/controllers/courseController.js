const db = require('../firebase');

const getAllCourses = async (req, res) => {
  try {
    const snapshot = await db.collection('Course').get();
    const courses = [];
    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('Course').doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Course not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

const addCourse = async (req, res) => {
  try {
    const {
      courseId,
      name,
      courseDesc,
      departmentId,
      instructorId,
      semester,
      Classtime
    } = req.body;

    // Validate required fields
    if (!courseId || !name || !courseDesc || !departmentId || 
        !instructorId || !semester || !Classtime || !Array.isArray(Classtime)) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: {
          courseId: 'string',
          name: 'string',
          courseDesc: 'string',
          departmentId: 'string',
          instructorId: 'string',
          semester: 'string',
          Classtime: 'array of strings'
        }
      });
    }

    // Check for duplicate courseId
    const existingCourse = await db.collection('Course')
      .where('courseId', '==', courseId)
      .get();

    if (!existingCourse.empty) {
      return res.status(409).json({ error: 'Course ID already exists' });
    }

    // Create new course with all required fields
    const newCourse = {
      courseId,
      name,
      courseDesc,
      departmentId,
      instructorId,
      semester,
      Classtime,
      studentCourseRecord: []  // Initialize empty array for student records
    };

    // Add the course with a specific ID (using courseId as document ID)
    await db.collection('Course').doc(courseId).set(newCourse);

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      error: 'Failed to create course',
      details: error.message 
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, Classtime } = req.body;

    if (!name && !Classtime) {
      return res.status(400).json({ error: 'At least one field (name or Classtime) is required' });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (Classtime) updatedData.Classtime = Classtime;

    await db.collection('Course').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('Course').doc(id).delete();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const { id } = req.params;
    
    const studentRecordsSnapshot = await db.collection('StudentCourseRecord')
      .where('CourseId', '==', id)
      .get();

    if (studentRecordsSnapshot.empty) {
      return res.status(200).json([]);
    }

    const studentsPromises = studentRecordsSnapshot.docs.map(async (record) => {
      const recordData = record.data();
      const studentId = recordData.studentId;
      const studentDoc = await db.collection('Students').doc(studentId).get();
      
      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        const majorDoc = await db.collection('Major').doc(studentData.majorId).get();
        const majorName = majorDoc.exists ? majorDoc.data().majorName : 'Unknown';
        
        return {
          name: studentData.name,
          major: majorName,
          gpa: recordData.GPA
        };
      }
      return null;
    });

    const students = (await Promise.all(studentsPromises)).filter(student => student !== null);
    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course students' });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    // Get course details
    const courseDoc = await db.collection('Course').doc(id).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const courseData = courseDoc.data();

    // Check if student exists
    const studentDoc = await db.collection('Students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const studentData = studentDoc.data();

    // Check if enrollment already exists
    const existingEnrollment = await db.collection('StudentCourseRecord')
      .where('CourseId', '==', id)
      .where('studentId', '==', studentId)
      .get();

    if (!existingEnrollment.empty) {
      return res.status(409).json({ error: 'Student is already enrolled in this course' });
    }

    // Get all records to determine the next ID
    const allRecordsSnapshot = await db.collection('StudentCourseRecord').get();
    const nextId = (allRecordsSnapshot.size + 1).toString();

    // Create new StudentCourseRecord
    const newRecord = {
      CourseId: id,
      studentId: studentId,
      instructorId: courseData.instructorId,
      GPA: "0.0"
    };

    // Add the record with the sequential ID
    await db.collection('StudentCourseRecord').doc(nextId).set(newRecord);

    // Update the Course document's studentCourseRecord array
    await db.collection('Course').doc(id).update({
      studentCourseRecord: [...(courseData.studentCourseRecord || []), nextId]
    });

    // Update the Student document's studentCourseRecord array
    await db.collection('Students').doc(studentId).update({
      studentCourseRecord: [...(studentData.studentCourseRecord || []), nextId]
    });

    res.status(201).json({
      message: 'Student enrolled successfully',
      recordId: nextId,
      ...newRecord
    });

  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ 
      error: 'Failed to enroll student',
      details: error.message 
    });
  }
};

const unenrollStudent = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    // Get course details
    const courseDoc = await db.collection('Course').doc(id).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const courseData = courseDoc.data();

    // Get student details
    const studentDoc = await db.collection('Students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const studentData = studentDoc.data();

    // Find the enrollment record
    const enrollmentSnapshot = await db.collection('StudentCourseRecord')
      .where('CourseId', '==', id)
      .where('studentId', '==', studentId)
      .get();

    if (enrollmentSnapshot.empty) {
      return res.status(404).json({ error: 'Enrollment record not found' });
    }

    // Get the record ID to be deleted
    const recordId = enrollmentSnapshot.docs[0].id;

    // Delete the StudentCourseRecord
    await db.collection('StudentCourseRecord').doc(recordId).delete();

    // Update Course's studentCourseRecord array
    const updatedCourseRecords = courseData.studentCourseRecord.filter(
      record => record !== recordId
    );
    await db.collection('Course').doc(id).update({
      studentCourseRecord: updatedCourseRecords
    });

    // Update Student's studentCourseRecord array
    const updatedStudentRecords = studentData.studentCourseRecord.filter(
      record => record !== recordId
    );
    await db.collection('Students').doc(studentId).update({
      studentCourseRecord: updatedStudentRecords
    });

    res.status(200).json({
      message: 'Student unenrolled successfully',
      deletedRecordId: recordId
    });

  } catch (error) {
    console.error('Error unenrolling student:', error);
    res.status(500).json({ 
      error: 'Failed to unenroll student',
      details: error.message 
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  enrollStudent,
  unenrollStudent
}; 