import { Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn';
import ChangePassword from './components/ChangePassword'; 
import CreateAccount from './components/CreateAccount';
import BaseHome from './components/BaseHome'; // Import your BaseHome component
import SummaryPage from './components/SummaryPage';
import WhatIfAnalysisPage from './components/WhatIfAnalysis';

export default function App() {
  // Simulating user role from authentication or global state.
  const userRole = 'Student'; // Replace this with dynamic authentication logic.

  // Dynamic redirection based on role.
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
        return '/'; // Redirect to login if role is invalid.
    }
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path='/what-if' element={<WhatIfAnalysisPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route
          path="/staff"
          element={
            <BaseHome
              userRole="Staff"
              permissions={{
                canViewDetails: true,
                canModifyCourses: true,
                canManageInstructors: true,
                canAddInstructors: true,
                canAddStudents: false,
                canManageDepartment: true,
              }}
            />
          }
        />
        <Route
          path="/advisor"
          element={
            <BaseHome
              userRole="Advisor"
              permissions={{
                canViewDetails: true,
                canAddStudents: true,
                canDropStudents: true,
                canModifyCourses: false,
                canManageInstructors: false,
                canManageDepartment: false,
              }}
            />
          }
        />
        <Route
          path="/student"
          element={
            <BaseHome
              userRole="Student"
              permissions={{
                canViewDetails: true,
              }}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <BaseHome
              userRole="Instructor"
              permissions={{
                canViewDetails: true,
              }}
            />
          }
        />
      </Routes>
    </div>
  );
}
