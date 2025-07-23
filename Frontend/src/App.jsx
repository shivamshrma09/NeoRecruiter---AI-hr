import { useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import { UserDataContext } from "./context/UserContext";

// Components
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/HomeDashboard";
import Interview from "./components/Interview";
import InterviewResults from "./components/InterviewResults";
import StudentInterview from "./components/StudentInterview";
import EnhancedStudentInterview from "./components/EnhancedStudentInterview";
import SEO from "./components/SEO";

// Private Route Component
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
      <SEO />
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/interview-results" element={<InterviewResults />} />
        <Route path="/student-interview" element={<StudentInterview />} />
        <Route path="/enhanced-interview" element={<EnhancedStudentInterview />} />
      </Routes>
    </Router>
  );
}

export default App;

export default App;
