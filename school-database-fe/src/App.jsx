import { Route, Routes, Navigate } from 'react-router-dom';
import LogIn from './components/login/LogIn';
import ChangePassword from './components/login/ChangePassword'; 
import CreateAccount from './components/login/CreateAccount';
import WhatIfAnalysisPage from './components/WhatIfAnalysis';

// Import Role-Specific Pages
import Student from './components/student/Student';
import StudentSummaryPage from './components/student/StudentSummaryPage';
import Instructor from './components/instructor/Instructor';
import InstructorSummaryPage from './components/instructor/InstructorSummaryPage';
import Advisor from './components/advisor/Advisor';
import AdvisorSummaryPage from './components/advisor/AdvisorSummaryPage';
import Staff from './components/staff/Staff';
import StaffSummaryPage from './components/staff/StaffSummaryPage';

// Simulating user role from authentication or global state
const userRole = 'Student'; // Replace this with dynamic authentication logic.

const App = () => {
  // Dynamic redirection based on role
  const getDashboardPath = () => {
    switch (userRole) {
      case 'Student':
        return '/student';
      case 'Instructor':
        return '/instructor';
      case 'Advisor':
        return '/advisor';
      case 'Staff':
        return '/staff';
      default:
        return '/'; // Redirect to login if role is invalid
    }
  };

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LogIn />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/what-if" element={<WhatIfAnalysisPage />} />

        {/* Student Routes */}
        <Route path="/student" element={<Student />} />
        <Route path="/student/summary" element={<StudentSummaryPage />} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<Instructor />} />
        <Route path="/instructor/summary" element={<InstructorSummaryPage />} />

        {/* Advisor Routes */}
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/advisor/summary" element={<AdvisorSummaryPage />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/summary" element={<StaffSummaryPage />} />

        {/* Dynamic Role-Based Redirect */}
        <Route path="/dashboard" element={<Navigate to={getDashboardPath()} />} />

        {/* Catch-All Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
