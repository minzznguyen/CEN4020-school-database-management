import { useState } from 'react';

const StudentSummaryPage = () => {
  const [studentGpa, setStudentGpa] = useState({
    overallGpa: 3.6,
    semesterGpa: [
      { semester: 'Fall 2024', gpa: 3.8 },
      { semester: 'Spring 2024', gpa: 3.5 },
    ],
  });
  const [enrolledCourses, setEnrolledCourses] = useState([
    { courseId: 1, courseName: 'Algorithms', instructor: 'Dr. Smith', grade: 'A-', credits: 3 },
    { courseId: 2, courseName: 'Linear Algebra', instructor: 'Dr. Lee', grade: 'B+', credits: 3 },
  ]);
  const [academicProgress, setAcademicProgress] = useState({
    totalCredits: 75,
    requiredCredits: 120,
  });
  const [feedbackFromInstructors, setFeedbackFromInstructors] = useState([
    { course: 'Data Structures', instructor: 'Dr. Smith', feedback: 'Excellent performance and participation.' },
    { course: 'Operating Systems', instructor: 'Dr. Lee', feedback: 'Keep improving on project deadlines.' },
  ]);

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

        {/* Enrolled Courses */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
          <ul className="space-y-2">
            {enrolledCourses.map((course, index) => (
              <li key={index} className="flex flex-col space-y-1">
                <span className="font-medium">{course.courseName} ({course.credits} credits)</span>
                <span className="text-sm">Instructor: {course.instructor}</span>
                <span className="text-sm">Grade: {course.grade}</span>
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

        {/* Feedback from Instructors */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Instructor Feedback</h2>
          <ul className="space-y-2">
            {feedbackFromInstructors.map((feedback, index) => (
              <li key={index} className="flex flex-col space-y-1">
                <span className="font-medium">{feedback.course}</span>
                <span className="text-sm">Instructor: {feedback.instructor}</span>
                <p className="text-sm italic">"{feedback.feedback}"</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentSummaryPage;
