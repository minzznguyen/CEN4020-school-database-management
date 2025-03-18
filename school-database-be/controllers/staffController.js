const db = require('../firebase');

class StaffController {
  // Create new course
  async createCourse(req, res) {
    try {
      const { name, courseDesc, semester, departmentId, classtime } = req.body;

      if (!name || !courseDesc || !semester || !departmentId || !classtime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get next course ID
      const coursesSnapshot = await db.collection('Course').get();
      const nextId = (coursesSnapshot.size + 1).toString();

      const newCourse = {
        name,
        courseDesc,
        semester,
        departmentId,
        courseId: nextId,
        classtime,
        instructorId: null,
        studentCourseRecord: [] // Initialize empty array for student records
      };

      await db.collection('Course').doc(nextId).set(newCourse);

      res.status(201).json({
        message: 'Course created successfully',
        courseId: nextId,
        ...newCourse
      });

    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  }

  // Delete course
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      
      const courseDoc = await db.collection('Course').doc(id).get();
      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Check for enrolled students
      const courseData = courseDoc.data();
      if (courseData.studentCourseRecord && courseData.studentCourseRecord.length > 0) {
        return res.status(400).json({ error: 'Cannot delete course with enrolled students' });
      }

      await db.collection('Course').doc(id).delete();
      res.status(200).json({ 
        message: 'Course deleted successfully',
        courseId: id
      });

    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  }

  // Update course
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, courseDesc, semester, classtime } = req.body;

      const courseDoc = await db.collection('Course').doc(id).get();
      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (courseDesc) updateData.courseDesc = courseDesc;
      if (semester) updateData.semester = semester;
      if (classtime) updateData.classtime = classtime;

      await db.collection('Course').doc(id).update(updateData);
      
      // Get updated course data
      const updatedCourse = await db.collection('Course').doc(id).get();
      
      res.status(200).json({
        message: 'Course updated successfully',
        courseId: id,
        ...updatedCourse.data()
      });

    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  }

  // Get list of instructors by department
  async getInstructorsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;

      const instructorsSnapshot = await db.collection('Instructor')
        .where('departmentId', '==', departmentId)
        .get();

      if (instructorsSnapshot.empty) {
        return res.status(200).json([]);
      }

      const instructors = [];
      instructorsSnapshot.forEach(doc => {
        const data = doc.data();
        instructors.push({
          id: doc.id,
          name: data.name,
          departmentId: data.departmentId
        });
      });

      res.status(200).json(instructors);

    } catch (error) {
      console.error('Error fetching instructors:', error);
      res.status(500).json({ error: 'Failed to fetch instructors' });
    }
  }

  // Assign instructor to course
  async assignInstructor(req, res) {
    try {
      const { id } = req.params;
      const { instructorId } = req.body;

      if (!instructorId) {
        return res.status(400).json({ error: 'Instructor ID is required' });
      }

      // Check if course exists
      const courseDoc = await db.collection('Course').doc(id).get();
      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Check if instructor exists
      const instructorDoc = await db.collection('Instructor').doc(instructorId).get();
      if (!instructorDoc.exists) {
        return res.status(404).json({ error: 'Instructor not found' });
      }

      // Verify instructor is from same department
      const courseData = courseDoc.data();
      const instructorData = instructorDoc.data();
      
      if (instructorData.departmentId !== courseData.departmentId) {
        return res.status(400).json({ 
          error: 'Instructor must be from the same department as the course' 
        });
      }

      await db.collection('Course').doc(id).update({
        instructorId: instructorId
      });

      // Get updated course data
      const updatedCourse = await db.collection('Course').doc(id).get();

      res.status(200).json({
        message: 'Instructor assigned successfully',
        courseId: id,
        ...updatedCourse.data()
      });

    } catch (error) {
      console.error('Error assigning instructor:', error);
      res.status(500).json({ error: 'Failed to assign instructor' });
    }
  }

  // Remove instructor from course
  async removeInstructor(req, res) {
    try {
      const { id } = req.params;

      const courseDoc = await db.collection('Course').doc(id).get();
      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const courseData = courseDoc.data();
      
      // Check if course has an instructor
      if (!courseData.instructorId) {
        return res.status(400).json({ error: 'Course does not have an assigned instructor' });
      }

      // Check for enrolled students
      if (courseData.studentCourseRecord && courseData.studentCourseRecord.length > 0) {
        return res.status(400).json({ 
          error: 'Cannot remove instructor from course with enrolled students' 
        });
      }

      await db.collection('Course').doc(id).update({
        instructorId: null
      });

      // Get updated course data
      const updatedCourse = await db.collection('Course').doc(id).get();

      res.status(200).json({ 
        message: 'Instructor removed from course successfully',
        courseId: id,
        ...updatedCourse.data()
      });

    } catch (error) {
      console.error('Error removing instructor:', error);
      res.status(500).json({ error: 'Failed to remove instructor' });
    }
  }
}

module.exports = new StaffController();