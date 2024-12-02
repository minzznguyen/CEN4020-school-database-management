// index.js
const express = require('express');
const app = express();
const PORT = 3001;
const studentCourseRecordController = require('./controllers/studentCourseRecordController');
const departmentRoutes = require('./routes/departmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const advisorRoutes = require('./routes/advisorRoutes');

// Middleware to parse JSON requests
app.use(express.json());

// Mount routes
app.use('/departments', departmentRoutes);
app.use('/records', recordRoutes);
app.use('/courses', courseRoutes);
app.use('/students', studentRoutes);
app.use('/advisors', advisorRoutes);

// Test API endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
