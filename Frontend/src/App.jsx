import { useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import { UserDataContext } from "./context/UserContext";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/HomeDashboard";
import Interview from "./components/Interview";
import Newhome from "./components/newhome";
import StudentInterview from "./components/StudentInterview";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserDataContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, logout } = useContext(UserDataContext);
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Newhome />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route path="/interview" element={<Interview />} />
        <Route path="/student-interview" element={<StudentInterview />} />
      </Routes>
    </Router>
  );
}

export default App;

