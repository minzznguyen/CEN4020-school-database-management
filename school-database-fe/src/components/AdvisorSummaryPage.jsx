import { useState } from 'react';

const AdvisorSummaryPage = () => {
  const [studentProgress, setStudentProgress] = useState([
    { studentName: 'Alice Johnson', creditsEarned: 110, creditsRequired: 120, graduationEligible: false },
    { studentName: 'Bob Smith', creditsEarned: 125, creditsRequired: 120, graduationEligible: true },
  ]);

  const [studentsAtRisk, setStudentsAtRisk] = useState([
    { studentName: 'Charlie Brown', currentGpa: 2.0, requiredGpa: 2.5 },
    { studentName: 'Daisy Lee', currentGpa: 2.1, requiredGpa: 2.5 },
  ]);

  const [coursePerformance, setCoursePerformance] = useState([
    { courseName: 'Introduction to AI', passRate: '85%', failRate: '15%', averageGrade: 'B' },
    { courseName: 'Calculus II', passRate: '78%', failRate: '22%', averageGrade: 'C+' },
  ]);

  const [adviseeAppointments, setAdviseeAppointments] = useState([
    { studentName: 'Emily Davis', appointmentDate: '2024-11-25', time: '10:00 AM' },
    { studentName: 'Frank Green', appointmentDate: '2024-11-26', time: '3:00 PM' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Advisor Summary Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Progress */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <ul className="space-y-2">
            {studentProgress.map((student, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{student.studentName}</span>
                <div className="text-sm">
                  <span>Credits: {student.creditsEarned}/{student.creditsRequired}</span>{' '}
                  |{' '}
                  <span>
                    Graduation: {student.graduationEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Students at Risk */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Students at Risk</h2>
          <ul className="space-y-2">
            {studentsAtRisk.map((student, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{student.studentName}</span>
                <span className="text-sm">
                  GPA: {student.currentGpa} (Required: {student.requiredGpa})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Performance */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2">Course</th>
                <th className="border border-gray-200 px-4 py-2">Pass Rate</th>
                <th className="border border-gray-200 px-4 py-2">Fail Rate</th>
                <th className="border border-gray-200 px-4 py-2">Average Grade</th>
              </tr>
            </thead>
            <tbody>
              {coursePerformance.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-200 px-4 py-2">{course.courseName}</td>
                  <td className="border border-gray-200 px-4 py-2">{course.passRate}</td>
                  <td className="border border-gray-200 px-4 py-2">{course.failRate}</td>
                  <td className="border border-gray-200 px-4 py-2">{course.averageGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Advisee Appointments */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Upcoming Advisee Appointments</h2>
          <ul className="space-y-2">
            {adviseeAppointments.map((appointment, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{appointment.studentName}</span>
                <span className="text-sm">
                  {appointment.appointmentDate} at {appointment.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvisorSummaryPage;
