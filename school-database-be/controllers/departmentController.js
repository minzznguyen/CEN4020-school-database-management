const db = require('../firebase');


// Fetch all departments
const getAllDepartments = async (req, res) => {
  console.log('getAllDepartments called');
  try {
    console.log('Attempting to fetch departments from collection');
    const snapshot = await db.collection('Department').get();
    console.log('Snapshot received:', snapshot);
    
    const departments = [];
    snapshot.forEach(doc => {
      console.log('Processing document:', doc.id);
      departments.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Departments processed:', departments);
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Fetch a specific department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('Department').doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Department not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

// Add a new department
const addDepartment = async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const { Name } = req.body;
    console.log('Name:', Name);
    
    if (!Name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Get count of existing departments for new ID
    const departmentsSnapshot = await db.collection('Department').get();
    const DepartmentId = (departmentsSnapshot.size + 1).toString();

    // Check for duplicate DepartmentId
    const deptIdSnapshot = await db.collection('Department')
      .where('DepartmentId', '==', DepartmentId)
      .get();

    if (!deptIdSnapshot.empty) {
      return res.status(409).json({ error: 'Department with this DepartmentId already exists' });
    }

    // Check for duplicate Name
    const deptNameSnapshot = await db.collection('Department')
      .where('Name', '==', Name)
      .get();

    if (!deptNameSnapshot.empty) {
      return res.status(409).json({ error: 'Department with this Name already exists' });
    }

    const newDepartment = {
      DepartmentId,
      Name
    };

    const docRef = await db.collection('Department').add(newDepartment);
    res.status(201).json({ id: docRef.id, ...newDepartment });
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ error: 'Failed to add department' });
  }
};

// Update an existing department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;

    if (!Name) {
      return res.status(400).json({ error: 'Department Name is required' });
    }

    const updatedData = { Name };
    await db.collection('Department').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('Department').doc(id).delete();
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

// Get all majors in a department
const getDepartmentMajors = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if department exists
    const departmentDoc = await db.collection('Department').doc(id).get();
    if (!departmentDoc.exists) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Get majorId array from department
    const departmentData = departmentDoc.data();
    const majorIds = departmentData.majorId || [];

    if (majorIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get all majors whose IDs are in the majorId array
    const majors = [];
    for (const majorId of majorIds) {
      const majorDoc = await db.collection('Major').doc(majorId).get();
      if (majorDoc.exists) {
        majors.push({ 
          id: majorDoc.id,
          name: majorDoc.data().majorName  // Changed from name to majorName
        });
      }
    }

    res.status(200).json(majors);
  } catch (error) {
    console.error('Error fetching department majors:', error);
    res.status(500).json({ error: 'Failed to fetch department majors' });
  }
};

// Get overall GPA for a department
const getDepartmentGPA = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Get department and check if it exists
    const departmentDoc = await db.collection('Department').doc(id).get();
    if (!departmentDoc.exists) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // 2. Get all majors in this department
    const departmentData = departmentDoc.data();
    const majorIds = departmentData.majorId || [];

    if (majorIds.length === 0) {
      return res.status(200).json({ value: 0 });
    }

    let totalStudentGPA = 0;
    let totalStudentsWithGPA = 0;

    // 3. For each major, get its students
    for (const majorId of majorIds) {
      const majorDoc = await db.collection('Major').doc(majorId).get();
      if (!majorDoc.exists) continue;

      const majorData = majorDoc.data();
      const studentIds = majorData.studentId || [];

      // 4. For each student, calculate their GPA
      for (const studentId of studentIds) {
        // Get all course records for this student
        const records = await db.collection('StudentCourseRecord')
          .where('studentId', '==', studentId)
          .get();

        if (!records.empty) {
          let studentTotalGPA = 0;
          let courseCount = 0;

          // Calculate average GPA for this student
          records.forEach(record => {
            const gpa = parseFloat(record.data().GPA);
            if (!isNaN(gpa)) {
              studentTotalGPA += gpa;
              courseCount++;
            }
          });

          if (courseCount > 0) {
            totalStudentGPA += (studentTotalGPA / courseCount);
            totalStudentsWithGPA++;
          }
        }
      }
    }

    // 5. Calculate department-wide average
    const departmentGPA = totalStudentsWithGPA > 0 
      ? totalStudentGPA / totalStudentsWithGPA 
      : 0;

    res.status(200).json({ 
      value: parseFloat(departmentGPA.toFixed(2)) 
    });

  } catch (error) {
    console.error('Error calculating department GPA:', error);
    res.status(500).json({ 
      error: 'Failed to calculate department GPA',
      details: error.message 
    });
  }
};

// Get all departments sorted by GPA
const getHighestGPADepartments = async (req, res) => {
  try {
    // 1. Get all departments
    const departmentsSnapshot = await db.collection('Department').get();
    if (departmentsSnapshot.empty) {
      return res.status(200).json([]);
    }

    // 2. Calculate GPA for each department
    const departmentsWithGPA = await Promise.all(
      departmentsSnapshot.docs.map(async (doc) => {
        const departmentData = doc.data();
        const majorIds = departmentData.majorId || [];
        let totalStudentGPA = 0;
        let totalStudentsWithGPA = 0;

        // Process each major in the department
        for (const majorId of majorIds) {
          const majorDoc = await db.collection('Major').doc(majorId).get();
          if (!majorDoc.exists) continue;

          const majorData = majorDoc.data();
          const studentIds = majorData.studentId || [];

          // Process each student in the major
          for (const studentId of studentIds) {
            const records = await db.collection('StudentCourseRecord')
              .where('studentId', '==', studentId)
              .get();

            if (!records.empty) {
              let studentTotalGPA = 0;
              let courseCount = 0;

              records.forEach(record => {
                const gpa = parseFloat(record.data().GPA);
                if (!isNaN(gpa)) {
                  studentTotalGPA += gpa;
                  courseCount++;
                }
              });

              if (courseCount > 0) {
                totalStudentGPA += (studentTotalGPA / courseCount);
                totalStudentsWithGPA++;
              }
            }
          }
        }

        // Calculate department GPA
        const gpa = totalStudentsWithGPA > 0 
          ? parseFloat((totalStudentGPA / totalStudentsWithGPA).toFixed(2))
          : 0;

        return {
          id: departmentData.DepartmentId,
          name: departmentData.Name,
          gpa: gpa
        };
      })
    );

    // 3. Sort departments by GPA in descending order
    const sortedDepartments = departmentsWithGPA.sort((a, b) => b.gpa - a.gpa);

    res.status(200).json(sortedDepartments);

  } catch (error) {
    console.error('Error getting departments by GPA:', error);
    res.status(500).json({
      error: 'Failed to get departments by GPA',
      details: error.message 
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentMajors,
  getDepartmentGPA,
  getHighestGPADepartments
}; 