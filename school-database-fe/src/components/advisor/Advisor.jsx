import { useState } from 'react';
import NavBar from '../NavBar.jsx';

const Advisor = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Student 1',
      major: 'Computer Science',
    },
    {
      id: 2,
      name: 'Student 2',
      major: 'Mathematics',
    },
  ]);

  const handleAddStudent = () => {
    alert('Add Student functionality here');
  };

  const handleDropStudent = (student) => {
    alert(`Drop Student: ${student.name}`);
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">Advisor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {student.name}
              </h2>
              <p className="text-gray-600 mb-4">Major: {student.major}</p>
              <button
                onClick={() => handleDropStudent(student)}
                className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
              >
                Drop Student
              </button>
            </div>
          ))}
          <button
            onClick={handleAddStudent}
            className="btn-grad px-4 py-2 text-sm font-medium rounded-md mt-2"
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
