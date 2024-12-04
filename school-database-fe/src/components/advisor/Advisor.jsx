import { useState } from 'react';
import NavBar from '../NavBar.jsx';

const Advisor = () => {
  const [departments] = useState(['Mechanical Engineering', 'Computer Engineering', 'Civil Engineering']);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const [courses] = useState([
    { id: 1, name: 'Thermodynamics', department: 'Mechanical Engineering', semester: 'Fall 2024' },
    { id: 2, name: 'Data Structures', department: 'Computer Engineering', semester: 'Spring 2024' },
    { id: 3, name: 'Structural Analysis', department: 'Civil Engineering', semester: 'Fall 2024' },
    { id: 4, name: 'Machine Learning', department: 'Computer Engineering', semester: 'Fall 2024' },
  ]);

  const [students] = useState([
    { name: 'Alice', major: 'Mechanical Engineering', gpa: 3.8 },
    { name: 'Bob', major: 'Computer Engineering', gpa: 3.2 },
    { name: 'Charlie', major: 'Civil Engineering', gpa: 3.5 },
    { name: 'Diana', major: 'Mechanical Engineering', gpa: 4.0 },
    { name: 'Eve', major: 'Computer Engineering', gpa: 3.9 },
  ]);

  const [selectedSemester, setSelectedSemester] = useState('All');

  const uniqueSemesters = ['All', ...new Set(courses.map(course => course.semester))];

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

  const filteredCourses = courses.filter((course) => {
    const isInDepartment = selectedDepartment === 'All' || course.department === selectedDepartment;
    const isInSemester = selectedSemester === 'All' || course.semester === selectedSemester;
    return isInDepartment && isInSemester;
  });

  const manageCourse = (course) => {
    alert(`Manage Course: ${course.name}`);
  };

  const addStudent = (course) => {
    alert(`Add Student to: ${course.name}`);
  };

  const dropStudent = (course) => {
    alert(`Drop Student from: ${course.name}`);
  };

  // Calculate GPA Summary
  const gpaSummary = departments.map((dept) => {
    const majors = students.filter(student => student.major === dept);
    const gpas = majors.map(student => student.gpa);
    const avgGpa = gpas.length ? (gpas.reduce((acc, gpa) => acc + gpa, 0) / gpas.length).toFixed(2) : 0;

    return {
      department: dept,
      avgGpa: parseFloat(avgGpa),
      highestGpa: Math.max(...gpas),
      lowestGpa: Math.min(...gpas),
      highestStudent: majors.find(student => student.gpa === Math.max(...gpas)),
      lowestStudent: majors.find(student => student.gpa === Math.min(...gpas)),
    };
  });

  const sortedSummary = gpaSummary.sort((a, b) => b.avgGpa - a.avgGpa);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">Advisor Dashboard</h1>

        {/* Department Filter Buttons */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Filter by Department</h2>
          <div className="flex gap-4">
            {['All', ...departments].map((dept, index) => (
              <button
                key={index}
                onClick={() => handleDepartmentClick(dept)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${selectedDepartment === dept ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Semester Filter Buttons */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Filter by Semester</h2>
          <div>
            {uniqueSemesters.map((semester) => (
              <button
                key={semester}
                onClick={() => handleSemesterClick(semester)}
                className={`mr-4 px-4 py-2 text-sm font-medium rounded-md ${selectedSemester === semester ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {semester}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{course.name}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <p className="text-gray-500 text-sm">Department: {course.department}</p>

              <button
                onClick={() => manageCourse(course)}
                className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-4"
              >
                Manage Course
              </button>
              <button
                onClick={() => addStudent(course)}
                className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-4"
              >
                Add Student
              </button>
              <button
                onClick={() => dropStudent(course)}
                className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-4"
              >
                Drop Student
              </button>
            </div>
          ))}
        </div>

        {/* GPA Summary Section */}
<div>
  <h2 className="text-xl font-semibold mb-6">GPA Summary</h2>
  {sortedSummary.map((dept) => (
    <div key={dept.department} className="mb-8">
      <h3 className="text-lg font-bold mb-4">
        Department: {dept.department} (Avg GPA: {dept.avgGpa})
      </h3>
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Major</th>
            <th className="border border-gray-300 px-4 py-2">Highest GPA</th>
            <th className="border border-gray-300 px-4 py-2">Lowest GPA</th>
            <th className="border border-gray-300 px-4 py-2">Average GPA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">{dept.department}</td>
            <td className="border border-gray-300 px-4 py-2">
              {dept.highestGpa} ({dept.highestStudent?.name || 'N/A'})
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {dept.lowestGpa} ({dept.lowestStudent?.name || 'N/A'})
            </td>
            <td className="border border-gray-300 px-4 py-2">{dept.avgGpa}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default Advisor;
