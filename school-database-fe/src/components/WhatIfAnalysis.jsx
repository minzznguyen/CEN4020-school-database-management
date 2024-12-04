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
  const [currentGPA, setCurrentGPA] = useState(3.6); // Example current GPA
  const [currentCredits, setCurrentCredits] = useState(75); // Example completed credits
  const [desiredGPA, setDesiredGPA] = useState(3.5); // Example desired GPA

  // For Scenario 1
  const [whatIfCourses, setWhatIfCourses] = useState([{ grade: "B", credits: 3 }]);

  // Scenario 2 Output
  const [requiredCourses, setRequiredCourses] = useState(null);

  // Handle changes in the courses for Scenario 1
  const handleWhatIfCourseChange = (index, field, value) => {
    const updatedCourses = [...whatIfCourses];
    updatedCourses[index][field] = field === "credits" ? parseInt(value) : value;
    setWhatIfCourses(updatedCourses);
  };

  const handleAddWhatIfCourse = () => {
    setWhatIfCourses([...whatIfCourses, { grade: "B", credits: 3 }]);
  };

  const handleRemoveWhatIfCourse = (index) => {
    const updatedCourses = [...whatIfCourses];
    updatedCourses.splice(index, 1);
    setWhatIfCourses(updatedCourses);
  };

  // Scenario 1: Predict GPA after taking new courses
  const calculateNewGPA = () => {
    let totalCredits = currentCredits;
    let totalGradePoints = currentGPA * currentCredits;

    whatIfCourses.forEach((course) => {
      totalCredits += course.credits;
      totalGradePoints += gradePoints[course.grade] * course.credits;
    });

    return (totalGradePoints / totalCredits).toFixed(2);
  };

  // Scenario 2: Calculate minimum courses required to achieve desired GPA
  const calculateMinimumCourses = () => {
    const totalGradePoints = currentGPA * currentCredits;
    const requiredTotalGradePoints = desiredGPA * currentCredits;

    if (requiredTotalGradePoints <= totalGradePoints) {
      // Already at or above desired GPA
      setRequiredCourses({
        numCourses: 0,
        grades: [],
      });
      return;
    }

    const creditsPerCourse = 3; // Assume each course is 3 credits
    let additionalCredits = 0;
    let additionalGradePoints = 0;

    while (true) {
      additionalCredits += creditsPerCourse;
      additionalGradePoints = desiredGPA * (currentCredits + additionalCredits) - totalGradePoints;

      const averageGradePoint = additionalGradePoints / additionalCredits;

      if (averageGradePoint <= 4.0) {
        const grades = Array.from(
          { length: additionalCredits / creditsPerCourse },
          () => {
            if (averageGradePoint >= 3.5) return "A";
            if (averageGradePoint >= 3.0) return "B";
            if (averageGradePoint >= 2.0) return "C";
            return "D";
          }
        );

        setRequiredCourses({
          numCourses: additionalCredits / creditsPerCourse,
          grades,
        });
        break;
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">What-If Analysis</h1>

      {/* Scenario 1: Predict GPA */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Scenario 1: Predict GPA After Taking New Courses</h2>
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
          <span className="text-lg font-medium">Completed Credits:</span>
          <input
            type="number"
            value={currentCredits}
            onChange={(e) => setCurrentCredits(parseInt(e.target.value))}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </label>

        {whatIfCourses.map((course, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <div className="w-1/2">
              <label className="text-lg font-medium">Grade:</label>
              <select
                value={course.grade}
                onChange={(e) => handleWhatIfCourseChange(index, "grade", e.target.value)}
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
                onChange={(e) => handleWhatIfCourseChange(index, "credits", parseInt(e.target.value))}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => handleRemoveWhatIfCourse(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleAddWhatIfCourse}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Course
        </button>

        <div className="mt-6 text-center">
          <p className="text-lg font-medium">
            Predicted GPA: <span className="font-semibold">{calculateNewGPA()}</span>
          </p>
        </div>
      </div>

      {/* Scenario 2: Minimum Courses Required */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Scenario 2: Minimum Courses Required to Achieve Desired GPA</h2>
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
          <span className="text-lg font-medium">Completed Courses:</span>
          <input
            type="number"
            value={currentCredits / 3}
            onChange={(e) => setCurrentCredits(parseInt(e.target.value) * 3)}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
          />
        </label>

        <button
          onClick={calculateMinimumCourses}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Calculate Minimum Courses
        </button>

        {requiredCourses && (
          <div className="mt-6 text-center">
            <p className="text-lg font-medium">
              You need at least <span className="font-semibold">{requiredCourses.numCourses}</span> courses with grades:{" "}
              <span className="font-semibold">{requiredCourses.grades.join(", ")}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfAnalysisPage;
