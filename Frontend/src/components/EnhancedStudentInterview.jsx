import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLaptop, FaMicrophone, FaCamera, FaClipboard, FaExclamationTriangle, 
         FaGraduationCap, FaBriefcase, FaCode, FaLinkedin, FaGithub, FaEnvelope,
         FaVideo, FaStop, FaPlay, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import api from '../utils/api';
import { generateQuestionsWithGemini } from '../utils/geminiApi';

const EnhancedStudentInterview = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [videoMode, setVideoMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    skills: ''
  });
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Generate questions based on role
      await generateInterviewQuestions();
      setStep(2);
    } catch (err) {
      setError('Failed to generate interview questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate interview questions using Gemini AI
  const generateInterviewQuestions = async () => {
    try {
      // Try to use Gemini API
      const generatedQuestions = await generateQuestionsWithGemini(
        formData.role,
        formData.experience,
        formData.skills
      );
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setAnswers(new Array(generatedQuestions.length).fill(''));
        return;
      }
      
      throw new Error('Failed to generate questions');
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback to default questions
      const defaultQuestions = [
        `Tell me about your experience with ${formData.role.toLowerCase()}.`,
        `What projects have you worked on related to ${formData.role.toLowerCase()}?`,
        `Describe a challenging problem you solved as a ${formData.role.toLowerCase()}.`,
        `What are your strengths and weaknesses as a ${formData.role.toLowerCase()}?`,
        `Where do you see yourself in 5 years in the ${formData.role.toLowerCase()} field?`
      ];
      
      setQuestions(defaultQuestions);
      setAnswers(new Array(defaultQuestions.length).fill(''));
    }
  };
  
  // Request camera and microphone permissions
  const setupMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      return true;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera or microphone. Please ensure permissions are granted.');
      return false;
    }
  };
  
  // Start video recording
  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      
      // Add the recorded video to our array
      setRecordedVideos(prev => {
        const newVideos = [...prev];
        newVideos[currentQuestionIndex] = videoURL;
        return newVideos;
      });
      
      // Update answers array with a placeholder for video
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = '[VIDEO RESPONSE]';
      setAnswers(newAnswers);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };
  
  // Stop video recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Handle text answer change
  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };
  
  // Submit answer and move to next question
  const submitAnswer = () => {
    if (videoMode && !recordedVideos[currentQuestionIndex]) {
      setError('Please record a video answer before continuing');
      return;
    }
    
    if (!videoMode && !currentAnswer.trim()) {
      setError('Please provide an answer before continuing');
      return;
    }
    
    setError('');
    
    // Save text answer if in text mode
    if (!videoMode) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = currentAnswer;
      setAnswers(newAnswers);
    }
    
    // Move to next question or finish interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      finishInterview();
    }
  };
  
  // Finish the interview and generate analysis
  const finishInterview = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would send the answers to your backend
      // for analysis with Gemini AI
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock analysis
      const mockAnalysis = {
        overallScore: Math.floor(Math.random() * 31) + 70, // 70-100
        strengths: [
          'Clear communication skills',
          'Strong technical knowledge',
          'Good problem-solving approach'
        ],
        improvements: [
          'Could provide more specific examples',
          'Consider discussing alternative approaches'
        ],
        questionFeedback: questions.map((q, i) => ({
          question: q,
          score: Math.floor(Math.random() * 31) + 70,
          feedback: 'Good answer with room for improvement.'
        })),
        skillAssessment: {
          technical: Math.floor(Math.random() * 31) + 70,
          communication: Math.floor(Math.random() * 31) + 70,
          problemSolving: Math.floor(Math.random() * 31) + 70,
          domainKnowledge: Math.floor(Math.random() * 31) + 70
        },
        recommendation: 'Potential Hire'
      };
      
      setAnalysis(mockAnalysis);
      setInterviewComplete(true);
      setStep(3);
      
      // Simulate sending email report
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
      
    } catch (err) {
      setError('Failed to analyze interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clean up media streams when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Set up media devices when entering the interview
  useEffect(() => {
    if (step === 2) {
      setupMediaDevices();
    }
  }, [step]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NeoRecruiter</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm">AI Interview</span>
            {isRecording && (
              <span className="flex items-center">
                <span className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                Recording
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-4xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-700 font-medium">Loading...</span>
          </div>
        )}

        {!isLoading && step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Student Interview Setup</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                    Role You're Applying For *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2"
                    min="0"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
                    Key Skills
                  </label>
                  <div className="relative">
                    <FaCode className="absolute left-3 top-5 text-gray-400" />
                    <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="React, Node.js, MongoDB, Express, JavaScript, TypeScript"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Start Interview
                </button>
              </div>
            </form>
          </div>
        )}

        {!isLoading && step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">
                {formData.role} Interview
              </h2>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Question:</h3>
              <p className="text-gray-800">{questions[currentQuestionIndex]}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-bold" htmlFor="answer">
                  Your Answer:
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Answer mode:</span>
                  <button 
                    type="button"
                    onClick={() => setVideoMode(false)}
                    className={`px-3 py-1 text-sm rounded-l-md ${!videoMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Text
                  </button>
                  <button 
                    type="button"
                    onClick={() => setVideoMode(true)}
                    className={`px-3 py-1 text-sm rounded-r-md ${videoMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Video
                  </button>
                </div>
              </div>
              
              {videoMode ? (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-64">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${recordedVideos[currentQuestionIndex] ? 'hidden' : ''}`}
                  ></video>
                  
                  {recordedVideos[currentQuestionIndex] && (
                    <video
                      src={recordedVideos[currentQuestionIndex]}
                      controls
                      className="w-full h-full object-cover"
                    ></video>
                  )}
                  
                  {!recordedVideos[currentQuestionIndex] && !isRecording && (
                    <button 
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center"
                      onClick={startRecording}
                    >
                      <FaVideo className="mr-2" />
                      Start Recording
                    </button>
                  )}
                  
                  {isRecording && (
                    <button 
                      type="button"
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center"
                      onClick={stopRecording}
                    >
                      <FaStop className="mr-2" />
                      Stop Recording
                    </button>
                  )}
                  
                  {recordedVideos[currentQuestionIndex] && (
                    <button 
                      type="button"
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
                      onClick={() => {
                        setRecordedVideos(prev => {
                          const newVideos = [...prev];
                          newVideos[currentQuestionIndex] = null;
                          return newVideos;
                        });
                      }}
                    >
                      <FaVideo className="mr-2" />
                      Record Again
                    </button>
                  )}
                </div>
              ) : (
                <textarea
                  id="answer"
                  value={currentAnswer}
                  onChange={handleAnswerChange}
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="8"
                  placeholder="Type your answer here..."
                  required={!videoMode}
                ></textarea>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={submitAnswer}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>Next Question <FaChevronRight className="ml-2" /></>
                ) : (
                  <>Finish Interview <FaChevronRight className="ml-2" /></>
                )}
              </button>
            </div>
            
            <div className="fixed bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg border-2 border-blue-500">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              ></video>
              <div className="absolute bottom-0 left-0 right-0 bg-blue-800 bg-opacity-75 text-white text-xs p-1 flex justify-between items-center">
                <span>Live Camera</span>
                {isRecording && (
                  <span className="flex items-center">
                    <span className="animate-pulse h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                    REC
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && step === 3 && analysis && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-800 mb-2">Interview Analysis</h2>
              <p className="text-gray-600">
                Thank you for completing your interview for the {formData.role} position.
              </p>
              {emailSent && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center text-green-700 mb-2">
                    <FaEnvelope className="mr-2" /> 
                    <span className="font-semibold">Report Sent Successfully!</span>
                  </div>
                  <p className="text-sm text-green-600">
                    A detailed analysis report has been sent to {formData.email}. 
                    The report includes your performance metrics, question-by-question feedback, 
                    and personalized improvement recommendations.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={`${analysis.overallScore > 80 ? '#10B981' : analysis.overallScore > 60 ? '#3B82F6' : '#EF4444'}`}
                    strokeWidth="10"
                    strokeDasharray={`${analysis.overallScore * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#1F2937"
                  >
                    {analysis.overallScore}%
                  </text>
                </svg>
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Skill Assessment</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysis.skillAssessment).map(([skill, score]) => (
                  <div key={skill} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-700">{score}%</div>
                      <div className="text-sm text-gray-600 capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          score > 80 ? 'bg-green-600' : score > 70 ? 'bg-blue-600' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={() => {
                  setStep(1);
                  setQuestions([]);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setCurrentAnswer('');
                  setRecordedVideos([]);
                  setInterviewComplete(false);
                  setAnalysis(null);
                  setEmailSent(false);
                }}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
              >
                Try Another Interview
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-blue-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} NeoRecruiter - AI-Powered Interview Platform</p>
        </div>
      </footer>

      <style jsx="true">{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedStudentInterview;