import { useEffect, useState } from 'react';

const SummaryPage = () => {
  const [gpaByMajor, setGpaByMajor] = useState([]);
  const [departmentGpaRankings, setDepartmentGpaRankings] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [instructorStudentCount, setInstructorStudentCount] = useState([]);
  const [studentRankingByMajor, setStudentRankingByMajor] = useState([]);

  useEffect(() => {
    // Fetch all required summary data from the API
    const fetchData = async () => {
      const gpaRes = await fetch('/api/summary/gpa-by-major');
      const departmentRes = await fetch('/api/summary/department-gpa-rankings');
      const courseRes = await fetch('/api/summary/course-enrollments');
      const instructorRes = await fetch('/api/summary/instructor-student-count');
      const studentRes = await fetch('/api/summary/student-ranking-by-major');

      setGpaByMajor(await gpaRes.json());
      setDepartmentGpaRankings(await departmentRes.json());
      setCourseEnrollments(await courseRes.json());
      setInstructorStudentCount(await instructorRes.json());
      setStudentRankingByMajor(await studentRes.json());
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Summary Reports</h1>

      {/* GPA by Major */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Highest, Lowest, and Average GPA by Major</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>Major</th>
              <th>Highest GPA</th>
              <th>Lowest GPA</th>
              <th>Average GPA</th>
            </tr>
          </thead>
          <tbody>
            {gpaByMajor.map((major) => (
              <tr key={major.major}>
                <td>{major.major}</td>
                <td>{major.highestGpa}</td>
                <td>{major.lowestGpa}</td>
                <td>{major.averageGpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Department GPA Rankings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Department GPA Rankings</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>Department</th>
              <th>Average GPA</th>
            </tr>
          </thead>
          <tbody>
            {departmentGpaRankings.map((department) => (
              <tr key={department.department}>
                <td>{department.department}</td>
                <td>{department.averageGpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Course Enrollments */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Semester-wise Course Enrollments and Average Grades</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>Course</th>
              <th>Semester</th>
              <th>Total Enrollments</th>
              <th>Average Grade</th>
            </tr>
          </thead>
          <tbody>
            {courseEnrollments.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseName}</td>
                <td>{course.semester}</td>
                <td>{course.totalEnrollments}</td>
                <td>{course.averageGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Instructor Student Count */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Instructor-wise Student Count</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>Instructor</th>
              <th>Course</th>
              <th>Total Students</th>
            </tr>
          </thead>
          <tbody>
            {instructorStudentCount.map((instructor) => (
              <tr key={instructor.instructorId}>
                <td>{instructor.instructorName}</td>
                <td>{instructor.courseName}</td>
                <td>{instructor.totalStudents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Student Ranking by Major */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Student Ranking by Major (Total Credits)</h2>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>Major</th>
              <th>Student Name</th>
              <th>Total Credits</th>
            </tr>
          </thead>
          <tbody>
            {studentRankingByMajor.map((major) => (
              <React.Fragment key={major.major}>
                <tr>
                  <td colSpan="3" className="font-semibold">{major.major}</td>
                </tr>
                {major.students.map((student) => (
                  <tr key={student.studentId}>
                    <td></td>
                    <td>{student.name}</td>
                    <td>{student.totalCredits}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SummaryPage;
