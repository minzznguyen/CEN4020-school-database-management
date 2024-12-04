import { useState } from 'react';
import NavBar from './NavBar.jsx';

const BaseHome = ({ userRole, permissions }) => {

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Course 1',
      description: 'Description of Course 1',
      courseID: 'C001',
      instructorID: 'I001',
      semester: 'Fall 2024',
    },
    {
      id: 2,
      name: 'Course 2',
      description: 'Description of Course 2',
      courseID: 'C002',
      instructorID: 'I002',
      semester: 'Spring 2024',
    },
  ]);

  const [activeMenu, setActiveMenu] = useState(null);

  // Example handler for buttons
  const viewInformation = (course) => {
    alert(`Course Info:\nCourse ID: ${course.courseID}\nInstructor ID: ${course.instructorID}\nSemester: ${course.semester}`);
    setActiveMenu(null);
  };

  const handleModifyCourse = (course) => {
    alert(`Modify Course:\n${course.name}`);
  };

  const handleAddStudent = () => {
    alert('Add Student functionality here');
  };

  const handleManageInstructors = () => {
    alert('Manage Instructors functionality here');
  };

  const handleManageDepartment = () => {
    alert('Manage Department functionality here');
  };

  const handleDropStudent = () => {
    alert('Drop Student from Course functionality here');
  };

  const handleAddInstructor = () => {
    alert('Add Instructor functionality here');
  };

  return (
    <div>
      <NavBar userRole = {userRole}/>
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">{userRole} Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {course.name}
              </h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              {permissions.canViewDetails && (
                <button
                  onClick={() => viewInformation(course)}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md"
                >
                  View Information
                </button>
              )}
              {permissions.canModifyCourses && (
                <button
                  onClick={() => handleModifyCourse(course)}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
                >
                  Modify Course
                </button>
              )}
              {permissions.canAddStudents && (
                <button
                  onClick={handleAddStudent}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
                >
                  Add Student
                </button>
              )}
              {permissions.canDropStudents && (
                <button
                  onClick={handleDropStudent}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
                >
                  Drop Student
                </button>
              )}
              {permissions.canManageInstructors && (
                <button
                  onClick={handleManageInstructors}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
                >
                  Manage Instructors
                </button>
              )}
              {permissions.canAddInstructors && (
                <button
                  onClick={handleAddInstructor}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
                >
                  Add Instructor
                </button>
              )}
              {/* {permissions.canManageDepartment && (
                <button
                  onClick={handleManageDepartment}
                  className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
                >
                  Manage Department
                </button>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseHome;


/**
 * GET /api/courses
 * Fetches all the courses from the database.
 * - HTTP Method: GET
 * - Request: None
 * - Response: Array of course objects, e.g.,
 *   [
 *     { id: 1, name: "Course 1", description: "Description", courseID: "C001", instructorID: "I001", semester: "Fall 2024" },
 *     ...
 *   ]
 */

/**
 * POST /api/courses
 * Adds a new course to the database.
 * - HTTP Method: POST
 * - Request Body: JSON object with the following structure:
 *   {
 *     "name": "Course Name",
 *     "description": "Course Description",
 *     "courseID": "C001",
 *     "instructorID": "I001",
 *     "semester": "Fall 2024"
 *   }
 * - Response: Newly created course object with an auto-generated ID.
 */

/**
 * DELETE /api/courses/:id
 * Deletes a course from the database based on its ID.
 * - HTTP Method: DELETE
 * - Request Parameter: `id` (Course ID to be deleted)
 * - Response: A success message or the deleted course object.
 */

/**
 * POST /api/courses/:id/students
 * Adds a student to a specific course.
 * - HTTP Method: POST
 * - Request Parameter: `id` (Course ID to which the student is added)
 * - Request Body: JSON object with student details (modify as needed for your use case):
 *   {
 *     "studentName": "Student Name",
 *     "studentID": "S001",
 *   }
 * - Response: Success message or updated course object.
 */

/**
 * GET /api/courses/:id
 * Fetches detailed information about a specific course.
 * - HTTP Method: GET
 * - Request Parameter: `id` (Course ID)
 * - Response: Course object with details, e.g.,
 *   {
 *     "id": 1,
 *     "name": "Course 1",
 *     "description": "Description",
 *     "courseID": "C001",
 *     "instructorID": "I001",
 *     "semester": "Fall 2024",
 *     "students": [
 *       { "studentName": "John Doe", "studentID": "S001" },
 *       ...
 *     ]
 *   }
 */