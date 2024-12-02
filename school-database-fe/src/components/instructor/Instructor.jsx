import { useState } from 'react';
import NavBar from '../NavBar.jsx';

const Instructor = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Algo',
      description: 'An in-depth look at algorithms and data structures.',
      instructorName: 'John Doe',
      semester: 'Fall 2024',
    },
    {
      id: 2,
      name: 'Data Structures',
      description: 'Learn about arrays, lists, and trees.',
      instructorName: 'Jeff Doe',
      semester: 'Spring 2024',
    },
    {
      id: 3,
      name: 'Machine Learning',
      description: 'Introduction to Machine Learning concepts.',
      instructorName: 'Alice Smith',
      semester: 'Fall 2024',
    },
    {
      id: 4,
      name: 'Web Development',
      description: 'Full-stack web development with React and Node.',
      instructorName: 'Bob Brown',
      semester: 'Spring 2024',
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      major: 'Computer Science',
      gpa: 3.8,
      courses: [
        { name: 'Algo', semester: 'Fall 2024' },
        { name: 'Data Structures', semester: 'Spring 2024' },
      ],
    },
    {
      id: 2,
      name: 'John Smith',
      major: 'Biology',
      gpa: 3.5,
      courses: [
        { name: 'Machine Learning', semester: 'Fall 2024' },
        { name: 'Web Development', semester: 'Spring 2024' },
      ],
    },
    {
      id: 3,
      name: 'Alice Brown',
      major: 'Software Engineering',
      gpa: 4.0,
      courses: [
        { name: 'Machine Learning', semester: 'Fall 2024' },
        { name: 'Data Structures', semester: 'Spring 2024' },
      ],
    },
  ]);

  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedMajor, setSelectedMajor] = useState('All');

  // Get unique semesters from the courses list
  const uniqueSemesters = ['All', ...new Set(courses.map(course => course.semester))];

  // Get unique majors from the students list
  const uniqueMajors = ['All', ...new Set(students.map(student => student.major))];

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
  };

  const handleMajorClick = (major) => {
    setSelectedMajor(major);
  };

  // Filter courses based on selected semester
  const filteredCourses = courses.filter((course) => {
    return selectedSemester === 'All' || course.semester === selectedSemester;
  });

  // Filter students based on selected semester and major
  const filteredStudents = students.filter((student) => {
    const isInSemester = student.courses.some(course => selectedSemester === 'All' || course.semester === selectedSemester);
    const isInMajor = selectedMajor === 'All' || student.major === selectedMajor;
    return isInSemester && isInMajor;
  });

  const manageCourse = (course) => {
    alert(`Manage Course: ${course.name}\nInstructor: ${course.instructorName}`);
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>

        {/* Filter Buttons for Semester */}
        <div className="mb-6">
          <div className="mb-4">
            {uniqueSemesters.map((semester) => (
              <button
                key={semester}
                onClick={() => handleSemesterClick(semester)}
                className={`mr-4 px-4 py-2 text-sm font-medium rounded-md ${selectedSemester === semester ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {semester}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {course.name}
              </h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <button
                onClick={() => manageCourse(course)}
                className="btn-grad px-4 py-2 text-sm font-medium rounded-md"
              >
                Manage Course
              </button>
            </div>
          ))}
        </div>

        {/* Major Filter Buttons */}
        <div className="mt-12 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter by Major</h2>
          <div>
            {uniqueMajors.map((major) => (
              <button
                key={major}
                onClick={() => handleMajorClick(major)}
                className={`mr-4 px-4 py-2 text-sm font-medium rounded-md ${selectedMajor === major ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {major}
              </button>
            ))}
          </div>
        </div>

        {/* Students List Table with Drop Shadow */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Students List</h2>

          <table className="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-2 text-left">Name</th>
                <th className="px-6 py-2 text-left">Major</th>
                <th className="px-6 py-2 text-left">GPA</th>
                <th className="px-6 py-2 text-left">Courses</th>
                <th className="px-6 py-2 text-left">Semester</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.major}</td>
                  <td className="px-6 py-4">{student.gpa}</td>
                  <td className="px-6 py-4">
                    <ul>
                      {student.courses.map((course, idx) => (
                        <li key={idx}>
                          {course.name} ({course.semester})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    {student.courses
                      .filter(course => selectedSemester === 'All' || course.semester === selectedSemester)
                      .map((course, idx) => (
                        <div key={idx}>{course.semester}</div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
