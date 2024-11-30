import { useState } from 'react';

const InstructorSummaryPage = () => {
  const [instructorCourses, setInstructorCourses] = useState([
    { courseName: 'Introduction to AI', studentsEnrolled: 120 },
    { courseName: 'Data Structures', studentsEnrolled: 80 },
  ]);

  const [gradingStatus, setGradingStatus] = useState([
    { courseName: 'Introduction to AI', pendingAssignments: 10, gradedAssignments: 100 },
    { courseName: 'Data Structures', pendingAssignments: 5, gradedAssignments: 75 },
  ]);

  const [attendanceTrends, setAttendanceTrends] = useState([
    { courseName: 'Introduction to AI', attendanceRate: '85%' },
    { courseName: 'Data Structures', attendanceRate: '90%' },
  ]);

  const [officeHours, setOfficeHours] = useState([
    { day: 'Monday', time: '10:00 AM - 12:00 PM' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Instructor Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Courses Taught */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Courses Taught</h2>
          <ul className="space-y-2">
            {instructorCourses.map((course, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{course.courseName}</span>
                <span className="text-sm">Students: {course.studentsEnrolled}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grading Status */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Grading Status</h2>
          <ul className="space-y-2">
            {gradingStatus.map((status, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{status.courseName}</span>
                <div className="text-sm">
                  Pending: {status.pendingAssignments} | Graded: {status.gradedAssignments}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Attendance Trends */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Trends</h2>
          <ul className="space-y-2">
            {attendanceTrends.map((course, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{course.courseName}</span>
                <span className="text-sm">Attendance: {course.attendanceRate}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Office Hours */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
          <ul className="space-y-2">
            {officeHours.map((hours, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{hours.day}</span>
                <span className="text-sm">{hours.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructorSummaryPage;
