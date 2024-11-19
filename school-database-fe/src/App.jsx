
import { Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn';
import ChangePassword from './components/ChangePassword'; 
import CreateAccount from './components/CreateAccount';
import Home from './components/Home';
export default function App() {
  return (

    <div>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      
    </div>
    

  );
}
