const db = require('../firebase');

// Get all advisors
const getAllAdvisors = async (req, res) => {
  try {
    const snapshot = await db.collection('Advisor').get();
    const advisors = [];
    snapshot.forEach(doc => {
      advisors.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(advisors);
  } catch (error) {
    console.error('Error fetching advisors:', error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
};

// Get advisor by ID
const getAdvisorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('Advisor').doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Advisor not found' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching advisor:', error);
    res.status(500).json({ error: 'Failed to fetch advisor' });
  }
};

// Add new advisor
const addAdvisor = async (req, res) => {
  try {
    const { AdvisorId, name, Departments } = req.body;

    if (!AdvisorId || !name || !Departments) {
      console.log('Request Body:', req.body);
      return res.status(400).json({ error: 'AdvisorId, name, and Departments are required' });
    }

    // Check for duplicate AdvisorId
    const advisorSnapshot = await db.collection('Advisor')
      .where('AdvisorId', '==', AdvisorId)
      .get();

    if (!advisorSnapshot.empty) {
      return res.status(409).json({ error: 'Advisor with this AdvisorId already exists' });
    }

    const newAdvisor = {
      AdvisorId,
      name,
      Departments
    };

    const docRef = await db.collection('Advisor').add(newAdvisor);
    res.status(201).json({ id: docRef.id, ...newAdvisor });
  } catch (error) {
    console.error('Error adding advisor:', error);
    res.status(500).json({ error: 'Failed to add advisor' });
  }
};

// Update advisor
const updateAdvisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, Departments } = req.body;

    if (!name && !Departments) {
      return res.status(400).json({ error: 'At least one field (name or Departments) is required' });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (Departments) updatedData.Departments = Departments;

    await db.collection('Advisor').doc(id).update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating advisor:', error);
    res.status(500).json({ error: 'Failed to update advisor' });
  }
};

// Delete advisor
const deleteAdvisor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('Advisor').doc(id).delete();
    res.status(200).json({ message: 'Advisor deleted successfully' });
  } catch (error) {
    console.error('Error deleting advisor:', error);
    res.status(500).json({ error: 'Failed to delete advisor' });
  }
};

module.exports = {
  getAllAdvisors,
  getAdvisorById,
  addAdvisor,
  updateAdvisor,
  deleteAdvisor
}; 