import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { FaEnvelope, FaLock, FaRobot, FaSpinner, FaGoogle, FaLinkedin } from 'react-icons/fa'
import api from '../utils/api'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const { login } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userData = { email, password }
      const response = await api.post('/hr/login', userData)

      if (response.status === 200) {
        const data = response.data
        login(data.user, data.token)
        navigate('/Dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
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
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg text-blue-200 leading-relaxed">
            Log in to continue transforming your recruitment process with
            cutting-edge AI.
          </p>
          <div className="mt-8">
            <FaRobot className="text-8xl text-blue-300 opacity-75 animate-bounce-slow" />
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Login to Your Account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={submitHandler}>
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
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-600 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-700 hover:text-blue-900 transition duration-200">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/Signup" className="font-bold text-blue-700 hover:text-blue-900 transition duration-200">
              Sign Up
            </Link>
          </div>

          <div className="flex items-center justify-center mt-6">
            <span className="border-b w-1/4 lg:w-1/3"></span>
            <span className="text-xs text-gray-500 uppercase mx-2">
              Or Login with
            </span>
            <span className="border-b w-1/4 lg:w-1/3"></span>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition duration-200 transform hover:scale-105"
              onClick={() => alert("Google Login clicked! (Demo only)")}
            >
              <FaGoogle className="mr-2 text-xl text-red-500" /> Google
            </button>
            <button
              className="flex items-center justify-center px-4 py-2 border border-blue-500 rounded-lg shadow-sm text-blue-700 hover:bg-blue-50 transition duration-200 transform hover:scale-105"
              onClick={() => alert("LinkedIn Login clicked! (Demo only)")}
            >
              <FaLinkedin className="mr-2 text-xl text-blue-700" /> LinkedIn
            </button>
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
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  )
}

export default UserLogin
