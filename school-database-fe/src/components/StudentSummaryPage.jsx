import { useState } from 'react';
import axios from 'axios';

// const gpa = await axios.get('http://localhost:3000/students/1/gpa');
// console.log(gpa);
const StudentSummaryPage = () => {
  const [studentGpa, setStudentGpa] = useState({
    overallGpa: 3.6,
    semesterGpa: [
      { semester: 'Fall 2024', gpa: 3.8 },
      { semester: 'Spring 2024', gpa: 3.5 },
      { semester: 'Fall 2023', gpa: 3.4 },
      { semester: 'Spring 2023', gpa: 3.6 },
      { semester: 'Fall 2022', gpa: 3.8 },
      { semester: 'Spring 2022', gpa: 3.5 },
      {semester: 'Fall 2021', gpa: 3.7}
    ],
  });

  const [academicProgress, setAcademicProgress] = useState({
    totalCredits: 75,
    requiredCredits: 120,
  });

// router.get('/:studentId/gpa', getStudentGPA);
// router.get('/:studentId/courses', getStudentCourses);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall and Semester GPA */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your GPA</h2>
          <p className="text-sm mb-2">Overall GPA: <span className="font-medium">{studentGpa.overallGpa}</span></p>
          <ul className="space-y-2">
            {studentGpa.semesterGpa.map((semester, index) => (
              <li key={index} className="flex justify-between">
                <span>{semester.semester}</span>
                <span className="text-sm">GPA: {semester.gpa}</span>
              </li>
            ))}
          </ul>
        </div>

        

        {/* Academic Progress */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Academic Progress</h2>
          <p className="text-sm">
            Credits Earned: <span className="font-medium">{academicProgress.totalCredits}</span> / {academicProgress.requiredCredits}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(academicProgress.totalCredits / academicProgress.requiredCredits) * 100}%` }}
            ></div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default StudentSummaryPage;