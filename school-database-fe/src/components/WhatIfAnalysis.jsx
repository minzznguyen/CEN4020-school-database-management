import { useState } from "react";

// GPA Grade Points Mapping
const gradePoints = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

const WhatIfAnalysisPage = () => {
  const [currentGPA, setCurrentGPA] = useState(2.88); // Example current GPA
  const [desiredGPA, setDesiredGPA] = useState(3.5); // Example desired GPA
  const [numCourses, setNumCourses] = useState(1); // Default to 1 course
  const [courseGrades, setCourseGrades] = useState([{ grade: "B", credits: 3 }]);
  const [suggestions, setSuggestions] = useState([]);

  // Handle input change for grade and credits
  const handleCourseChange = (index, field, value) => {
    const newCourseGrades = [...courseGrades];
    newCourseGrades[index][field] = value;
    setCourseGrades(newCourseGrades);
  };

  // Handle adding/removing courses
  const handleAddCourse = () => {
    setCourseGrades([...courseGrades, { grade: "B", credits: 3 }]);
  };

  const handleRemoveCourse = (index) => {
    const newCourseGrades = [...courseGrades];
    newCourseGrades.splice(index, 1);
    setCourseGrades(newCourseGrades);
  };

  // Scenario 1: Calculate GPA after N more courses
  const calculateNewGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    // Add GPA from completed courses (current GPA)
    totalCredits += 120; // Example: assume the student has already completed 120 credits
    totalGradePoints += currentGPA * 120; // GPA * total credits

    // Add GPA from new courses
    courseGrades.forEach(course => {
      totalCredits += course.credits;
      totalGradePoints += gradePoints[course.grade] * course.credits;
    });

    return (totalGradePoints / totalCredits).toFixed(2);
  };

  // Scenario 2: Calculate how many courses needed to reach desired GPA
  const calculateRequiredCourses = () => {
    const currentTotalCredits = 120; // Example: already completed 120 credits
    const currentTotalGradePoints = currentGPA * currentTotalCredits;

    const targetTotalCredits = currentTotalCredits + numCourses * 3; // Assuming each course is 3 credits
    const requiredTotalGradePoints = desiredGPA * targetTotalCredits;

    // Calculate the grade points needed from the new courses
    const requiredGradePoints = requiredTotalGradePoints - currentTotalGradePoints;

    const courseSuggestions = [];
    let remainingGradePoints = requiredGradePoints;

    for (let i = 0; i < numCourses; i++) {
      const gradeCombination = [];
      let accumulatedGradePoints = 0;

      // Distribute remaining grade points across new courses
      const possibleGrades = ["A", "B", "C", "D"];
      possibleGrades.forEach(grade => {
        const points = gradePoints[grade] * 3; // 3 credits per course
        if (accumulatedGradePoints + points <= remainingGradePoints) {
          gradeCombination.push({ grade, credits: 3 });
          accumulatedGradePoints += points;
        }
      });

      remainingGradePoints -= accumulatedGradePoints;
      courseSuggestions.push(gradeCombination);
    }

    return courseSuggestions;
  };

  const handleCalculate = () => {
    setSuggestions(calculateRequiredCourses());
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">What-If Analysis</h1>

      {/* Scenario 1: GPA After N More Courses */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Scenario 1: GPA After Taking N More Courses</h2>
        <label className="block mb-4">
          <span className="text-lg font-medium">Current GPA:</span>
          <input
            type="number"
            value={currentGPA}
            onChange={(e) => setCurrentGPA(parseFloat(e.target.value))}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
            step="0.01"
          />
        </label>
        <label className="block mb-4">
          <span className="text-lg font-medium">Number of Courses:</span>
          <input
            type="number"
            value={numCourses}
            onChange={(e) => setNumCourses(parseInt(e.target.value))}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </label>

        {courseGrades.map((course, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <div className="w-1/2">
              <label className="text-lg font-medium">Grade:</label>
              <select
                value={course.grade}
                onChange={(e) =>
                  handleCourseChange(index, "grade", e.target.value)
                }
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="text-lg font-medium">Credits:</label>
              <input
                type="number"
                value={course.credits}
                onChange={(e) =>
                  handleCourseChange(index, "credits", parseInt(e.target.value))
                }
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => handleRemoveCourse(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleAddCourse}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Course
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={calculateNewGPA}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Calculate New GPA
          </button>
        </div>
        <p className="mt-4 text-lg text-center">New GPA: {calculateNewGPA()}</p>
      </div>

      {/* Scenario 2: Number of Courses to Reach Desired GPA */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Scenario 2: Courses Required to Reach Desired GPA</h2>
        <label className="block mb-4">
          <span className="text-lg font-medium">Desired GPA:</span>
          <input
            type="number"
            value={desiredGPA}
            onChange={(e) => setDesiredGPA(parseFloat(e.target.value))}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
            step="0.01"
          />
        </label>
        <label className="block mb-4">
          <span className="text-lg font-medium">Number of Courses:</span>
          <input
            type="number"
            value={numCourses}
            onChange={(e) => setNumCourses(parseInt(e.target.value))}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </label>

        <div className="mt-6 text-center">
          <button
            onClick={handleCalculate}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Calculate Required Courses
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Suggestions:</h3>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-semibold">Suggested Grades:</h4>
                {suggestion.map((course, i) => (
                  <p key={i}>
                    {course.grade} (Credits: {course.credits})
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfAnalysisPage;