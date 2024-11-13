// index.js
const express = require('express');
const app = express();
const PORT = 3000;
const studentCourseRecordController = require('./controllers/studentCourseRecordController');

// Middleware to parse JSON requests
app.use(express.json());

// Define API routes
app.get('/records', studentCourseRecordController.getAllStudentCourseRecords);
app.get('/records/:id', studentCourseRecordController.getStudentCourseRecordById);
app.post('/records', studentCourseRecordController.addStudentCourseRecord);
app.put('/records/:id', studentCourseRecordController.updateStudentCourseRecord);
app.delete('/records/:id', studentCourseRecordController.deleteStudentCourseRecord);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
