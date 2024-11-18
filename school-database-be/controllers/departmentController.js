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
    const { DepartmentId, Name } = req.body;
    console.log('DepartmentId:', DepartmentId);
    console.log('Name:', Name);
    
    if (!DepartmentId || !Name) {
      return res.status(400).json({ error: 'DepartmentId and Name are required' });
    }

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

module.exports = {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment
}; 