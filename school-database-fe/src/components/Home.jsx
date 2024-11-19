import { useState } from 'react';
import NavBar from './NavBar.jsx';

const Home = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Course 1', description: 'Description of Course 1' },
    { id: 2, name: 'Course 2', description: 'Description of Course 2' },
  ]);

  const [newCourse, setNewCourse] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const addCourse = () => {
    if (newCourse.name.trim() && newCourse.description.trim()) {
      setCourses((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: newCourse.name,
          description: newCourse.description,
        },
      ]);
      setNewCourse({ name: '', description: '' });
      setShowForm(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const removeCourse = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
    setActiveMenu(null);
  };

  return (
    <div>
      {/* Updated NavBar with extra padding */}
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        {/* Title and Action Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Courses</h1>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {showForm ? 'Cancel' : 'Add Course'}
          </button>
        </div>

        {/* Add Course Form */}
        {showForm && (
          <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Course Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCourse.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter course name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="description"
              >
                Course Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newCourse.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter course description"
              />
            </div>
            <button
              onClick={addCourse}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Add Course
            </button>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {course.name}
              </h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() =>
                    setActiveMenu((prev) => (prev === course.id ? null : course.id))
                  }
                  className="text-gray-500 hover:text-gray-700"
                >
                  &#8942;
                </button>
                {activeMenu === course.id && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
