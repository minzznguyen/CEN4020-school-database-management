const db = require('../firebase');

// Get all majors
const getAllMajors = async (req, res) => {
  try {
    const snapshot = await db.collection('Major').get();
    const majors = [];
    snapshot.forEach(doc => {
      majors.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(majors);
  } catch (error) {
    console.error('Error fetching majors:', error);
    res.status(500).json({ error: 'Failed to fetch majors' });
  }
};

// Get major by ID
const getMajorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('Major').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Major not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching major:', error);
    res.status(500).json({ error: 'Failed to fetch major' });
  }
};

// Create new major
const createMajor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const majorsSnapshot = await db.collection('Major').get();
    const nextId = (majorsSnapshot.size + 1).toString();

    const newMajor = {
      name,
      studentId: []
    };

    await db.collection('Major').doc(nextId).set(newMajor);

    res.status(201).json({
      message: 'Major created successfully',
      majorId: nextId,
      ...newMajor
    });
  } catch (error) {
    console.error('Error creating major:', error);
    res.status(500).json({ 
      error: 'Failed to create major',
      details: error.message 
    });
  }
};

// Update major
const updateMajor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const majorDoc = await db.collection('Major').doc(id).get();
    if (!majorDoc.exists) {
      return res.status(404).json({ error: 'Major not found' });
    }

    await db.collection('Major').doc(id).update({ name });
    res.status(200).json({ id, name });
  } catch (error) {
    console.error('Error updating major:', error);
    res.status(500).json({ error: 'Failed to update major' });
  }
};

// Delete major
const deleteMajor = async (req, res) => {
  try {
    const { id } = req.params;
    const majorDoc = await db.collection('Major').doc(id).get();
    
    if (!majorDoc.exists) {
      return res.status(404).json({ error: 'Major not found' });
    }

    // Check if there are students in this major
    const majorData = majorDoc.data();
    if (majorData.studentId && majorData.studentId.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete major with enrolled students' 
      });
    }

    await db.collection('Major').doc(id).delete();
    res.status(200).json({ message: 'Major deleted successfully' });
  } catch (error) {
    console.error('Error deleting major:', error);
    res.status(500).json({ error: 'Failed to delete major' });
  }
};

// Get GPA information for a major
const getOverallGPAInfo = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Get major document
      const majorDoc = await db.collection('Major').doc(id).get();
      if (!majorDoc.exists) {
        return res.status(404).json({ error: 'Major not found' });
      }
      const majorData = majorDoc.data();
  
      // Get all students in this major
      const studentIds = majorData.studentId || [];
      if (studentIds.length === 0) {
        return res.status(200).json({
          highestGPA: 0,
          lowestGPA: 0,
          averageGPA: 0,
          studentCount: 0
        });
      }
  
      // Calculate overall GPA for each student
      const studentGPAs = await Promise.all(studentIds.map(async (studentId) => {
        // Get all course records for this student
        const records = await db.collection('StudentCourseRecord')
          .where('studentId', '==', studentId)
          .get();
  
        if (records.empty) {
          return null;
        }
  
        // Calculate average GPA for this student
        let totalGPA = 0;
        let courseCount = 0;
        
        records.forEach(record => {
          const gpa = parseFloat(record.data().GPA);
          if (!isNaN(gpa)) {
            totalGPA += gpa;
            courseCount++;
          }
        });
  
        return courseCount > 0 ? totalGPA / courseCount : null;
      }));
  
      // Filter out null values and get valid GPAs
      const validGPAs = studentGPAs.filter(gpa => gpa !== null);
  
      if (validGPAs.length === 0) {
        return res.status(200).json({
          highestGPA: 0,
          lowestGPA: 0,
          averageGPA: 0,
          studentCount: studentIds.length,
          studentsWithGPA: 0
        });
      }
  
      // Calculate statistics
      const highestGPA = Math.max(...validGPAs);
      const lowestGPA = Math.min(...validGPAs);
      const averageGPA = validGPAs.reduce((a, b) => a + b, 0) / validGPAs.length;
  
      res.status(200).json({
        highestGPA: parseFloat(highestGPA.toFixed(2)),
        lowestGPA: parseFloat(lowestGPA.toFixed(2)),
        averageGPA: parseFloat(averageGPA.toFixed(2)),
        studentCount: studentIds.length,
        studentsWithGPA: validGPAs.length
      });
  
    } catch (error) {
      console.error('Error getting GPA info:', error);
      res.status(500).json({ 
        error: 'Failed to get GPA information',
        details: error.message 
      });
    }
  };

module.exports = {
  getOverallGPAInfo,
  getAllMajors,
  getMajorById,
  createMajor,
  updateMajor,
  deleteMajor
}; 