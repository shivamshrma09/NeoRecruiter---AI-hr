import React, { useState, useEffect, useContext } from "react";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaQuestionCircle,
  FaBook,
  FaSignOutAlt,
  FaPlus,
  FaBriefcase,
  FaUserGraduate,
  FaChartLine,
  FaBuilding,
  FaLaptopCode,
  FaQuestion,
  FaEnvelope,
  FaUpload,
  FaChevronRight,
  FaChevronLeft,
  FaSave,
  FaEye,
  FaTrash,
  FaUsers,
  FaCheck,
  FaChartBar
} from "react-icons/fa";
import { UserDataContext } from "../context/UserContext";
import AnalyticsDashboard from './Charts';
import { dashboardData, interviewsData, analyticsData } from '../utils/mockData';

// Dashboard Home Component with Mock Data
function DashboardHome({ onCreateNewInterview }) {
  const { user } = useContext(UserDataContext);
  const [stats, setStats] = useState({ interviews: 0, candidates: 0, avgScore: 0 });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API calls
    setStats({
      interviews: dashboardData.totalInterviews,
      candidates: dashboardData.totalCandidates,
      avgScore: dashboardData.averageScore
    });
    setRecentInterviews(interviewsData);
    setLoading(false);
  }, []);

  if (!user || loading) return <div className="p-8 text-center">Loading...</div>;
  
  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Overview</h2>
        <button
          onClick={onCreateNewInterview}
          className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold flex items-center shadow-lg hover:bg-blue-800 transition duration-300 transform hover:scale-105 group"
        >
          <FaPlus className="mr-2 group-hover:rotate-45 transition-transform duration-250" />
          Create New Interview
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-5 border border-blue-100 hover:shadow-2xl hover:border-blue-300 transition duration-300 cursor-pointer">
          <FaBriefcase className="text-5xl text-blue-700 opacity-80" />
          <div>
            <p className="text-gray-600 text-lg font-medium">Total Interviews</p>
            <p className="text-4xl font-bold text-blue-900 mt-1">{stats.interviews}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-5 border border-green-100 hover:shadow-2xl hover:border-green-300 transition duration-300 cursor-pointer">
          <FaUserGraduate className="text-5xl text-green-700 opacity-80" />
          <div>
            <p className="text-gray-600 text-lg font-medium">Candidates Processed</p>
            <p className="text-4xl font-bold text-green-900 mt-1">{stats.candidates}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-5 border border-purple-100 hover:shadow-2xl hover:border-purple-300 transition duration-300 cursor-pointer">
          <FaChartLine className="text-5xl text-purple-700 opacity-80" />
          <div>
            <p className="text-gray-600 text-lg font-medium">Average Score</p>
            <p className="text-4xl font-bold text-purple-900 mt-1">{stats.avgScore}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-5 border border-yellow-100 hover:shadow-2xl hover:border-yellow-300 transition duration-300 cursor-pointer">
          <div className="text-5xl text-yellow-600 opacity-80">₹</div>
          <div>
            <p className="text-gray-600 text-lg font-medium">Account Balance</p>
            <p className="text-4xl font-bold text-yellow-700 mt-1">₹{dashboardData.balance}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Interviews</h3>
        {recentInterviews.length > 0 ? (
          <div className="space-y-4">
            {recentInterviews.map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition duration-200">
                <div className="flex items-center space-x-4">
                  <FaBriefcase className="text-blue-600 text-xl" />
                  <div>
                    <span className="font-semibold text-blue-700">{interview.role}</span>
                    <p className="text-sm text-gray-600">{interview.technicalDomain || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUsers className="mr-1" />
                    {interview.candidates?.length || 0} candidates
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No interviews created yet. Start by creating your first interview!</p>
        )}
      </div>
    </div>
  );
}

// Schedules Component with Mock Data
function Schedules() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API calls
    setInterviews(interviewsData);
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Interview Schedules</h2>
      {interviews.length > 0 ? (
        <div className="grid gap-6">
          {interviews.map((interview, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-700">{interview.role}</h3>
                  <p className="text-gray-600">{interview.technicalDomain || 'General'}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <FaQuestion className="text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">{interview.questions?.length || 0} Questions</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">{interview.candidates?.length || 0} Candidates</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition duration-200">
                  <FaEye className="inline mr-1" /> View Details
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition duration-200">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaCalendarAlt className="text-6xl text-blue-400 mb-6 mx-auto" />
          <h3 className="text-xl font-bold text-gray-800 mb-4">No Interviews Scheduled</h3>
          <p className="text-gray-600">Create your first interview to get started!</p>
        </div>
      )}
    </div>
  );
}

// Results Component with Mock Data
function Results() {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    sortBy: 'score',
    sortOrder: 'desc',
    showCheating: true
  });

  useEffect(() => {
    // Use mock data instead of API calls
    setInterviews(interviewsData);
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  // Filter interviews based on filters
  const filteredInterviews = interviews.filter(interview => {
    return interview.role.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
           interview.technicalDomain?.toLowerCase().includes(filters.searchTerm.toLowerCase());
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Interview Results & Analytics</h2>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search by role or domain..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">Score</option>
              <option value="date">Date</option>
              <option value="candidates">Candidates</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredInterviews.length > 0 ? (
        <div className="grid gap-6">
          {filteredInterviews.map((interview, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">{interview.role}</h3>
                  <p className="text-gray-600 text-lg">{interview.technicalDomain || 'General'}</p>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    Completed
                  </span>
                  <p className="text-sm text-gray-500 mt-2">{new Date(interview.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FaQuestion className="text-blue-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-xl font-bold text-blue-700">{interview.questions?.length || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <FaUsers className="text-green-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Candidates</p>
                  <p className="text-xl font-bold text-green-700">{interview.candidates?.length || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <FaChartLine className="text-purple-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-xl font-bold text-purple-700">85%</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <FaClipboardList className="text-orange-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-xl font-bold text-orange-700">Active</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedInterview(interview)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <FaEye className="inline mr-2" /> View Detailed Results
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaClipboardList className="text-6xl text-purple-400 mb-6 mx-auto" />
          <h3 className="text-xl font-bold text-gray-800 mb-4">No Interview Results Yet</h3>
          <p className="text-gray-600">Results will appear here once candidates complete their interviews.</p>
        </div>
      )}
    </div>
  );
}

// Main Dashboard Layout with Mock Data
export default function MockDashboard({ onLogout }) {
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard");
  const [isCreatingInterview, setIsCreatingInterview] = useState(false);
  const { user } = useContext(UserDataContext);

  const renderContent = () => {
    if (isCreatingInterview) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Create New Interview</h2>
          <p>Interview creation form would appear here.</p>
          <button 
            onClick={() => setIsCreatingInterview(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }
    
    switch (activeDashboardTab) {
      case "dashboard":
        return <DashboardHome onCreateNewInterview={() => setIsCreatingInterview(true)} />;
      case "schedules":
        return <Schedules />;
      case "results":
        return <Results />;
      case "analytics":
        return <AnalyticsDashboard interviews={interviewsData} />;
      default:
        return <DashboardHome onCreateNewInterview={() => setIsCreatingInterview(true)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between border-r border-blue-100 sticky top-0 h-screen transition-all duration-300 ease-in-out z-20">
        <div>
          {/* Logo */}
          <div className="flex items-center mb-10 pl-2">
            <span className="text-4xl font-black tracking-tight select-none flex items-center space-x-1">
              <span className="text-white bg-gradient-to-r from-blue-700 to-blue-900 px-2 py-1 rounded-l-xl shadow-md">Neo</span>
              <span className="text-blue-700 bg-white px-2 py-1 rounded-r-xl shadow-md">Recruiter</span>
            </span>
          </div>
          {/* Navigation Links */}
          <nav>
            <ul>
              {[
                { key: "dashboard", icon: FaTachometerAlt, label: "Dashboard" },
                { key: "schedules", icon: FaCalendarAlt, label: "Schedules" },
                { key: "results", icon: FaClipboardList, label: "Results" },
                { key: "analytics", icon: FaChartBar, label: "Analytics" }
              ].map(({ key, icon: Icon, label }) => (
                <li key={key} className="mb-3">
                  <button
                    onClick={() => {
                      setActiveDashboardTab(key);
                      setIsCreatingInterview(false);
                    }}
                    className={`flex items-center w-full p-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                      activeDashboardTab === key && !isCreatingInterview
                        ? "bg-blue-100 text-blue-800 shadow-md border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Icon className="mr-3 text-xl" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Logout */}
        <div className="mt-8">
          <button
            onClick={onLogout}
            className="flex items-center w-full p-3 rounded-lg text-lg font-semibold text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <FaSignOutAlt className="mr-3 text-xl" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-blue-900 capitalize">
            {isCreatingInterview ? "Create Interview" : activeDashboardTab}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium text-lg">
              Welcome, {user?.companyName || 'HR Admin'}!
            </span>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-lg border-2 border-blue-300 shadow-sm">
              {user?.companyName?.charAt(0) || 'H'}
            </div>
          </div>
        </header>
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl min-h-[calc(100vh-200px)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}