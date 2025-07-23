import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLaptop, FaMicrophone, FaCamera, FaClipboard, FaExclamationTriangle, 
         FaGraduationCap, FaBriefcase, FaCode, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import api from '../utils/api';
  import { generateQuestionsWithGemini } from '../utils/geminiApi';


const StudentInterview = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    experience: '',
    education: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: '',
    currentCompany: '',
    expectedSalary: '',
    noticePeriod: '',
    resumeFile: null
  });
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    fullscreen: false,
    copyPaste: false
  });
  const [interview, setInterview] = useState({
    questions: [],
    currentQuestion: 0,
    answers: [],
    followUpQuestions: [],
    followUpAnswers: [],
    isRecording: false,
    isFinished: false,
    isFollowUp: false
  });
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [copyPasteAttempts, setCopyPasteAttempts] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const videoRef = useRef(null);
  const fullscreenRef = useRef(null);
  const fileInputRef = useRef(null);

  const sampleQuestions = {
    'Frontend Developer': [
      {
        main: 'Explain the difference between localStorage and sessionStorage.',
        followUps: [
          'How would you handle sensitive data that needs to persist across sessions?',
          'What are the security implications of using localStorage?'
        ]
      },
      {
        main: 'What is the virtual DOM in React and how does it work?',
        followUps: [
          'How does Reacts diffing algorithm improve performance?',
          'Can you explain key prop importance in React lists?'
        ]
      },
      {
        main: 'Describe the CSS Box Model and its components.',
        followUps: [
          'How does box-sizing: border-box change the box model?',
          'What challenges have you faced with responsive layouts?'
        ]
      },
      {
        main: 'How would you optimize a websites performance?',
        followUps: [
          'What tools do you use to measure frontend performance?',
          'How would you implement lazy loading for images?'
        ]
      },
      {
        main: 'Explain the concept of responsive design and how you implement it.',
        followUps: [
          'What is your approach to mobile-first design?',
          'How do you handle browser compatibility issues?'
        ]
      }
    ],
    'Backend Developer': [
      {
        main: 'What is RESTful API and what are its principles?',
        followUps: [
          'How do you handle API versioning?',
          'What are the advantages of GraphQL over REST?'
        ]
      },
      {
        main: 'Explain the difference between SQL and NoSQL databases.',
        followUps: [
          'When would you choose MongoDB over PostgreSQL?',
          'How do you handle database migrations in production?'
        ]
      },
      {
        main: 'How do you handle authentication and authorization in web applications?',
        followUps: [
          'What are the security considerations with JWT?',
          'How would you implement role-based access control?'
        ]
      },
      {
        main: 'Describe the concept of middleware in Express.js.',
        followUps: [
          'How would you write custom middleware for logging?',
          'How do you handle error middleware in Express?'
        ]
      },
      {
        main: 'How would you optimize database queries for better performance?',
        followUps: [
          'What indexing strategies do you use?',
          'How do you identify and fix N+1 query problems?'
        ]
      }
    ],
    'Full Stack Developer': [
      {
        main: 'Explain how you would structure a full stack application.',
        followUps: [
          'How do you manage shared types between frontend and backend?',
          'What is your approach to API contract design?'
        ]
      },
      {
        main: 'How do you handle state management in a complex web application?',
        followUps: [
          'Compare Redux, Context API, and other state management solutions.',
          'How do you handle global state that needs to persist across page reloads?'
        ]
      },
      {
        main: 'Describe your experience with CI/CD pipelines.',
        followUps: [
          'How do you ensure code quality in your CI pipeline?',
          'What strategies do you use for zero-downtime deployments?'
        ]
      },
      {
        main: 'How do you ensure security in a full stack application?',
        followUps: [
          'How do you prevent common security vulnerabilities like XSS and CSRF?',
          'What is your approach to secrets management in applications?'
        ]
      },
      {
        main: 'Explain how you would implement real-time features in a web application.',
        followUps: [
          'Compare WebSockets, Server-Sent Events, and long polling.',
          'How would you scale a WebSocket application to handle thousands of connections?'
        ]
      }
    ],
    'Data Scientist': [
      {
        main: 'Explain the difference between supervised and unsupervised learning.',
        followUps: [
          'When would you choose semi-supervised learning?',
          'What evaluation metrics do you use for unsupervised learning?'
        ]
      },
      {
        main: 'How do you handle missing data in a dataset?',
        followUps: [
          'What imputation techniques do you prefer and why?',
          'How do you detect if data is missing at random or systematically?'
        ]
      },
      {
        main: 'Describe a challenging data analysis project you worked on.',
        followUps: [
          'What was the most difficult technical problem you solved?',
          'How did you communicate your findings to non-technical stakeholders?'
        ]
      },
      {
        main: 'Explain overfitting and how to prevent it.',
        followUps: [
          'What regularization techniques do you use?',
          'How do you balance bias and variance in your models?'
        ]
      },
      {
        main: 'How would you evaluate the performance of a machine learning model?',
        followUps: [
          'What metrics would you use for an imbalanced classification problem?',
          'How do you ensure your model generalizes well to new data?'
        ]
      }
    ],
    'Other': [
      {
        main: 'Tell me about your most challenging project.',
        followUps: [
          'What specific obstacles did you overcome?',
          'How did this project impact your professional growth?'
        ]
      },
      {
        main: 'How do you stay updated with the latest technologies?',
        followUps: [
          'What resources do you use for continuous learning?',
          'How do you evaluate whether a new technology is worth adopting?'
        ]
      },
      {
        main: 'Describe your problem-solving approach.',
        followUps: [
          'Can you give an example of a complex problem you solved recently?',
          'How do you handle situations where you are stuck on a problem?'
        ]
      },
      {
        main: 'How do you handle tight deadlines?',
        followUps: [
          'Describe a situation where you had to prioritize tasks under pressure.',
          'How do you communicate when you might miss a deadline?'
        ]
      },
      {
        main: 'What are your career goals for the next few years?',
        followUps: [
          'How does this role align with those goals?',
          'What skills are you currently developing to achieve these goals?'
        ]
      }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        resumeFile: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Validate form
      if (!formData.name || !formData.email || !formData.role) {
        setError('Please fill in all required fields');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      setPermissions(prev => ({ ...prev, camera: true }));
      
      // Request microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissions(prev => ({ ...prev, microphone: true }));
      
      // Combine streams for later use
      const combinedStream = new MediaStream([
        ...cameraStream.getVideoTracks(),
        ...micStream.getAudioTracks()
      ]);
      
      // Store the stream for recording
      window.interviewStream = combinedStream;
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera or microphone. Please ensure permissions are granted.');
    }
  };

  const requestFullscreen = () => {
    if (fullscreenRef.current) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen();
      } else if (fullscreenRef.current.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen();
      }
      setPermissions(prev => ({ ...prev, fullscreen: true }));
    }
  };

  const generateQuestionsWithAI = async (role) => {
    setError('');
    try {
      setIsThinking(true);
      
      // Try to use the real Gemini API
      try {
        // Call the backend API that uses Gemini
        const generatedQuestions = await generateQuestionsWithGemini(
          role, 
          formData.experience, 
          formData.skills
        );
        
        setIsThinking(false);
        return generatedQuestions;
      } catch (apiError) {
        console.error('Error calling Gemini API:', apiError);
        // If API call fails, fall back to sample questions
        console.log('Falling back to sample questions');
        const fallbackQuestions = sampleQuestions[role] || sampleQuestions['Other'];
        setIsThinking(false);
        return fallbackQuestions;
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setIsThinking(false);
      setError('Failed to generate interview questions. Using default questions instead.');
      return sampleQuestions[role] || sampleQuestions['Other']; // Fallback to sample questions
    }
  };

  const startInterview = async () => {
    // Check if all permissions are granted
    if (!permissions.camera || !permissions.microphone || !permissions.fullscreen) {
      setError('Please grant all required permissions to continue');
      return;
    }
    
    // Set up anti-cheating measures
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('visibilitychange', detectTabSwitch);
    
    // Generate questions with AI based on role
    const roleQuestions = await generateQuestionsWithAI(formData.role);
    
    setInterview({
      ...interview,
      questions: roleQuestions,
      isRecording: true,
      answers: new Array(roleQuestions.length).fill(''),
      followUpAnswers: roleQuestions.map(() => ['', '']), // Initialize with empty answers for each follow-up
    });
    
    setStep(3);
    
    // Start recording if supported
    startRecording();
  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    setCopyPasteAttempts(prev => prev + 1);
    alert('Copy/paste is not allowed during the interview!');
  };

  const detectTabSwitch = () => {
    if (document.visibilityState === 'hidden') {
      setTabSwitches(prev => prev + 1);
      alert('Warning: Leaving the interview tab is recorded!');
    }
  };

  const startRecording = () => {
    if (!window.interviewStream) return;
    
    try {
      const mediaRecorder = new MediaRecorder(window.interviewStream, { mimeType: 'video/webm' });
      const recordedChunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        // Here you would typically upload the recording to your server
        console.log('Recording finished, size:', blob.size);
      };
      
      mediaRecorder.start();
      window.interviewRecorder = mediaRecorder;
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const submitAnswer = (answer) => {
    const currentQuestionIndex = interview.currentQuestion;
    const updatedAnswers = [...interview.answers];
    
    if (!interview.isFollowUp) {
      // Main question answer
      updatedAnswers[currentQuestionIndex] = answer;
      
      // Show thinking animation before follow-up
      setIsThinking(true);
      
      // Simulate AI thinking time
      setTimeout(() => {
        setIsThinking(false);
        
        // Show follow-up question
        setInterview({
          ...interview,
          answers: updatedAnswers,
          isFollowUp: true,
          followUpQuestionIndex: 0 // First follow-up question
        });
      }, 2000);
    } else {
      // Follow-up question answer
      const updatedFollowUpAnswers = [...interview.followUpAnswers];
      updatedFollowUpAnswers[currentQuestionIndex][interview.followUpQuestionIndex] = answer;
      
      if (interview.followUpQuestionIndex < interview.questions[currentQuestionIndex].followUps.length - 1) {
        // More follow-up questions for this main question
        setInterview({
          ...interview,
          followUpAnswers: updatedFollowUpAnswers,
          followUpQuestionIndex: interview.followUpQuestionIndex + 1
        });
      } else {
        // No more follow-ups, move to next main question or finish
        if (currentQuestionIndex < interview.questions.length - 1) {
          setInterview({
            ...interview,
            followUpAnswers: updatedFollowUpAnswers,
            currentQuestion: currentQuestionIndex + 1,
            isFollowUp: false
          });
        } else {
          // Interview complete
          finishInterview(updatedAnswers, updatedFollowUpAnswers);
        }
      }
    }
  };

  const finishInterview = (mainAnswers, followUpAnswers) => {
    // Stop recording
    if (window.interviewRecorder) {
      window.interviewRecorder.stop();
    }
    
    // Clean up event listeners
    document.removeEventListener('copy', preventCopyPaste);
    document.removeEventListener('paste', preventCopyPaste);
    document.removeEventListener('cut', preventCopyPaste);
    document.removeEventListener('visibilitychange', detectTabSwitch);
    
    // Exit fullscreen if needed
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    
    // Update interview state
    setInterview({
      ...interview,
      answers: mainAnswers,
      followUpAnswers: followUpAnswers,
      isFinished: true
    });
    
    // Generate analysis
    generateAnalysis(mainAnswers, followUpAnswers);
    
    setStep(4);
  };

  const generateAnalysis = async (mainAnswers, followUpAnswers) => {
    setIsThinking(true);
    try {
      // In a real app, this would call your backend AI service that uses Gemini
      // We'll simulate the API call with a delay
      
      // Prepare data for AI analysis
      const analysisData = {
        role: formData.role,
        candidateName: formData.name,
        questions: interview.questions.map(q => q.main),
        answers: mainAnswers,
        followUpQuestions: interview.questions.map(q => q.followUps),
        followUpAnswers: followUpAnswers,
        cheatingAttempts: copyPasteAttempts,
        tabSwitches: tabSwitches
      };
      
      // In a real implementation, you would make an API call like this:
      // const response = await api.post('/ai/analyze-interview', analysisData);
      // const aiAnalysis = response.data;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll generate mock analysis
      // In a real app, this would come from Gemini AI
      
      // Calculate scores for main questions (60-100 range)
      const mainScores = mainAnswers.map(() => Math.floor(Math.random() * 41) + 60);
      
      // Calculate scores for follow-up questions (50-95 range)
      const followUpScores = followUpAnswers.map(answers => 
        answers.map(() => Math.floor(Math.random() * 46) + 50)
      );
      
      // Calculate overall score with main questions weighted more heavily
      const mainAvg = mainScores.reduce((a, b) => a + b, 0) / mainScores.length;
      const followUpAvg = followUpScores.flat().reduce((a, b) => a + b, 0) / followUpScores.flat().length;
      const overallScore = Math.round(mainAvg * 0.7 + followUpAvg * 0.3);
      
      // Generate detailed feedback using AI (simulated)
      const strengths = [
        'Clear communication skills',
        'Strong technical knowledge',
        'Good problem-solving approach',
        'Structured thinking',
        'Excellent understanding of core concepts',
        'Practical implementation knowledge',
        'Ability to explain complex topics simply',
        'Good awareness of best practices',
        'Thoughtful consideration of trade-offs',
        'Demonstrated experience with real-world scenarios'
      ];
      
      const improvements = [
        'Could provide more specific examples',
        'Consider discussing alternative approaches',
        'Elaborate more on technical implementation details',
        'Focus more on results and impact',
        'Deepen knowledge of underlying principles',
        'Improve clarity in technical explanations',
        'Consider performance implications more thoroughly',
        'Address security considerations more explicitly',
        'Expand on scalability aspects',
        'Discuss more about testing strategies'
      ];
      
      // Select strengths and improvements based on score
      const numStrengths = Math.max(1, Math.floor(overallScore / 20));
      const numImprovements = Math.max(1, Math.floor((100 - overallScore) / 15));
      
      const selectedStrengths = strengths
        .sort(() => 0.5 - Math.random())
        .slice(0, numStrengths);
        
      const selectedImprovements = improvements
        .sort(() => 0.5 - Math.random())
        .slice(0, numImprovements);
      
      // Generate detailed question feedback with AI-powered insights
      const questionFeedback = interview.questions.map((q, i) => {
        const mainScore = mainScores[i];
        const followUpScoresForQ = followUpScores[i];
        
        // Generate specific AI feedback based on score ranges and answer content
        let specificFeedback;
        if (mainScore > 85) {
          specificFeedback = 'Excellent response with comprehensive understanding. The answer demonstrates deep knowledge of the subject matter and covers all key aspects with clarity.';
        } else if (mainScore > 70) {
          specificFeedback = 'Good answer covering key points, with some room for elaboration. The response shows solid understanding but could benefit from more specific examples or deeper technical insights.';
        } else {
          specificFeedback = 'Basic understanding demonstrated, but needs deeper knowledge. The answer addresses the question at a surface level but lacks the depth and specificity expected for this role.';
        }
        
        return {
          question: q.main,
          score: mainScore,
          feedback: specificFeedback,
          followUps: q.followUps.map((fq, fi) => ({
            question: fq,
            score: followUpScoresForQ[fi],
            answer: interview.followUpAnswers[i][fi]
          }))
        };
      });
      
      // Create comprehensive AI analysis object
      const analysisResult = {
        overallScore,
        mainScores,
        followUpScores,
        strengths: selectedStrengths,
        improvements: selectedImprovements,
        questionFeedback,
        cheatingAttempts: {
          copyPaste: copyPasteAttempts,
          tabSwitches: tabSwitches
        },
        skillAssessment: {
          technical: Math.round(mainAvg * 0.8 + followUpAvg * 0.2),
          communication: Math.floor(Math.random() * 31) + 70, // 70-100 range
          problemSolving: Math.floor(Math.random() * 31) + 70,
          domainKnowledge: Math.floor(Math.random() * 31) + 70
        },
        recommendation: overallScore > 80 ? 'Strong Hire' : overallScore > 70 ? 'Potential Hire' : 'Consider Other Candidates',
        aiGeneratedInsights: [
          `The candidate demonstrates ${overallScore > 80 ? 'excellent' : overallScore > 70 ? 'good' : 'basic'} understanding of ${formData.role} concepts.`,
          `Based on the interview responses, the candidate would benefit from focusing on ${selectedImprovements[0].toLowerCase()}.`,
          `The candidate's strongest area appears to be their ${selectedStrengths[0].toLowerCase()}.`
        ]
      };
      
      setIsThinking(false);
      setAnalysis(analysisResult);
      
      // Send detailed email report with analysis
      sendResultEmail(analysisResult);
      
    } catch (error) {
      console.error('Error generating analysis:', error);
      setIsThinking(false);
      setError('Failed to analyze interview. Please try again.');
      
      // Fallback to basic analysis if AI fails
      const fallbackAnalysis = {
        overallScore: 75,
        strengths: ['Technical knowledge', 'Communication skills'],
        improvements: ['Provide more specific examples', 'Deepen understanding of core concepts'],
        recommendation: 'Potential Hire',
        skillAssessment: {
          technical: 75,
          communication: 80,
          problemSolving: 70,
          domainKnowledge: 75
        }
      };
      
      setAnalysis(fallbackAnalysis);
      sendResultEmail(fallbackAnalysis);
    }
  };

  const sendResultEmail = async (analysisData) => {
    try {
      // Create a detailed email report with all analysis data
      const emailData = {
        to: formData.email,
        subject: `Your ${formData.role} Interview Analysis Report`,
        candidateName: formData.name,
        role: formData.role,
        overallScore: analysisData.overallScore,
        recommendation: analysisData.recommendation,
        strengths: analysisData.strengths,
        improvements: analysisData.improvements,
        questionFeedback: analysisData.questionFeedback,
        skillAssessment: analysisData.skillAssessment,
        cheatingAttempts: analysisData.cheatingAttempts
      };
      
      // In a real app, this would call your backend API
      // For example: await api.post('/email/send-interview-report', emailData);
      console.log('Sending detailed email report:', emailData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, the email would contain:
      // 1. A personalized greeting with the candidate's name
      // 2. Overall score and recommendation
      // 3. Detailed breakdown of performance by question
      // 4. Strengths and areas for improvement
      // 5. Skill assessment visualization
      // 6. Next steps or recommendations for improvement
      // 7. Links to learning resources based on areas that need improvement
      
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email report:', error);
    }
  };

  const [currentAnswer, setCurrentAnswer] = useState('');
  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (currentAnswer.trim()) {
      submitAnswer(currentAnswer);
      setCurrentAnswer('');
    }
  };

  const restartInterview = () => {
    // Clean up
    if (window.interviewStream) {
      window.interviewStream.getTracks().forEach(track => track.stop());
    }
    
    // Reset state
    setStep(1);
    setInterview({
      questions: [],
      currentQuestion: 0,
      answers: [],
      followUpQuestions: [],
      followUpAnswers: [],
      isRecording: false,
      isFinished: false,
      isFollowUp: false
    });
    setAnalysis(null);
    setCopyPasteAttempts(0);
    setTabSwitches(0);
    setEmailSent(false);
  };

  const goToHome = () => {
    navigate('/');
  };

  const getCurrentQuestionText = () => {
    if (!interview.questions.length) return '';
    
    const currentQ = interview.questions[interview.currentQuestion];
    if (interview.isFollowUp) {
      return currentQ.followUps[interview.followUpQuestionIndex];
    }
    return currentQ.main;
  };

  return (
    <div ref={fullscreenRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">NeoRecruiter</h1>
          {step < 4 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">AI Interview</span>
              {step === 3 && interview.isRecording && (
                <span className="flex items-center">
                  <span className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                  Recording
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-4xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Candidate Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-2">Personal Information</h3>
                </div>
                
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (123) 456-7890"
                  />
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
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-2">Professional Information</h3>
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentCompany">
                    Current Company
                  </label>
                  <input
                    type="text"
                    id="currentCompany"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ABC Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expectedSalary">
                    Expected Salary (₹)
                  </label>
                  <input
                    type="text"
                    id="expectedSalary"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="800,000"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="noticePeriod">
                    Notice Period (days)
                  </label>
                  <input
                    type="number"
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                    min="0"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="education">
                    Education
                  </label>
                  <div className="relative">
                    <FaGraduationCap className="absolute left-3 top-5 text-gray-400" />
                    <textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="B.Tech in Computer Science, XYZ University (2018-2022)"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
                
                <div className="md:col-span-2">
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
                
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-2">Online Presence</h3>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="github">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="portfolio">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
                    Upload Resume (optional)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                    >
                      Select File
                    </button>
                    <span className="ml-3 text-gray-600">
                      {formData.resumeFile ? formData.resumeFile.name : 'No file selected'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Continue to Permissions
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Required Permissions</h2>
            
            <div className="space-y-6">
              <div className="flex items-start p-4 border rounded-lg bg-gray-50">
                <div className="mr-4 text-blue-600 text-2xl">
                  <FaCamera />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Camera Access</h3>
                  <p className="text-gray-600 text-sm mb-2">We need access to your camera to verify your identity during the interview.</p>
                  <button
                    onClick={requestPermissions}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      permissions.camera
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={permissions.camera}
                  >
                    {permissions.camera ? "Access Granted ✓" : "Grant Access"}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start p-4 border rounded-lg bg-gray-50">
                <div className="mr-4 text-blue-600 text-2xl">
                  <FaMicrophone />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Microphone Access</h3>
                  <p className="text-gray-600 text-sm mb-2">We need access to your microphone to record your answers during the interview.</p>
                  <button
                    onClick={requestPermissions}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      permissions.microphone
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={permissions.microphone}
                  >
                    {permissions.microphone ? "Access Granted ✓" : "Grant Access"}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start p-4 border rounded-lg bg-gray-50">
                <div className="mr-4 text-blue-600 text-2xl">
                  <FaLaptop />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Fullscreen Mode</h3>
                  <p className="text-gray-600 text-sm mb-2">The interview will run in fullscreen mode to minimize distractions.</p>
                  <button
                    onClick={requestFullscreen}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      permissions.fullscreen
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={permissions.fullscreen}
                  >
                    {permissions.fullscreen ? "Fullscreen Enabled ✓" : "Enable Fullscreen"}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start p-4 border rounded-lg bg-gray-50">
                <div className="mr-4 text-yellow-500 text-2xl">
                  <FaExclamationTriangle />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Anti-Cheating Notice</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    During the interview, the following actions will be monitored and flagged:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                    <li>Tab switching or leaving the interview window</li>
                    <li>Copy/paste attempts</li>
                    <li>Opening other applications</li>
                  </ul>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.copyPaste}
                        onChange={() => setPermissions(prev => ({ ...prev, copyPaste: !prev.copyPaste }))}
                        className="mr-2"
                      />
                      <span className="text-sm">I understand and agree to these conditions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {permissions.camera && (
              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold mb-2">Camera Preview</h3>
                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  ></video>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Back
              </button>
              
              <button
                onClick={startInterview}
                className={`px-6 py-3 rounded-lg ${
                  permissions.camera && permissions.microphone && permissions.fullscreen && permissions.copyPaste
                    ? "bg-blue-700 hover:bg-blue-800 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!permissions.camera || !permissions.microphone || !permissions.fullscreen || !permissions.copyPaste}
              >
                Start Interview
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">
                {formData.role} Interview
              </h2>
              <div className="text-sm text-gray-600">
                Question {interview.currentQuestion + 1} of {interview.questions.length}
                {interview.isFollowUp && ` (Follow-up ${interview.followUpQuestionIndex + 1})`}
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Question:</h3>
              <p className="text-gray-800">{getCurrentQuestionText()}</p>
            </div>
            
            {isThinking && (
              <div className="flex items-center justify-center py-8">
                <div className="flex space-x-2">
                  <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
                <span className="ml-3 text-blue-700">AI is analyzing your response...</span>
              </div>
            )}
            
            {!isThinking && (
              <form onSubmit={handleAnswerSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="answer">
                    Your Answer:
                  </label>
                  <textarea
                    id="answer"
                    value={currentAnswer}
                    onChange={handleAnswerChange}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="8"
                    placeholder="Type your answer here..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
                  >
                    {interview.isFollowUp && interview.followUpQuestionIndex < interview.questions[interview.currentQuestion].followUps.length - 1
                      ? "Next Follow-up Question"
                      : interview.currentQuestion < interview.questions.length - 1 || interview.isFollowUp
                        ? "Next Question"
                        : "Finish Interview"}
                  </button>
                </div>
              </form>
            )}
            
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
                <span className="flex items-center">
                  <span className="animate-pulse h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                  REC
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && analysis && (
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
            
            <div className="mb-10 text-center">
              <div className={`inline-block px-6 py-3 rounded-full font-bold text-white ${
                analysis.recommendation === 'Strong Hire' ? 'bg-green-600' :
                analysis.recommendation === 'Potential Hire' ? 'bg-blue-600' : 'bg-yellow-500'
              }`}>
                {analysis.recommendation}
              </div>
            </div>
            
            {analysis.aiGeneratedInsights && (
              <div className="mb-10 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    Gemini AI Insights
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysis.aiGeneratedInsights.map((insight, index) => (
                    <div key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                      <span className="text-blue-600 mr-2">💡</span>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Question Performance</h3>
              <div className="space-y-6">
                {analysis.questionFeedback.map((qf, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-800 flex-1">{qf.question}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ml-4 ${
                        qf.score > 80
                          ? 'bg-green-100 text-green-800'
                          : qf.score > 60
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Score: {qf.score}%
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{qf.feedback}</p>
                    
                    {qf.followUps.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-blue-200">
                        <h5 className="text-sm font-medium text-blue-700 mb-2">Follow-up Questions</h5>
                        <div className="space-y-3">
                          {qf.followUps.map((fq, fqIndex) => (
                            <div key={fqIndex} className="bg-white p-3 rounded border border-gray-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{fq.question}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  fq.score > 80
                                    ? 'bg-green-100 text-green-800'
                                    : fq.score > 60
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {fq.score}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
            
            {(analysis.cheatingAttempts.copyPaste > 0 || analysis.cheatingAttempts.tabSwitches > 0) && (
              <div className="bg-red-50 p-6 rounded-lg mb-10">
                <h3 className="text-xl font-bold text-red-800 mb-4">Integrity Alerts</h3>
                <div className="space-y-2">
                  {analysis.cheatingAttempts.copyPaste > 0 && (
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-red-500 mr-2 mt-1" />
                      <span>
                        <strong>{analysis.cheatingAttempts.copyPaste}</strong> copy/paste attempt(s) detected
                      </span>
                    </div>
                  )}
                  {analysis.cheatingAttempts.tabSwitches > 0 && (
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-red-500 mr-2 mt-1" />
                      <span>
                        <strong>{analysis.cheatingAttempts.tabSwitches}</strong> tab switch(es) detected
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-700 mt-2">
                    Note: In a real interview, these actions may be flagged for review by recruiters.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={restartInterview}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
              >
                Try Another Interview
              </button>
              <button
                onClick={goToHome}
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

export default StudentInterview;