import React, { useState, useEffect, useContext } from "react"
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
  FaBars,
  FaTimes,
  FaChartBar,
  FaFileAlt,
  FaVideo
} from "react-icons/fa"
import { UserDataContext } from "../context/UserContext"
import api from "../utils/api"
import AnalyticsDashboard from './Charts'

// --- Dashboard Home ---
function DashboardHome({ onCreateNewInterview }) {
  const { user } = useContext(UserDataContext)
  const [stats, setStats] = useState({ interviews: 0, candidates: 0, avgScore: 0 })
  const [recentInterviews, setRecentInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const interviewsRes = await api.get('/hr/interviews')
        const interviews = interviewsRes.data.interviews || []
        const totalCandidates = interviews.reduce((sum, interview) => sum + (interview.candidates?.length || 0), 0)
        
        setStats({ 
          interviews: interviews.length, 
          candidates: totalCandidates, 
          avgScore: 85 
        })
        setRecentInterviews(interviews.slice(-5).reverse())
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchDashboardData()
  }, [user])

  if (!user || loading) return <div className="p-8 text-center">Loading...</div>
  
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
            <p className="text-4xl font-bold text-yellow-700 mt-1">₹{user?.Balance || 0}</p>
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
  )
}

// --- Create Interview Multi-Step Form ---
function CreateInterviewForm({ onComplete }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    roleName: "",
    technicalName: "",
    numQuestions: 5,
    questions: Array.from({ length: 5 }, () => ({
      question: "",
      expectedAnswer: "",
    })),
    candidateEmails: "",
    candidateFile: null,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState("")
  const [formError, setFormError] = useState("")

  const handleChange = (e) => {
  const { name, value } = e.target
  if (name === "numQuestions") {
    const num = parseInt(value, 10)
    setFormData((prev) => ({
      ...prev,
      numQuestions: num,
      questions: Array.from(
        { length: num },
        (_, i) => prev.questions[i] || { question: "", expectedAnswer: "" }
      ),
    }))
  } else if (name.startsWith("question-")) {
    const parts = name.split("-")
    const index = parseInt(parts[1], 10)
    let field = parts[2]
    if (field === "text") field = "question"
    if (field === "answer") field = "expectedAnswer"
    setFormData((prev) => {
      const newQuestions = [...prev.questions]
      newQuestions[index] = { ...newQuestions[index], [field]: value }
      return { ...prev, questions: newQuestions }
    })
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  setErrors((prev) => ({ ...prev, [name]: "" }))
  setFormError("")
}




  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "text/csv") {
      setFormData((prev) => ({ ...prev, candidateFile: file }))
      setErrors((prev) => ({ ...prev, candidateFile: "" }))
    } else {
      setFormData((prev) => ({ ...prev, candidateFile: null }))
      setErrors((prev) => ({
        ...prev,
        candidateFile: "Please upload a CSV file.",
      }))
    }
    setFormError("")
  }

  const validateStep = (stepToValidate) => {
    const newErrors = {}
    if (stepToValidate === 1) {
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required."
      if (!formData.roleName.trim())
        newErrors.roleName = "Role name is required."
    } else if (stepToValidate === 2) {
      if (formData.numQuestions <= 0) {
        newErrors.numQuestions = "Number of questions must be at least 1."
      }
      formData.questions.forEach((q, index) => {
        if (!q.question.trim()) {
          newErrors[`question-${index}-text`] = `Question ${index + 1} is required.`
        }
        if (!q.expectedAnswer.trim()) {
          newErrors[`question-${index}-answer`] = `Expected answer for question ${index + 1} is required.`
        }
      })
    } else if (stepToValidate === 3) {
      if (!formData.candidateEmails.trim() && !formData.candidateFile) {
        newErrors.candidates = "Please enter at least one email or upload a CSV file."
      }
      if (formData.candidateEmails.trim()) {
        const emails = formData.candidateEmails.split(",").map((email) => email.trim())
        const invalidEmails = emails.filter((email) => !/\S+@\S+\.\S+/.test(email))
        if (invalidEmails.length > 0) {
          newErrors.candidateEmails = `Invalid email format(s): ${invalidEmails.join(", ")}`
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    
    setLoading(true)
    try {
      const emailList = formData.candidateEmails.split(',').map(e => e.trim()).filter(e => e)
      
      const response = await api.post('/hr/interviews', {
        role: formData.roleName,
        technicalDomain: formData.technicalName,
        questions: formData.questions,
        candidateEmails: emailList,
      })
      
      if (response.status === 201) {
        setFormSuccess('Interview created and invitations sent!')
        setTimeout(() => onComplete(), 2000)
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create interview.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 animate-fade-in-up min-h-[calc(100vh-250px)] flex flex-col">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaPlus className="text-white text-2xl" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create New Interview
        </h2>
        <p className="text-gray-600">Design your AI-powered interview in 3 simple steps</p>
      </div>
      
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 animate-fade-in">
          {formError}
        </div>
      )}
      {formSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 animate-fade-in">
          {formSuccess}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="relative mb-12">
        <div className="flex justify-between items-center w-full max-w-2xl mx-auto">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className={`flex flex-col items-center z-10 ${step >= stepNum ? "text-blue-700" : "text-gray-400"}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg transition-all duration-300 ${
                step >= stepNum 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 transform scale-110" 
                  : "bg-gray-300"
              }`}>
                {step > stepNum ? <FaCheck /> : stepNum}
              </div>
              <p className="mt-3 text-sm font-semibold">
                {stepNum === 1 ? "Basic Details" : stepNum === 2 ? "Questions" : "Candidates"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stepNum === 1 ? "Company & Role" : stepNum === 2 ? "Interview Setup" : "Send Invites"}
              </p>
            </div>
          ))}
        </div>
        {/* Progress Line */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-xl h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Steps */}
      <div className="flex-grow">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div>
              <label htmlFor="companyName" className="block text-gray-700 text-base font-bold mb-2">
                <FaBuilding className="inline mr-2 text-blue-700" /> Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
                placeholder="e.g., Tech Innovations Pvt. Ltd."
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label htmlFor="roleName" className="block text-gray-700 text-base font-bold mb-2">
                <FaBriefcase className="inline mr-2 text-blue-700" /> Role Name
              </label>
              <input
                type="text"
                id="roleName"
                name="roleName"
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roleName ? "border-red-500" : "border-gray-300"}`}
                placeholder="e.g., Senior Software Engineer"
                value={formData.roleName}
                onChange={handleChange}
                required
              />
              {errors.roleName && <p className="text-red-500 text-sm mt-1">{errors.roleName}</p>}
            </div>
            <div>
              <label htmlFor="technicalName" className="block text-gray-700 text-base font-bold mb-2">
                <FaLaptopCode className="inline mr-2 text-blue-700" /> Technical/Domain Name 
              </label>
              <input
                type="text"
                id="technicalName"
                name="technicalName"
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="e.g., Fullstack Development, Marketing Analytics"
                value={formData.technicalName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div>
              <label htmlFor="numQuestions" className="block text-gray-700 text-base font-bold mb-2">
                <FaQuestion className="inline mr-2 text-blue-700" /> Number of Questions
              </label>
              <input
                type="number"
                id="numQuestions"
                name="numQuestions"
                min="1"
                max="20"
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.numQuestions ? "border-red-500" : "border-gray-300"}`}
                value={formData.numQuestions || ''}
                onChange={handleChange}
                required
              />
              {errors.numQuestions && <p className="text-red-500 text-sm mt-1">{errors.numQuestions}</p>}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Define Your Questions:</h3>
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
              {formData.questions.map((q, index) => (
                <div key={index} className="border p-5 rounded-lg bg-blue-50 border-blue-200 shadow-sm">
                  <p className="font-semibold text-blue-800 mb-3 text-lg">Question {index + 1}</p>
                  <div className="mb-4">
                    <label htmlFor={`question-${index}-text`} className="block text-gray-700 text-sm font-medium mb-2">
                      Question Text
                    </label>
                    <textarea
                      id={`question-${index}-text`}
                      name={`question-${index}-text`}
                      rows="2"
                      className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`question-${index}-text`] ? "border-red-500" : "border-gray-300"}`}
                      placeholder="e.g., Explain the concept of RESTful APIs."
                      value={q.question}
                      onChange={handleChange}
                      required
                    />
                    {errors[`question-${index}-text`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`question-${index}-text`]}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`question-${index}-answer`} className="block text-gray-700 text-sm font-medium mb-2">
                      Expected Answer (for AI analysis)
                    </label>
                    <textarea
                      id={`question-${index}-answer`}
                      name={`question-${index}-answer`}
                      rows="3"
                      className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`question-${index}-answer`] ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Provide a detailed expected answer for AI to compare against."
                      value={q.expectedAnswer}
                      onChange={handleChange}
                      required
                    />
                    {errors[`question-${index}-answer`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`question-${index}-answer`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Invite Candidates:</h3>
            <div>
              <label htmlFor="candidateEmails" className="block text-gray-700 text-base font-bold mb-2">
                <FaEnvelope className="inline mr-2 text-blue-700" /> Enter Candidate Emails (comma-separated)
              </label>
              <textarea
                id="candidateEmails"
                name="candidateEmails"
                rows="4"
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.candidateEmails ? "border-red-500" : "border-gray-300"}`}
                placeholder="candidate1@example.com, candidate2@example.com"
                value={formData.candidateEmails}
                onChange={handleChange}
              />
              {errors.candidateEmails && <p className="text-red-500 text-sm mt-1">{errors.candidateEmails}</p>}
            </div>
            <div className="flex items-center justify-center my-6">
              <span className="border-b w-1/4 lg:w-1/3 border-gray-300"></span>
              <span className="text-xs text-gray-500 uppercase mx-2 font-semibold">OR</span>
              <span className="border-b w-1/4 lg:w-1/3 border-gray-300"></span>
            </div>
            <div>
              <label htmlFor="candidateFile" className="block text-gray-700 text-base font-bold mb-2">
                <FaUpload className="inline mr-2 text-blue-700" /> Upload CSV File (Email addresses in one column)
              </label>
              <input
                type="file"
                id="candidateFile"
                name="candidateFile"
                accept=".csv"
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition duration-300 ${errors.candidateFile ? "border-red-500" : "border-gray-300"}`}
                onChange={handleFileChange}
              />
              {errors.candidateFile && <p className="text-red-500 text-sm mt-1">{errors.candidateFile}</p>}
              {formData.candidateFile && (
                <p className="text-green-600 text-sm mt-2">
                  File selected: <span className="font-medium">{formData.candidateFile.name}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10 pt-4 border-t border-gray-100">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center shadow-md hover:bg-gray-300 transition duration-300 transform hover:scale-105"
          >
            <FaChevronLeft className="mr-2" /> Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={handleNext}
            className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${step === 1 ? "ml-auto" : ""}`}
          >
            Next Step <FaChevronRight className="ml-2" />
          </button>
        )}
        {step === 3 && (
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold flex items-center shadow-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ml-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Interview...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Create & Send Invites
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// --- Schedules ---
function Schedules() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get('/hr/interviews')
        setInterviews(response.data.interviews || [])
      } catch (err) {
        console.error('Failed to fetch interviews:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>

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
                <button  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition duration-200">
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
  )
}

// --- Candidate Detail View ---
function CandidateDetailView({ candidate, interview, onBack }) {
  const [activeTab, setActiveTab] = useState('answers')
  
  // Real candidate data from backend
  const candidateData = {
    name: candidate.name || 'Not Provided',
    email: candidate.email,
    phone: candidate.phone || 'Not Provided',
    resume: candidate.resume || null,
    answers: candidate.answers || [],
    scores: candidate.scores || [],
    overallScore: candidate.scores?.length > 0 
      ? Math.round(candidate.scores.reduce((acc, score) => {
          const overallScore = score.overallscore || '0'
          const numericScore = parseInt(overallScore.split(' ')[0]) || 0
          return acc + numericScore
        }, 0) / candidate.scores.length * 20)
      : 0,
    cheatingDetected: candidate.cheatingDetected || false,
    cheatingFlags: candidate.cheatingFlags || []
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mr-4"
        >
          <FaChevronLeft className="mr-2" /> Back to Candidates
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Candidate Details</h2>
      </div>

      {/* Candidate Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        {candidateData.cheatingDetected && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <div>
                <h4 className="text-red-800 font-semibold">Suspicious Activity Detected</h4>
                <p className="text-red-600 text-sm">This candidate showed signs of potential cheating during the interview.</p>
                {candidateData.cheatingFlags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-600 text-sm font-medium">Detected Issues:</p>
                    <ul className="text-red-600 text-sm list-disc list-inside">
                      {candidateData.cheatingFlags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {candidateData.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{candidateData.name}</h3>
            <p className="text-gray-600 mb-2">{candidateData.email}</p>
            <p className="text-gray-600">{candidateData.phone}</p>
          </div>
          <div className="text-center">
            <div className={`p-4 rounded-lg ${
              candidateData.cheatingDetected ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <p className={`text-3xl font-bold ${
                candidateData.cheatingDetected ? 'text-red-600' : 'text-green-600'
              }`}>{candidateData.overallScore}%</p>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'answers', label: 'Answers', icon: FaClipboardList },
            { key: 'resume', label: 'Resume', icon: FaBook },
            { key: 'contact', label: 'Contact Info', icon: FaEnvelope }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-6 py-4 font-semibold transition-all duration-300 ${
                activeTab === key
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="mr-2" /> {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'answers' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Interview Answers</h4>
              {interview.questions?.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold text-gray-800">Question {index + 1}</h5>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Score: {candidateData.scores[index]?.overallscore ? parseInt(candidateData.scores[index].overallscore.split(' ')[0]) * 20 : 0}%
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{question.text}</p>
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium text-blue-800 mb-1">Candidate's Answer:</p>
                    <p className="text-gray-700">{candidateData.answers[index] || 'No answer provided'}</p>
                  </div>
                  
                  {candidateData.scores[index] && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 mb-2">AI Analysis:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Relevance: {candidateData.scores[index].Relevance}</div>
                        <div>Content Depth: {candidateData.scores[index].ContentDepth}</div>
                        <div>Communication: {candidateData.scores[index].CommunicationSkill}</div>
                        <div>Sentiment: {candidateData.scores[index].Sentiment}</div>
                      </div>
                      {candidateData.scores[index].improvement && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                          <p className="text-xs font-medium text-yellow-800">Improvement Suggestion:</p>
                          <p className="text-xs text-yellow-700">{candidateData.scores[index].improvement}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="text-center py-12">
              <FaBook className="text-6xl text-blue-400 mb-6 mx-auto" />
              <h4 className="text-xl font-bold text-gray-800 mb-4">Resume</h4>
              <p className="text-gray-600 mb-6">View or download candidate's resume</p>
              <a
                href={candidateData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                <FaBook className="mr-2" /> View Resume
              </a>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-800">Email</span>
                  </div>
                  <p className="text-gray-700">{candidateData.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-800">Phone</span>
                  </div>
                  <p className="text-gray-700">{candidateData.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaBriefcase className="text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-800">Position Applied</span>
                  </div>
                  <p className="text-gray-700">{interview.role}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-800">Interview Date</span>
                  </div>
                  <p className="text-gray-700">{new Date(interview.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Interview Result View ---
function InterviewResultView({ interview, onBack, onCandidateSelect }) {
  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mr-4"
        >
          <FaChevronLeft className="mr-2" /> Back to Results
        </button>
        <h2 className="text-3xl font-bold text-gray-800">{interview.role} - Results</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Interview Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaQuestion className="text-blue-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{interview.questions?.length || 0}</p>
            <p className="text-gray-600">Total Questions</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-green-700">{interview.candidates?.length || 0}</p>
            <p className="text-gray-600">Candidates Interviewed</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaChartLine className="text-purple-600 text-2xl" />
            </div>
            <p className="text-2xl font-bold text-purple-700">85%</p>
            <p className="text-gray-600">Average Score</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Candidate Results (Sorted by Score)</h3>
        <div className="grid gap-4">
          {interview.candidates
            ?.sort((a, b) => {
              const scoreA = a.scores?.length > 0 
                ? Math.round(a.scores.reduce((acc, score) => {
                    const overallScore = score.overallscore || '0'
                    const numericScore = parseInt(overallScore.split(' ')[0]) || 0
                    return acc + numericScore
                  }, 0) / a.scores.length * 20)
                : 0
              const scoreB = b.scores?.length > 0 
                ? Math.round(b.scores.reduce((acc, score) => {
                    const overallScore = score.overallscore || '0'
                    const numericScore = parseInt(overallScore.split(' ')[0]) || 0
                    return acc + numericScore
                  }, 0) / b.scores.length * 20)
                : 0
              return scoreB - scoreA // Highest score first
            })
            ?.map((candidate, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                 onClick={() => onCandidateSelect(candidate)}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {candidate.email?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{candidate.email}</h4>
                    <p className="text-sm text-gray-600">Candidate #{index + 1}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {candidate.cheatingDetected && (
                    <div className="flex items-center text-red-600">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm font-medium">Suspicious Activity</span>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">
                      {candidate.scores?.length > 0 
                        ? Math.round(candidate.scores.reduce((acc, score) => {
                            const overallScore = score.overallscore || '0'
                            const numericScore = parseInt(overallScore.split(' ')[0]) || 0
                            return acc + numericScore
                          }, 0) / candidate.scores.length * 20)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500">AI Score</p>
                  </div>
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      candidate.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidate.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <FaChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <FaUsers className="text-4xl mb-4 mx-auto" />
              <p>No candidates have completed this interview yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Results ---
function Results() {
  const [interviews, setInterviews] = useState([])
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get('/hr/interviews')
        setInterviews(response.data.interviews || [])
      } catch (err) {
        console.error('Failed to fetch interviews:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  if (selectedCandidate) {
    return (
      <CandidateDetailView 
        candidate={selectedCandidate} 
        interview={selectedInterview}
        onBack={() => setSelectedCandidate(null)}
      />
    )
  }

  if (selectedInterview) {
    return (
      <InterviewResultView 
        interview={selectedInterview}
        onBack={() => setSelectedInterview(null)}
        onCandidateSelect={(candidate) => setSelectedCandidate(candidate)}
      />
    )
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Interview Results & Analytics</h2>
      
      {interviews.length > 0 ? (
        <div className="grid gap-6">
          {interviews.map((interview, index) => (
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
  )
}

// --- Help ---
function Help() {
  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Help & Support</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Find quick answers to common questions or reach out to our dedicated support team for assistance.
      </p>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <h3 className="font-semibold text-blue-700 text-xl mb-2">How do I create a new interview?</h3>
          <p className="text-gray-700">
            Navigate to the <span className="font-medium text-blue-600">Dashboard</span> and click on the "Create New Interview" button located at the top right of the overview section.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <h3 className="font-semibold text-blue-700 text-xl mb-2">What kind of questions can the AI handle?</h3>
          <p className="text-gray-700">
            Our AI supports a wide range of question types including open-ended, technical, multiple-choice, and case study questions. You can define detailed expected answers for precise evaluation.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <h3 className="font-semibold text-blue-700 text-xl mb-2">Is my data secure?</h3>
          <p className="text-gray-700">
            Yes, we prioritize your data security. All data is encrypted, and we are compliant with GDPR regulations. Candidate consent is always obtained before any recording takes place.
          </p>
        </div>
      </div>
      <button className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300 mt-10 font-semibold shadow-md">
        Contact Support
      </button>
    </div>
  )
}

// --- Documentation ---
function Documentation() {
  return (
    <div className="p-6 md:p-8 bg-gray-50 rounded-xl min-h-[calc(100vh-250px)]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Documentation & Guides</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Access our comprehensive guides and resources to help you master NeoRecruiter and leverage all its features.
      </p>
      <ul className="list-disc list-inside space-y-3 text-blue-700 font-semibold text-lg">
        <li>
          <a href="#" className="hover:underline hover:text-blue-900 transition duration-200">
            Getting Started with NeoRecruiter: A Step-by-Step Guide
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline hover:text-blue-900 transition duration-200">
            Advanced AI Interview Techniques for Recruiters
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline hover:text-blue-900 transition duration-200">
            Integrating NeoRecruiter with Your Existing ATS
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline hover:text-blue-900 transition duration-200">
            Understanding and Interpreting AI Interview Reports
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline hover:text-blue-900 transition duration-200">
            Best Practices for Candidate Experience with AI
          </a>
        </li>
      </ul>
      <div className="mt-10 p-6 bg-yellow-100 rounded-lg border border-yellow-200 text-yellow-800 font-medium text-lg shadow-md">
        <p>Full documentation is available online. We regularly update our resources, so check back often!</p>
      </div>
    </div>
  )
}

// --- Main Dashboard Layout ---
export default function DashboardPage({ onLogout }) {
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard")
  const [isCreatingInterview, setIsCreatingInterview] = useState(false)
  const { user } = useContext(UserDataContext)

  const renderContent = () => {
    if (isCreatingInterview) {
      return <CreateInterviewForm onComplete={() => setIsCreatingInterview(false)} />
    }
    switch (activeDashboardTab) {
      case "dashboard":
        return <DashboardHome onCreateNewInterview={() => setIsCreatingInterview(true)} />
      case "schedules":
        return <Schedules />
      case "results":
        return <Results />
      case "help":
        return <Help />
      case "documentation":
        return <Documentation />
      default:
        return <DashboardHome onCreateNewInterview={() => setIsCreatingInterview(true)} />
    }
  }

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
                { key: "help", icon: FaQuestionCircle, label: "Help" },
                { key: "documentation", icon: FaBook, label: "Documentation" }
              ].map(({ key, icon: Icon, label }) => (
                <li key={key} className="mb-3">
                  <button
                    onClick={() => {
                      setActiveDashboardTab(key)
                      setIsCreatingInterview(false)
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

      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}