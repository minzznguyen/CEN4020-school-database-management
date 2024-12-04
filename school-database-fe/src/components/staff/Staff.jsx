import { useState } from 'react';
import NavBar from '../NavBar.jsx';

const Staff = () => {
  const staffDepartment = 'Computer Engineering'; // Fixed department for staff
  const [courses, setCourses] = useState([
    { id: 1, name: 'Data Structures', instructor: '', department: 'Computer Engineering' },
    { id: 2, name: 'Machine Learning', instructor: '', department: 'Computer Engineering' },
  ]);
  const [instructors, setInstructors] = useState([
    { id: 1, name: 'Dr. Johnson', department: 'Computer Engineering', role: 'Instructor' },
  ]);
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice', department: 'Computer Engineering', courses: ['Data Structures'] },
    { id: 2, name: 'Bob', department: 'Computer Engineering', courses: ['Machine Learning'] },
  ]);

  const [newCourse, setNewCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [roleFilter, setRoleFilter] = useState('All'); // Role filter state

  const handleAddCourse = () => {
    if (!newCourse) {
      alert('Please provide a course name.');
      return;
    }
    setCourses([
      ...courses,
      { id: courses.length + 1, name: newCourse, instructor: '', department: staffDepartment },
    ]);
    setNewCourse('');
  };

  const handleRemoveCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const handleAssignInstructor = (courseId, instructorId) => {
    const instructor = instructors.find((inst) => inst.id === instructorId);
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, instructor: instructor ? instructor.name : '' }
          : course
      )
    );
  };

  const filteredMembers = [...instructors, ...students].filter((member) => {
    if (roleFilter === 'All') return member.department === staffDepartment;
    return member.role === roleFilter && member.department === staffDepartment;
  });

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard - {staffDepartment}</h1>

        {/* Add Course Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Add Course</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md w-2/3"
            />
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add Course
            </button>
          </div>
        </div>

        {/* Courses List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Manage Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{course.name}</h2>
                <p className="text-gray-600 mb-4">
                  Instructor: {course.instructor || 'Not Assigned'}
                </p>
                <button
                  onClick={() => handleRemoveCourse(course.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md mb-4"
                >
                  Remove Course
                </button>
                <select
                  value={selectedInstructor}
                  onChange={(e) => handleAssignInstructor(course.id, parseInt(e.target.value))}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full"
                >
                  <option value="">Assign Instructor</option>
                  {instructors
                    .filter((inst) => inst.department === staffDepartment)
                    .map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor and Student Table Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Manage Staff and Students</h2>

          {/* Filter by Role */}
          <div className="mb-4">
            <button
              onClick={() => setRoleFilter('All')}
              className={`px-4 py-2 mr-4 ${roleFilter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setRoleFilter('Instructor')}
              className={`px-4 py-2 mr-4 ${roleFilter === 'Instructor' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Instructors
            </button>
            <button
              onClick={() => setRoleFilter('Student')}
              className={`px-4 py-2 ${roleFilter === 'Student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Students
            </button>
          </div>

          {/* Table for displaying instructors and students */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Courses</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.role}</td>
                    <td className="px-4 py-2">
                      {member.role === 'Instructor'
                        ? courses
                            .filter((course) => course.instructor === member.name)
                            .map((course) => course.name)
                            .join(', ')
                        : member.courses.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
