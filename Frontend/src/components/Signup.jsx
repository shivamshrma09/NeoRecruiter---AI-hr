import React, { useState, useContext } from "react"
import { FaRobot, FaEnvelope, FaLock, FaUser, FaSpinner } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { UserDataContext } from '../context/UserContext'
import api from '../utils/api'

export default function Signup() {
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError("")

    if (!companyName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      // For demo purposes, skip the actual API call and simulate a successful registration
      // const userData = { companyName, email, password }
      // const response = await api.post('/hr/register', userData)
      
      // Simulate successful registration
      const mockUser = {
        _id: '123',
        companyName: companyName,
        email: email
      }
      
      const mockToken = 'demo-token-' + Date.now()
      
      // Login the user with the mock data
      login(mockUser, mockToken)
      navigate('/Dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl animate-fade-in">
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-10 flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <span className="text-6xl font-black tracking-tight select-none flex items-center space-x-2">
              <span className="text-white">Neo</span>
              <span className="text-blue-200">Recruiter</span>
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Create Your Account</h2>
          <p className="text-lg text-blue-200 leading-relaxed">
            Sign up to revolutionize your hiring process with AI.
          </p>
          <div className="mt-8">
            <FaRobot className="text-8xl text-blue-300 opacity-75 animate-bounce-slow" />
          </div>
        </div>

        {/* Right Section: Register Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Register as HR
          </h2>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">
                Company Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  autoComplete="organization"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/Login" className="font-bold text-blue-700 hover:text-blue-900 transition duration-200">
              Login
            </Link>
          </div>
        </div>
      </div>
      {/* Animation Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
