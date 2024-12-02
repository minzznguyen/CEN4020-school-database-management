
import { useEffect, useState } from 'react';

const SummaryPage = () => {
  const [gpaByMajor, setGpaByMajor] = useState([
    { major: 'Computer Science', highestGpa: 4.0, lowestGpa: 2.5, averageGpa: 3.2 },
    { major: 'Mathematics', highestGpa: 3.9, lowestGpa: 2.8, averageGpa: 3.4 },
  ]);
  const [departmentGpaRankings, setDepartmentGpaRankings] = useState([
    { department: 'Engineering', averageGpa: 3.5 },
    { department: 'Arts', averageGpa: 3.1 },
  ]);
  const [courseEnrollments, setCourseEnrollments] = useState([
    { courseId: 1, courseName: 'Algorithms', semester: 'Fall 2024', totalEnrollments: 150, averageGrade: 'B+' },
    { courseId: 2, courseName: 'Linear Algebra', semester: 'Spring 2024', totalEnrollments: 120, averageGrade: 'A-' },
  ]);
  const [instructorStudentCount, setInstructorStudentCount] = useState([
    { instructorId: 1, instructorName: 'Dr. Smith', courseName: 'Data Structures', totalStudents: 80 },
    { instructorId: 2, instructorName: 'Dr. Lee', courseName: 'Operating Systems', totalStudents: 60 },
  ]);
  const [studentRankingByMajor, setStudentRankingByMajor] = useState([
    {
      major: 'Physics',
      students: [
        { studentId: 1, name: 'Alice', totalCredits: 120 },
        { studentId: 2, name: 'Bob', totalCredits: 110 },
      ],
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Summary Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GPA by Major */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">GPA by Major</h2>
          <ul className="space-y-2">
            {gpaByMajor.map((major, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{major.major}</span>
                <div className="text-sm">
                  <span>Highest: {major.highestGpa}</span> |{' '}
                  <span>Lowest: {major.lowestGpa}</span> |{' '}
                  <span>Average: {major.averageGpa}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Department GPA Rankings */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Department GPA Rankings</h2>
          <ul className="space-y-2">
            {departmentGpaRankings.map((dept, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{dept.department}</span>
                <span className="text-sm">Avg GPA: {dept.averageGpa}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Enrollments */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Course Enrollments</h2>
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2">Course</th>
                <th className="border border-gray-200 px-4 py-2">Semester</th>
                <th className="border border-gray-200 px-4 py-2">Enrollments</th>
                <th className="border border-gray-200 px-4 py-2">Avg Grade</th>
              </tr>
            </thead>
            <tbody>
              {courseEnrollments.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-200 px-4 py-2">{course.courseName}</td>
                  <td className="border border-gray-200 px-4 py-2">{course.semester}</td>
                  <td className="border border-gray-200 px-4 py-2">{course.totalEnrollments}</td>
                  <td className="border border-gray-200 px-4 py-2">{course.averageGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructor Student Count */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instructor Student Count</h2>
          <ul className="space-y-2">
            {instructorStudentCount.map((instructor, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{instructor.instructorName}</span>
                <span className="text-sm">{instructor.courseName} ({instructor.totalStudents} students)</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Student Ranking by Major */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Student Ranking by Major</h2>
          {studentRankingByMajor.map((major, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-lg mb-2">{major.major}</h3>
              <ul className="space-y-1">
                {major.students.map((student, index) => (
                  <li key={index} className="text-sm flex justify-between">
                    <span>{student.name}</span>
                    <span>Total Credits: {student.totalCredits}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
