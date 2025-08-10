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
  FaVideo,
  FaCheckCircle
} from "react-icons/fa"
import { UserDataContext } from "../context/UserContext"
import api from "../utils/api"
import AnalyticsDashboard from './Charts'

function DashboardHome({ onCreateNewInterview }) {
  const { user } = useContext(UserDataContext)
  const [stats, setStats] = useState({ interviews: 0, candidates: 0, avgScore: 0 })
  const [recentInterviews, setRecentInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const interviewsRes = await api.get('/hr/interviews');
        const interviews = interviewsRes.data.interviews || [];
        const totalCandidates = interviews.reduce((sum, interview) => sum + (interview.candidates?.length || 0), 0);
        
        let avgScore = 0;
        let totalScores = 0;
        let scoreCount = 0;
        
        interviews.forEach(interview => {
          if (interview.candidates && interview.candidates.length > 0) {
            interview.candidates.forEach(candidate => {
              if (candidate.scores && candidate.scores.length > 0) {
                candidate.scores.forEach(score => {
                  const overallScore = score.OverallCompetency || score.overallscore || '0';
                  const numericScore = parseInt(overallScore.toString().split(' ')[0]) || 0;
                  totalScores += numericScore;
                  scoreCount++;
                });
              }
            });
          }
        });
        
        if (scoreCount > 0) {
          avgScore = Math.round((totalScores / scoreCount) * 20); 
        }
        
        setStats({ 
          interviews: interviews.length, 
          candidates: totalCandidates, 
          avgScore: avgScore
        });
        setRecentInterviews(interviews.slice(-5).reverse());
      } catch (err) {
        console.error('Failed to fetch interview data:', err);
        setStats({ interviews: 0, candidates: 0, avgScore: 0 });
        setRecentInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user])

  if (!user || loading) return <div className="p-8 text-center">Loading...</div>
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Manage your interviews and track candidate progress</p>
        </div>
        <button
          onClick={onCreateNewInterview}
          className="bg-blue-500 text-white px-4 py-2 rounded border border-blue-600 hover:bg-blue-600 flex items-center font-normal"
        >
          <FaPlus className="mr-2" />
          New Interview
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded">
              <FaBriefcase className="text-gray-700 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Interviews</p>
              <p className="text-xl font-medium text-gray-800">{stats.interviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded">
              <FaUserGraduate className="text-gray-700 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Candidates</p>
              <p className="text-xl font-medium text-gray-800">{stats.candidates}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded">
              <FaChartLine className="text-gray-700 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Average Score</p>
              <p className="text-xl font-medium text-gray-800">{stats.avgScore}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded border border-gray-300 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded">
              <span className="text-gray-700 text-lg font-medium">₹</span>
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
              <p className="text-xl font-medium text-gray-800">₹{user?.Balance || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded border border-gray-300 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Recent Interviews</h3>
        </div>
        <div className="p-4">
        {recentInterviews.length > 0 ? (
          <div className="space-y-3">
            {recentInterviews.map((interview, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded">
                    <FaBriefcase className="text-gray-600 text-sm" />
                  </div>
                  <div>
                    <p className="font-normal text-gray-800">{interview.role}</p>
                    <p className="text-sm text-gray-500">{interview.technicalDomain || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaUsers className="mr-1" />
                    {interview.candidates?.length || 0}
                  </div>
                  <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <FaBriefcase className="text-gray-400 text-2xl mb-2 mx-auto" />
            <p className="text-gray-500">No interviews created yet</p>
            <p className="text-sm text-gray-400">Create your first interview to get started</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

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
    <div className="p-6 bg-white rounded border border-gray-300 shadow-sm min-h-[calc(100vh-250px)] flex flex-col">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center mx-auto mb-3">
          <FaPlus className="text-white text-lg" />
        </div>
        <h2 className="text-2xl font-medium text-gray-800 mb-2">
          Create New Interview
        </h2>
        <p className="text-gray-600">Set up your interview in 3 steps</p>
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

      <div className="relative mb-8">
        <div className="flex justify-between items-center w-full max-w-lg mx-auto">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className={`flex flex-col items-center ${step >= stepNum ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-white text-sm border-2 ${
                step >= stepNum 
                  ? "bg-blue-500 border-blue-500" 
                  : "bg-gray-300 border-gray-300"
              }`}>
                {step > stepNum ? <FaCheck /> : stepNum}
              </div>
              <p className="mt-2 text-sm font-medium">
                {stepNum === 1 ? "Details" : stepNum === 2 ? "Questions" : "Candidates"}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-grow">
        {step === 1 && (
          <div className="space-y-6 bg-gray-50 p-6 rounded border border-gray-200">
            <div>
              <label htmlFor="companyName" className="block text-gray-700 text-sm font-medium mb-2">
                <FaBuilding className="inline mr-2 text-gray-600" /> Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
                placeholder="e.g., Tech Innovations Pvt. Ltd."
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label htmlFor="roleName" className="block text-gray-700 text-sm font-medium mb-2">
                <FaBriefcase className="inline mr-2 text-gray-600" /> Role Name
              </label>
              <input
                type="text"
                id="roleName"
                name="roleName"
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 ${errors.roleName ? "border-red-500" : "border-gray-300"}`}
                placeholder="e.g., Senior Software Engineer"
                value={formData.roleName}
                onChange={handleChange}
                required
              />
              {errors.roleName && <p className="text-red-500 text-sm mt-1">{errors.roleName}</p>}
            </div>
            <div>
              <label htmlFor="technicalName" className="block text-gray-700 text-sm font-medium mb-2">
                <FaLaptopCode className="inline mr-2 text-gray-600" /> Technical/Domain Name 
              </label>
              <input
                type="text"
                id="technicalName"
                name="technicalName"
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 border-gray-300"
                placeholder="e.g., Fullstack Development, Marketing Analytics"
                value={formData.technicalName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 bg-gray-50 p-6 rounded border border-gray-200">
            <div>
              <label htmlFor="numQuestions" className="block text-gray-700 text-sm font-medium mb-2">
                <FaQuestion className="inline mr-2 text-gray-600" /> Number of Questions
              </label>
              <input
                type="number"
                id="numQuestions"
                name="numQuestions"
                min="1"
                max="20"
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 ${errors.numQuestions ? "border-red-500" : "border-gray-300"}`}
                value={formData.numQuestions || ''}
                onChange={handleChange}
                required
              />
              {errors.numQuestions && <p className="text-red-500 text-sm mt-1">{errors.numQuestions}</p>}
            </div>
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4">Define Your Questions:</h3>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto">
              {formData.questions.map((q, index) => (
                <div key={index} className="border p-4 rounded bg-white border-gray-300">
                  <p className="font-medium text-gray-700 mb-3">Question {index + 1}</p>
                  <div className="mb-3">
                    <label htmlFor={`question-${index}-text`} className="block text-gray-700 text-sm font-medium mb-1">
                      Question Text
                    </label>
                    <textarea
                      id={`question-${index}-text`}
                      name={`question-${index}-text`}
                      rows="2"
                      className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 ${errors[`question-${index}-text`] ? "border-red-500" : "border-gray-300"}`}
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
                    <label htmlFor={`question-${index}-answer`} className="block text-gray-700 text-sm font-medium mb-1">
                      Expected Answer (for AI analysis)
                    </label>
                    <textarea
                      id={`question-${index}-answer`}
                      name={`question-${index}-answer`}
                      rows="3"
                      className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 ${errors[`question-${index}-answer`] ? "border-red-500" : "border-gray-300"}`}
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
          <div className="space-y-6 bg-gray-50 p-6 rounded border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Invite Candidates:</h3>
            <div>
              <label htmlFor="candidateEmails" className="block text-gray-700 text-sm font-medium mb-2">
                <FaEnvelope className="inline mr-2 text-gray-600" /> Enter Candidate Emails (comma-separated)
              </label>
              <textarea
                id="candidateEmails"
                name="candidateEmails"
                rows="4"
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 ${errors.candidateEmails ? "border-red-500" : "border-gray-300"}`}
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
              <label htmlFor="candidateFile" className="block text-gray-700 text-sm font-medium mb-2">
                <FaUpload className="inline mr-2 text-gray-600" /> Upload CSV File (Email addresses in one column)
              </label>
              <input
                type="file"
                id="candidateFile"
                name="candidateFile"
                accept=".csv"
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 ${errors.candidateFile ? "border-red-500" : "border-gray-300"}`}
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

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium flex items-center hover:bg-gray-300"
          >
            <FaChevronLeft className="mr-2" /> Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={handleNext}
            className={`px-6 py-2 bg-blue-500 text-white rounded font-medium flex items-center hover:bg-blue-600 ${step === 1 ? "ml-auto" : ""}`}
          >
            Next <FaChevronRight className="ml-2" />
          </button>
        )}
        {step === 3 && (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded font-medium flex items-center hover:bg-green-600 ml-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Create Interview
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

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

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="p-6 bg-white min-h-[calc(100vh-250px)]">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Interview Schedules</h2>
      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((interview, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded border border-gray-300">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{interview.role}</h3>
                  <p className="text-gray-600 text-sm">{interview.technicalDomain || 'General'}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FaQuestion className="text-gray-500 mr-2" />
                  {interview.questions?.length || 0} Questions
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaUsers className="text-gray-500 mr-2" />
                  {interview.candidates?.length || 0} Candidates
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  {new Date(interview.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                  <FaEye className="inline mr-1" /> View
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaCalendarAlt className="text-4xl text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Interviews Scheduled</h3>
          <p className="text-gray-500">Create your first interview to get started</p>
        </div>
      )}
    </div>
  )
}


function CandidateDetailView({ candidate, interview, onBack }) {
  const [activeTab, setActiveTab] = useState('answers')
  
  
  const candidateData = {
    name: candidate.name || 'Not Provided',
    email: candidate.email,
    phone: candidate.phone || 'Not Provided',
    resume: candidate.resume || null,
    answers: candidate.answers || [],
    scores: candidate.scores || [],
    overallScore: candidate.scores?.length > 0 
      ? Math.round(candidate.scores.reduce((acc, score) => {
          const overallScore = score.OverallCompetency || score.overallscore || '0'
          const numericScore = parseInt(overallScore.toString().split(' ')[0]) || 0
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
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {candidateData.name.charAt(0)}
            </div>
            {candidateData.overallScore >= 80 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-gray-800">{candidateData.name}</h3>
              {candidateData.overallScore >= 80 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Top Performer
                </span>
              )}
            </div>
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
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <FaBook className="text-6xl text-blue-400 mb-4 mx-auto" />
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


function TopPerformerBadge({ rank, score }) {
  const badges = {
    1: { icon: '🥇', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'text-yellow-900', label: '1st Place' },
    2: { icon: '🥈', color: 'bg-gradient-to-r from-gray-300 to-gray-500', text: 'text-gray-900', label: '2nd Place' },
    3: { icon: '🥉', color: 'bg-gradient-to-r from-orange-400 to-orange-600', text: 'text-orange-900', label: '3rd Place' }
  };
  
  const badge = badges[rank];
  if (!badge) return null;
  
  return (
    <div className={`${badge.color} ${badge.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse`}>
      <span className="text-sm">{badge.icon}</span>
      <span>{badge.label}</span>
      <span className="ml-1">({score}%)</span>
    </div>
  );
}


function InterviewResultView({ interview, onBack, onCandidateSelect }) {
  return (
    <div className="p-6 bg-white min-h-[calc(100vh-250px)]">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-2"
        >
          ← Back to Results
        </button>
        <h2 className="text-lg font-medium text-gray-800">{interview.role} Results</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {interview.questions?.length || 0} questions • {interview.candidates?.length || 0} candidates
        </p>
      </div>

      <div className="border border-gray-300">
        <div className="bg-gray-50 p-3 border-b border-gray-300">
          <h3 className="font-medium text-gray-800">Candidates</h3>
        </div>
        <div>
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
              return scoreB - scoreA
            })
            ?.map((candidate, index) => {
              const candidateScore = candidate.scores?.length > 0 
                ? Math.round(candidate.scores.reduce((acc, score) => {
                    const overallScore = score.OverallCompetency || score.overallscore || '0'
                    const numericScore = parseInt(overallScore.toString().split(' ')[0]) || 0
                    return acc + numericScore
                  }, 0) / candidate.scores.length * 20)
                : 0;
              
              return (
            <div key={index} className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                 onClick={() => onCandidateSelect(candidate)}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{candidate.email}</p>
                  <p className="text-sm text-gray-500">Rank #{index + 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{candidateScore}%</p>
                  <p className="text-sm text-gray-500">
                    {candidate.status === 'completed' ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
              );
            }) || (
            <div className="p-6 text-center text-gray-500">
              <p>No candidates yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function Results() {
  const [interviews, setInterviews] = useState([])
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    scoreRange: [0, 100],
    sortBy: 'score',
    sortOrder: 'desc',
    showCheating: true
  })

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

  // Filter and sort interviews based on filters
  const filteredInterviews = interviews.filter(interview => {
    return interview.role.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
           interview.technicalDomain?.toLowerCase().includes(filters.searchTerm.toLowerCase());
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-white min-h-[calc(100vh-250px)]">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Interview Results</h2>
      
      <div className="mb-4">
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleFilterChange}
          placeholder="Search interviews..."
          className="px-3 py-2 border border-gray-300 w-64"
        />
      </div>
      
      {filteredInterviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview, index) => (
            <div key={index} className="border border-gray-300 p-3">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium text-gray-800">{interview.role}</h3>
                  <p className="text-sm text-gray-600">{interview.technicalDomain || 'General'}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{new Date(interview.createdAt).toLocaleDateString()}</p>
                  <p>{interview.candidates?.length || 0} candidates</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedInterview(interview)}
                className="bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
              >
                View Results
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No interview results yet</p>
        </div>
      )}
    </div>
  )
}


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


export default function DashboardPage({ onLogout }) {
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard")
  const [isCreatingInterview, setIsCreatingInterview] = useState(false)
  const { user } = useContext(UserDataContext)

  const [interviews, setInterviews] = useState([])
  
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // Try to get interviews from API
        const response = await api.get('/hr/interviews');
        if (response.data && response.data.interviews) {
          setInterviews(response.data.interviews);
        } else {
          setInterviews([]);
        }
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
        setInterviews([]);
      }
    };
    
    if (user) fetchInterviews();
  }, [user])

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

      default:
        return <DashboardHome onCreateNewInterview={() => setIsCreatingInterview(true)} />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-white border-r border-gray-300 flex flex-col shadow-sm">
        <div className="p-5">
          <div className="flex items-center mb-6">
            <div className="text-lg font-medium text-gray-800">
              <span className="text-blue-600">Neo</span>Recruiter
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { key: "dashboard", icon: FaTachometerAlt, label: "Dashboard" },
              { key: "schedules", icon: FaCalendarAlt, label: "Schedules" },
              { key: "results", icon: FaClipboardList, label: "Results" }
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveDashboardTab(key)
                  setIsCreatingInterview(false)
                }}
                className={`flex items-center w-full px-3 py-2 text-sm font-normal rounded ${
                  activeDashboardTab === key && !isCreatingInterview
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon className="mr-3 text-sm" /> {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-normal text-red-600 hover:bg-red-50 rounded"
          >
            <FaSignOutAlt className="mr-3 text-sm" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-300 px-6 py-3 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium text-gray-800 capitalize">
              {isCreatingInterview ? "Create Interview" : activeDashboardTab}
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {user?.companyName || 'Company'}
              </span>
              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-medium">
                {user?.companyName?.charAt(0) || 'C'}
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>


    </div>
  )
}
