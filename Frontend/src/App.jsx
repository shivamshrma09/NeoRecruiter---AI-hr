import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { useContext } from "react";

import UserContext, { UserDataContext } from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/HomeDashboard";
import Interview from "./components/Interview";
import InterviewLink from "./components/InterviewLink";
import InterviewResults from "./components/InterviewResults";
import StudentInterview from "./components/StudentInterview";
import LandingPage from "./components/LandingPage";
import Charts from "./components/Charts";

function AppContent() {
  const { logout } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  return (
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
      <Route path="/interview-link" element={<InterviewLink />} />
      <Route path="/interview-results/:id" element={<InterviewResults />} />
      <Route path="/student-interview" element={<StudentInterview />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/Charts" element={<Charts />} />
      <Route
        path="*"
        element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">
              404 - Page Not Found
            </h1>
          </div>
        }
      />
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
