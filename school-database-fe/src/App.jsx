import { Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn';
import ChangePassword from './components/ChangePassword'; 
import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard';

export default function App() {
  return (

    <div>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      
    </div>
    

  );
}
