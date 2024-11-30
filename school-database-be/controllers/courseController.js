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
        const { CourseId, name, departmentId, Classtime } = req.body;
        
        if (!CourseId || !name || !departmentId || !Classtime) {
            return res.status(400).json({ error: 'CourseId, name, departmentId, and Classtime are required' });
        }

        // Check for duplicate CourseId
        const courseIdSnapshot = await db.collection('Course')
            .where('CourseId', '==', CourseId)
            .get();

        if (!courseIdSnapshot.empty) {
            return res.status(409).json({ error: 'Course with this CourseId already exists' });
        }

        // Check for duplicate course name AND time windows
        const duplicateSnapshot = await db.collection('Course')
            .where('name', '==', name)
            .where('Classtime', '==', Classtime)
            .get();

        if (!duplicateSnapshot.empty) {
            return res.status(409).json({ 
                error: 'A course with the same name and time windows already exists'
            });
        }

        const newCourse = {
            CourseId,
            name,
            departmentId,
            Classtime
        };

        const docRef = await db.collection('Course').add(newCourse);
        res.status(201).json({ id: docRef.id, ...newCourse });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Failed to add course' });
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

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse
}; 