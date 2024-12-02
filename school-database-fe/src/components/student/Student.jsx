import { useState, useEffect } from 'react';
import NavBar from '../NavBar.jsx';

// Function to convert GPA to letter grade
const convertGPAtoGrade = (gpa) => {
  if (gpa >= 3.7) return 'A';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D';
  return 'F'; // F for below 1.0 GPA
};

// Function to convert letter grade to grade points
const convertGradeToPoints = (grade) => {
  switch (grade) {
    case 'A':
    case 'S':
      return 4;
    case 'B':
      return 3;
    case 'C':
      return 2;
    case 'D':
      return 1;
    case 'F':
    case 'U':
    case 'I':
      return 0;
    default:
      return 0;
  }
};

// Function to calculate GPA from the course grades
const calculateGPA = (courses) => {
  const totalGradePoints = courses.reduce((acc, course) => {
    const grade = convertGPAtoGrade(course.GPA); // Get letter grade based on GPA
    return acc + convertGradeToPoints(grade);
  }, 0);
  return totalGradePoints / courses.length;
};

const Student = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Algo',
      description: 'Hello world',
      GPA: 4.0,
      instructorName: 'John Doe',
      semester: 'Fall 2024',
    },
    {
      id: 2,
      name: 'Data Structures',
      description: 'Hello world',
      GPA: 3.0,
      instructorName: 'Jeff Doe',
      semester: 'Spring 2024',
    },
    {
      id: 3,
      name: 'Machine Learning',
      description: 'Introduction to ML',
      GPA: 2.5,
      instructorName: 'Alice Smith',
      semester: 'Fall 2024',
    },
    {
      id: 4,
      name: 'Web Development',
      description: 'Learn full-stack web development',
      GPA: 3.7,
      instructorName: 'Bob Brown',
      semester: 'Spring 2024',
    },
  ]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState('');

  const viewInformation = (course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const filterBySemester = (semester) => {
    setSemesterFilter(semester);
    if (semester === '') {
      // If no filter is selected, show all courses
      setFilteredCourses(courses);
    } else {
      // Filter courses by the selected semester
      const filtered = courses.filter(course => course.semester === semester);
      setFilteredCourses(filtered);
    }
  };

  // Calculate GPA for filtered courses
  const gpa = filteredCourses.length > 0 ? calculateGPA(filteredCourses) : 0;

  // Calculate the average grade point of the filtered courses
  const averageGrade = convertGPAtoGrade(gpa);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

        {/* Filter Button and Dropdown */}
        <div className="mb-6">
          <button
            onClick={() => filterBySemester('Fall 2024')}
            className="btn-grad px-4 py-2 text-sm font-medium rounded-md mr-4"
          >
            Filter by Fall 2024
          </button>
          <button
            onClick={() => filterBySemester('Spring 2024')}
            className="btn-grad px-4 py-2 text-sm font-medium rounded-md"
          >
            Filter by Spring 2024
          </button>
          <button
            onClick={() => filterBySemester('')}
            className="btn-grad px-4 py-2 text-sm font-medium rounded-md ml-4"
          >
            Clear Filter
          </button>
        </div>

        {/* Display GPA Label */}
        <div className="mb-6">
          <p className="text-lg font-semibold">
            {semesterFilter ? `Semester GPA: ${gpa.toFixed(2)} (${averageGrade})` : `Overall GPA: ${gpa.toFixed(2)} (${averageGrade})`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-sm shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {course.name}
              </h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <button
                onClick={() => viewInformation(course)}
                className="btn-grad px-4 py-2 text-sm font-medium rounded-md"
              >
                View Information
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Course Information */}
      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{selectedCourse.name}</h2>
            <p className="text-gray-700">
              <strong>Course ID:</strong> {selectedCourse.id}
            </p>
            <p className="text-gray-700">
              <strong>Instructor:</strong> {selectedCourse.instructorName}
            </p>
            <p className="text-gray-700">
              <strong>Semester:</strong> {selectedCourse.semester}
            </p>
            <p className="text-gray-700">
              <strong>Grade:</strong> {convertGPAtoGrade(selectedCourse.GPA)}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {selectedCourse.description}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
