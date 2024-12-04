import { Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn';
import ChangePassword from './components/ChangePassword'; 
import CreateAccount from './components/CreateAccount';
import BaseHome from './components/BaseHome'; // Import your BaseHome component
import StaffSummaryPage from './components/StaffSummaryPage';
import WhatIfAnalysisPage from './components/WhatIfAnalysis';
import StudentSummaryPage from './components/StudentSummaryPage'; 
import AdvisorSummaryPage from './components/AdvisorSummaryPage'; 
import InstructorSummaryPage from './components/InstructorSummaryPage';
import { useUser } from './context/UserContext'; 
import NavBar from './components/NavBar';

export default function App() {
  // Simulating user role from authentication or global state.
  const userRole = 'Student'; // Replace this with dynamic authentication logic.
  const { user } = useUser();
  console.log(user);
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
        <Route path="/staff/summary" element={
          <div>
          <NavBar userRole = "staff"/>
          <StaffSummaryPage />
          </div>
          } 
          />
        <Route path='/what-if' element={<WhatIfAnalysisPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/student/summary" element={
         <div>
          <NavBar userRole = "student"/>
          <StudentSummaryPage />  
         </div>} 
          />
        <Route path="/advisor/summary" element={
          <div>
          <NavBar userRole = "advisor"/>
          <AdvisorSummaryPage />  
         </div>} />
        <Route path="/instructor/summary" element={
          <div>
          <NavBar userRole = "instructor"/>
          <InstructorSummaryPage />  
         </div>} />
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