import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaUserTie, FaEnvelope, FaPhone, FaFileAlt, FaDesktop, FaMicrophone, FaCheckCircle, FaRobot, FaShieldAlt, FaExclamationTriangle, FaInfoCircle, FaVideo, FaBell, FaMicrophoneSlash, FaPaperPlane, FaUser
} from "react-icons/fa";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
async function apiPost(path, body, isFormData = false) {
  const options = {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await res.json();
  return { ok: res.ok, data };
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  const data = await res.json();
  return { ok: res.ok, data };
}

async function logUserAction(email, action) {
  if (!email) return;
  await apiPost("/hr/log-action", {
    email,
    action,
    timestamp: new Date().toISOString(),
  });
}
function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  if (!message) return null;
  let bgColor = '', textColor = '', Icon = FaInfoCircle;
  if (type === "success") { bgColor = "bg-green-100"; textColor = "text-green-800"; Icon = FaCheckCircle; }
  else if (type === "error") { bgColor = "bg-red-100"; textColor = "text-red-800"; Icon = FaExclamationTriangle; }
  else if (type === "info") { bgColor = "bg-blue-100"; textColor = "text-blue-800"; }
  else { bgColor = "bg-gray-100"; textColor = "text-gray-800"; }
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in ${bgColor} ${textColor}`} role="alert" aria-live="polite">
      {Icon && <Icon className="text-xl" />}
      <span className="font-semibold text-sm md:text-base">{message}</span>
      <button onClick={onClose} className="ml-auto text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-current rounded-full p-1" aria-label="Close notification">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
}

// -------------------- ScreenRecorder Component --------------------
function ScreenRecorder({ candidateEmail, disabled, setNotification }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const startRecording = async () => {
    if (disabled) return;
    try {
      setNotification({ message: "Requesting screen and audio permissions...", type: "info" });
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      recordedChunksRef.current = [];
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        await uploadRecording(blob);
      };
      mediaRecorder.onerror = (event) => {
        setNotification({ message: `Screen recording error: ${event.error.name}. Please try again.`, type: "error" });
        setRecording(false);
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      };

      mediaRecorder.start();
      setRecording(true);
      setNotification({ message: "Screen recording started.", type: "info" });
    } catch (err) {
      setNotification({ message: `Failed to start screen recording: ${err.name || err.message}. Please allow permissions.`, type: "error" });
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setNotification({ message: "Screen recording stopped. Uploading...", type: "info" });
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const uploadRecording = async (blob) => {
    setUploading(true);
    setNotification({ message: "Uploading screen recording...", type: "info" });
    const formData = new FormData();
    formData.append("email", candidateEmail);
    formData.append("screenRecording", blob, `screen-recording-${Date.now()}.webm`);
    const { ok, data } = await apiPost("/hr/upload-screen-recording", formData, true);
    if (ok) setNotification({ message: "Screen recording saved successfully!", type: "success" });
    else setNotification({ message: data.msg || "Failed to save recording on server.", type: "error" });
    setUploading(false);
  };

  return (
    <div className="relative z-20">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-5 py-2.5 rounded-full ${recording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white font-bold transition-all duration-300 flex items-center gap-2 text-sm shadow-lg
          ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={uploading || disabled}
        aria-label={recording ? "Stop screen recording" : "Start full screen recording"}
      >
        <FaDesktop className="text-lg" />
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {uploading && <span className="ml-3 text-blue-300 text-sm font-semibold">Uploading...</span>}
      {recording && <span className="ml-3 text-red-400 text-sm font-semibold animate-pulse">LIVE</span>}
    </div>
  );
}
   



// -------------------- StepperItem Component --------------------
const StepperItem = ({ icon: Icon, label, isActive }) => (
  <div className="flex flex-col items-center mx-3">
    <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold shadow-lg border-2
      ${isActive ? "bg-blue-700 text-white border-blue-700 scale-110" : "bg-white text-blue-700 border-blue-200"}
      transition-all duration-300`}>
      <Icon />
    </div>
    <div className={`mt-2 text-sm font-semibold ${isActive ? "text-blue-700" : "text-gray-500"}`}>{label}</div>
  </div>
);

// -------------------- Main Component --------------------                                   
export default function Interview() {
  // -------------------- State --------------------
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", resume: null });
  const [permissions, setPermissions] = useState({ screen: false, microphone: false, camera: false, notifications: false });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [requestingPermissions, setRequestingPermissions] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [cheatingFlags, setCheatingFlags] = useState([]);

  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // -------------------- Tab Switch/Minimize Detection --------------------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && candidateEmail) {
        setNotification({ message: "You switched tabs or minimized the window. Please stay on the interview page.", type: "error" });
        setCheatingFlags(prev => [...prev, "tab-switch-or-minimize"]);
        logUserAction(candidateEmail, "tab-switch-or-minimize");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [candidateEmail]);

  // -------------------- Copy/Paste/Cut Logging --------------------
  useEffect(() => {
    if (!candidateEmail) return;
    const handleCopy = () => {
      setCheatingFlags(prev => [...prev, "copy-detected"]);
      logUserAction(candidateEmail, "copy");
    };
    const handlePaste = () => {
      setCheatingFlags(prev => [...prev, "paste-detected"]);
      logUserAction(candidateEmail, "paste");
    };
    const handleCut = () => {
      setCheatingFlags(prev => [...prev, "cut-detected"]);
      logUserAction(candidateEmail, "cut");
    };
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
    };
  }, [candidateEmail]);

  // -------------------- Scroll to bottom --------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------- Notification Helpers --------------------
  const showNotification = useCallback((message, type = 'info') => setNotification({ message, type }), []);
  const clearNotification = useCallback(() => setNotification({ message: '', type: '' }), []);

  // -------------------- Candidate Form Handler --------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
    clearNotification();
  };

  // -------------------- Permission Checkbox Handler --------------------
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prev) => ({ ...prev, [name]: checked }));
    clearNotification();
  };

  // -------------------- Registration Handler --------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    clearNotification();
    setRegistering(true);
    if (!form.name || !form.email || !form.phone || !form.resume) {
      showNotification("All fields are required for registration.", "error");
      setRegistering(false);
      return;
    }
    
    // First get company info
    const { ok: companyOk, data: companyData } = await apiPost("/hr/get-candidate-company", { email: form.email });
    if (!companyOk) {
      showNotification("No interview found for this email address. Please check your email or contact HR.", "error");
      setRegistering(false);
      return;
    }
    
    setCompanyInfo(companyData);
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("resume", form.resume);
    const { ok, data } = await apiPost("/hr/candidate-register", formData, true);
    if (!ok) {
      if (data.msg === "You have already completed the interview.") {
        setInterviewCompleted(true);
        showNotification("You have already completed the interview. Thank you!", "info");
      } else {
        showNotification(data.msg || "Candidate registration failed. Please try again.", "error");
      }
    } else if (!data.questions || data.questions.length === 0) {
      showNotification("No interview questions found for this candidate. Please contact support.", "error");
    } else {
      setQuestions(data.questions);
      setCandidateEmail(form.email);
      setCurrentQ(0);
      setMessages([]);
      setInterviewCompleted(false);
      setStep(2);
      showNotification("Registration successful! Please grant necessary permissions.", "success");
    }
    setRegistering(false);
  };

  // -------------------- Permissions Handler --------------------
  const handleAllowPermissions = async () => {
    clearNotification();
    setRequestingPermissions(true);
    if (!permissions.screen || !permissions.microphone) {
      showNotification("Screen recording and microphone permissions are required.", "error");
      setRequestingPermissions(false);
      return;
    }
    try {
      if (permissions.screen) await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (permissions.microphone) await navigator.mediaDevices.getUserMedia({ audio: true });
      if (permissions.camera) await navigator.mediaDevices.getUserMedia({ video: true });
      if (permissions.notifications && "Notification" in window) {
        if (Notification.permission !== "granted") await Notification.requestPermission();
      }
      setStep(3);
      // Add welcome message
      const welcomeMsg = `Welcome to ${companyInfo?.companyName || 'our company'}'s AI-powered interview! I'm your virtual interviewer. I'll ask you ${questions.length} questions about the ${questions[0]?.technicalDomain || 'role'}. Please answer each question clearly and take your time. Let's begin!`;
      setMessages([{ from: "bot", text: welcomeMsg }]);
      showNotification("Permissions granted! Starting the interview...", "success");
    } catch (err) {
      showNotification(`Permission denied: ${err.message}. Please allow access to proceed.`, "error");
    }
    setRequestingPermissions(false);
  };

  // -------------------- Interview: Fullscreen and Cleanup --------------------
  useEffect(() => {
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          showNotification("Failed to enter fullscreen mode. Enable it manually for best experience.", "info");
        });
      }
    };
    if (step === 3) enterFullscreen();
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
      }
    };
  }, [step, showNotification]);

  // -------------------- Interview: Bot Speaks Question --------------------
  useEffect(() => {
    if (step !== 3 || interviewCompleted || questions.length === 0) return;
    if (currentQ < questions.length) {
      const questionText = questions[currentQ].text;
      
      // Add question to chat immediately
      setMessages((prevMsgs) => [...prevMsgs, { from: "bot", text: questionText }]);
      setWaitingForAnswer(true);
      
      // Speak the question with human-like voice
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher pitch
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.includes('en-US')
      );
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.onend = () => {
        inputRef.current?.focus();
      };
      utterance.onerror = () => {
        showNotification("Audio playback failed. Please read the question above.", "info");
        inputRef.current?.focus();
      };
      
      // Small delay before speaking
      setTimeout(() => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }, 500);
      
    } else if (currentQ === questions.length) {
      const completionMessage = "Thank you for completing the interview! Your responses have been recorded and will be reviewed by our team. You may now close this window.";
      setMessages((prevMsgs) => [...prevMsgs, { from: "bot", text: completionMessage }]);
      setInterviewCompleted(true);
      setWaitingForAnswer(false);
      showNotification("Interview completed successfully!", "success");
      
      // Speak completion message
      const utterance = new SpeechSynthesisUtterance(completionMessage);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentQ, questions, step, interviewCompleted, showNotification]);

  // -------------------- Interview: Answer Submission --------------------
  const handleSendAnswer = async (e) => {
    e.preventDefault();
    clearNotification();
    if (!input.trim() || !waitingForAnswer || submittingAnswer || interviewCompleted) {
      showNotification("Please provide an answer before sending.", "info");
      return;
    }
    setSubmittingAnswer(true);
    const userMessage = input;
    setMessages((prevMsgs) => [...prevMsgs, { from: "user", text: userMessage }]);
    setInput("");

    const currentQuestionObj = questions[currentQ] || {};
    const { text, expectedAnswer } = currentQuestionObj;

    const { ok, data } = await apiPost("/hr/save-answer", {
      email: candidateEmail,
      answer: userMessage,
      questionIndex: currentQ,
      question: text,
      expectedAnswer: expectedAnswer,
      cheatingFlags: cheatingFlags
    });

    if (!ok) {
      showNotification(data.msg || "Failed to save your answer. Please try again.", "error");
      setSubmittingAnswer(false);
      return;
    }
    
    // Show simple acknowledgment (no AI scores to candidate)
    const acknowledgments = [
      "Thank you for your response. Let's move to the next question.",
      "Great! I've recorded your answer. Moving forward.",
      "Excellent response! Let's continue with the next question.",
      "Perfect! Your answer has been saved. Next question coming up.",
      "Well done! Let's proceed to the next part of the interview."
    ];
    
    const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
    
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: randomAck }]);
    }, 1000);
    
    showNotification("Your answer has been saved successfully.", "success");
    setSubmittingAnswer(false);
    setCurrentQ((prevQ) => prevQ + 1);
    setWaitingForAnswer(false);
  };

  // -------------------- Interview: Speech-to-text --------------------
  const startListening = () => {
    clearNotification();
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      showNotification("Speech recognition is not supported in this browser. Please use the text input.", "error");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      showNotification("Listening... Speak your answer now.", "info");
      inputRef.current?.focus();
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      showNotification("Speech recognized. Click Send to submit.", "info");
    };
    recognition.onerror = (event) => {
      showNotification(`Speech recognition error: ${event.error}. Please type your answer if issues persist.`, "error");
    };
    recognition.onend = () => {
      if (notification.type === 'info' && notification.message === "Listening... Speak your answer now.") {
        clearNotification();
      }
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  // -------------------- Stepper Data --------------------
  const steps = [
    { label: "Verification", icon: FaUserTie },
    { label: "Permissions", icon: FaDesktop },
    { label: "Interview", icon: FaRobot }
  ];

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header and Stepper */}
      {(step === 1 || step === 2) && (
        <>
          <header className="w-full flex items-center justify-between px-6 py-4 bg-white/80 shadow-md z-10 sticky top-0">
            <div className="text-2xl font-black tracking-tight flex items-center space-x-1 select-none">
              <span className="text-blue-700 font-bold">
                {companyInfo ? companyInfo.companyName : "AI Interview Portal"}
              </span>
            </div>
            <nav className="flex gap-3">
              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-blue-100 font-semibold text-blue-700 transition duration-300">Home</Link>
            </nav>
          </header>
          <div className="flex justify-center mt-8 mb-6">
            {steps.map((s, idx) => (
              <StepperItem key={s.label} icon={s.icon} label={s.label} isActive={step === idx + 1} />
            ))}
          </div>
        </>
      )}

      {/* Global Notification Display */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-6">
        {/* Step 1: Candidate Form */}
        {step === 1 && (
          <form
            onSubmit={handleRegister}
            className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg mx-auto w-full space-y-7 border border-blue-200 animate-fade-in"
            aria-labelledby="candidate-verification-heading"
          >
            <h2 id="candidate-verification-heading" className="text-4xl font-extrabold text-blue-800 mb-6 text-center tracking-tight">
              Candidate Verification
            </h2>
            {interviewCompleted && (
              <div className="text-green-700 text-center font-bold mb-4 p-3 bg-green-50 rounded-lg" role="status">
                You have already completed the interview. Thank you!
              </div>
            )}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-blue-50">
              <FaUserTie className="text-blue-700 text-xl mr-4" aria-hidden="true" />
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Full Name"
                className="flex-1 bg-transparent outline-none text-lg placeholder-gray-500"
                value={form.name}
                onChange={handleChange}
                required
                disabled={interviewCompleted || registering}
                aria-required="true"
              />
            </div>
            <div className="flex items-center border rounded-xl px-4 py-3 bg-blue-50">
              <FaEnvelope className="text-blue-700 text-xl mr-4" aria-hidden="true" />
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email Address"
                className="flex-1 bg-transparent outline-none text-lg placeholder-gray-500"
                value={form.email}
                onChange={handleChange}
                required
                disabled={interviewCompleted || registering}
                aria-required="true"
              />
            </div>
            <div className="flex items-center border rounded-xl px-4 py-3 bg-blue-50">
              <FaPhone className="text-blue-700 text-xl mr-4" aria-hidden="true" />
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="flex-1 bg-transparent outline-none text-lg placeholder-gray-500"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={interviewCompleted || registering}
                aria-required="true"
              />
            </div>
            <label htmlFor="resume" className="block text-gray-700 text-sm font-medium mb-2">Upload Resume (PDF, DOCX)</label>
            <div className="flex items-center border rounded-xl px-4 py-3 bg-blue-50">
              <FaFileAlt className="text-blue-700 text-xl mr-4" aria-hidden="true" />
              <input
                id="resume"
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className="flex-1 bg-transparent outline-none text-lg"
                onChange={handleChange}
                required
                disabled={interviewCompleted || registering}
                aria-required="true"
              />
              {form.resume && <span className="ml-2 text-xs text-blue-700">{form.resume.name}</span>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              disabled={registering || interviewCompleted}
              aria-live="polite"
            >
              {registering ? "Verifying..." : "Start Interview"}
            </button>
          </form>
        )}

        {/* Step 2: Permissions */}
        {step === 2 && (
          <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md mx-auto w-full text-center space-y-6 border border-blue-200 animate-fade-in" aria-labelledby="permissions-heading">
            <h2 id="permissions-heading" className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-blue-700" aria-hidden="true" /> Permissions Required
            </h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              To ensure a smooth interview experience, we require access to your screen, microphone, and optionally camera & notifications.<br />
              <span className="font-bold text-blue-700">Your screen activity will be recorded for the duration of the interview.</span>
            </p>
            <div className="flex flex-col items-start space-y-3 mb-6" role="group" aria-labelledby="permissions-heading">
              <label htmlFor="screen-permission" className="flex items-center cursor-pointer">
                <input
                  id="screen-permission"
                  type="checkbox"
                  name="screen"
                  checked={permissions.screen}
                  onChange={handlePermissionChange}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  disabled={requestingPermissions}
                />
                <span className="ml-3 text-lg text-gray-800 flex items-center gap-2">
                  <FaDesktop className="text-blue-700" aria-hidden="true" /> Allow Screen Recording <span className="text-xs text-red-500 font-semibold">(Required)</span>
                </span>
              </label>
              <label htmlFor="microphone-permission" className="flex items-center cursor-pointer">
                <input
                  id="microphone-permission"
                  type="checkbox"
                  name="microphone"
                  checked={permissions.microphone}
                  onChange={handlePermissionChange}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  disabled={requestingPermissions}
                />
                <span className="ml-3 text-lg text-gray-800 flex items-center gap-2">
                  <FaMicrophone className="text-blue-700" aria-hidden="true" /> Allow Microphone Access <span className="text-xs text-red-500 font-semibold">(Required)</span>
                </span>
              </label>
              <label htmlFor="camera-permission" className="flex items-center cursor-pointer">
                <input
                  id="camera-permission"
                  type="checkbox"
                  name="camera"
                  checked={permissions.camera}
                  onChange={handlePermissionChange}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  disabled={requestingPermissions}
                />
                <span className="ml-3 text-lg text-gray-800 flex items-center gap-2">
                  <FaVideo className="text-blue-700" aria-hidden="true" /> Allow Camera Access <span className="text-xs text-gray-500">(Optional)</span>
                </span>
              </label>
              <label htmlFor="notifications-permission" className="flex items-center cursor-pointer">
                <input
                  id="notifications-permission"
                  type="checkbox"
                  name="notifications"
                  checked={permissions.notifications}
                  onChange={handlePermissionChange}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  disabled={requestingPermissions}
                />
                <span className="ml-3 text-lg text-gray-800 flex items-center gap-2">
                  <FaBell className="text-blue-700" aria-hidden="true" /> Allow Browser Notifications <span className="text-xs text-gray-500">(Optional)</span>
                </span>
              </label>
            </div>
            <button
              onClick={handleAllowPermissions}
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              disabled={requestingPermissions || !permissions.screen || !permissions.microphone}
              aria-live="polite"
            >
              {requestingPermissions ? "Requesting..." : "Allow & Start Interview"}
            </button>
          </div>
        )}

        {/* Step 3: Interview Fullscreen */}
        {step === 3 && (
          <div className="w-full h-screen bg-white flex flex-col">
            {/* Company Header */}
            <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">
                {companyInfo ? `${companyInfo.companyName} - AI Interview` : "AI Interview"}
              </h1>
              <div className="flex items-center space-x-4">
                <ScreenRecorder candidateEmail={candidateEmail} disabled={interviewCompleted} setNotification={showNotification} />
                {/* NeoAssistant is hidden from candidates */}
              </div>
            </div>

            {/* Chat Interface - Fullscreen */}
            <div className="flex-1 flex flex-col p-6 bg-blue-50">
              <h2 className="text-3xl font-extrabold text-blue-800 mb-4 text-center border-b pb-3 border-blue-200 flex items-center justify-center gap-2">
                <FaRobot className="text-blue-700" /> AI Interview Chat
              </h2>
              
              <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar" role="log" aria-live="polite">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`px-5 py-3 rounded-3xl max-w-[80%] text-lg shadow-md flex items-start gap-2
                        ${msg.from === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                        }`}>
                      {msg.from === "user" ? <FaUser className="mt-1 flex-shrink-0" /> : <FaRobot className="mt-1 flex-shrink-0" />}
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Always Visible */}
              {interviewCompleted ? (
                <div className="text-green-700 text-center font-bold mt-4 p-4 bg-green-50 rounded-lg shadow-inner flex items-center justify-center gap-2 text-xl" role="status">
                  <FaCheckCircle /> Interview completed. Thank you for your time!
                </div>
              ) : (
                <form onSubmit={handleSendAnswer} className="flex items-center gap-3 pt-4 border-t border-blue-200">
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 px-5 py-3 rounded-full border border-blue-300 focus:border-blue-600 outline-none text-lg shadow-sm transition-all duration-200 placeholder-gray-500"
                    placeholder={currentQ < questions.length ? "Type or speak your answer here..." : "Interview completed"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={submittingAnswer || currentQ >= questions.length}
                  />
                  <button
                    type="button"
                    onClick={startListening}
                    className="bg-gray-300 text-blue-700 rounded-full p-3 hover:bg-gray-400 transition-colors shadow-sm disabled:opacity-50"
                    disabled={submittingAnswer || currentQ >= questions.length}
                    title="Voice Input"
                  >
                    <FaMicrophone className="text-lg" />
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:transform-none"
                    disabled={submittingAnswer || !input.trim() || currentQ >= questions.length}
                  >
                    <FaCheckCircle /> <span>{submittingAnswer ? "Sending..." : "Send"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Tailwind CSS custom styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #e0e7ff;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #93c5fd;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #60a5fa;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}