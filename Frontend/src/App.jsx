import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/HomeDashboard";
import Interview from "./components/Interview";
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserContext, { UserDataContext } from "./context/UserContext";
import Charts from "./components/Charts"
import { useContext } from 'react';

function AppContent() {
  const { logout } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Dashboard" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/Charts" element={<Charts />} />
    </Routes>
  );
}

function App() {
  return (
    <UserContext>
      <AppContent />
    </UserContext>
  );
}

export default App;
