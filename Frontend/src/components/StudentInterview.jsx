import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { ClipLoader } from 'react-spinners';
import { GoogleGenerativeAI } from "@google/generative-ai";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const genAI = new GoogleGenerativeAI("AIzaSyBBqMTUZVdxiwFmQUXpBu9jCUB6RzFWQBE");

function EnhancedStudentInterview() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
const [webcamPermission, setWebcamPermission] = useState(false);
const [userAnswers, setUserAnswers] = useState([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [userAnswer, setUserAnswer] = useState("");
const [showShareCard, setShowShareCard] = useState(false);
const [finalScore, setFinalScore] = useState(0);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    resume: null,
    experience: "",
    skills: "",
    moreInfo: "",
    additionalNotes: "",
    terms: false,
    companyName: "",
    interviewRound: "",
    interviewMode: "",
  });

  const [pdfText, setPdfText] = useState("");
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleStartInterviewClick = () => setIsFormVisible(true);
  const handleBack = () => setIsFormVisible(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFormData((prev) => ({ ...prev, resume: selectedFile }));

    if (selectedFile) {
      const text = await extractTextFromPdf(selectedFile);
      setPdfText(text);
    }
  };

  const extractTextFromPdf = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let textOutput = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        textOutput += pageText + "\n";
      }
      return textOutput;
    } catch (error) {
      console.error("PDF extraction error:", error);
      return `Resume file: ${file.name} (uploaded successfully)`;
    }
  };

  const generateAiResponse = async () => {
    setLoading(true);
    setError("");
    
    try {
      const prompt = `
        Generate 15 personalized interview questions based on:
        
        Name: ${formData.name}
        Position: ${formData.position}
        Company: ${formData.companyName}
        Round: ${formData.interviewRound}
        Mode: ${formData.interviewMode}
        Experience: ${formData.experience} years
        Skills: ${formData.skills}
        Resume: ${pdfText}
        
        Return only a JSON object with "questions" array containing 15 questions as strings.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
      const parsedResponse = JSON.parse(cleanedResponse);
      
      setAiResponse(parsedResponse);
      setShowAiResponse(true);
      setIsFormVisible(false);
    } catch (error) {
      setError(`Failed to generate AI response: ${error.message}`);
      console.error("AI generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formsubmit = (e) => {
    e.preventDefault();
    generateAiResponse();
  };














  const startWebcam = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    setWebcamStream(stream);
    setWebcamPermission(true);
  } catch (err) {
    setWebcamPermission(false);
    setError('Webcam permission denied or not available.');
  }
};



const handleUserAnswerChange = (e) => {
  setUserAnswer(e.target.value);
};

const submitAnswer = async () => {
  if (!userAnswer.trim()) {
    setError('Please provide an answer before submitting.');
    setTimeout(() => setError(''), 3000);
    return;
  }

  const newAnswer = {
    question: aiResponse.questions[currentQuestionIndex],
    answer: userAnswer,
    questionIndex: currentQuestionIndex
  };
  
  const updatedAnswers = [...userAnswers, newAnswer];
  setUserAnswers(updatedAnswers);
  setUserAnswer('');

  console.log('Answer submitted:', newAnswer);
  console.log('Total answers so far:', updatedAnswers.length);

  if (currentQuestionIndex >= aiResponse.questions.length - 1) {
    console.log('Interview completed! Sending email report...');
    await sendEmailReport(updatedAnswers);
    return;
  }

  setCurrentQuestionIndex(prev => prev + 1);
};

const sendEmailReport = async (allAnswers) => {
  setLoading(true);
  try {
    console.log('Starting email report generation...');
    
    const results = [];
    let totalScore = 0;

    for (const answerData of allAnswers) {
      const analysisPrompt = `
        Analyze this interview answer and provide a score out of 10 and feedback:
        Question: ${answerData.question}
        Answer: ${answerData.answer}
        
        Return JSON with: {"score": number, "feedback": "string"}
      `;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(analysisPrompt);
        const responseText = result.response.text();
        const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
        const analysis = JSON.parse(cleanedResponse);
        
        results.push({
          question: answerData.question,
          answer: answerData.answer,
          score: analysis.score,
          feedback: analysis.feedback
        });
        totalScore += analysis.score;
      } catch (error) {
        console.error('Analysis error:', error);
        results.push({
          question: answerData.question,
          answer: answerData.answer,
          score: 5,
          feedback: 'Analysis unavailable'
        });
        totalScore += 5;
      }
    }

    const overallScore = Math.round(totalScore / allAnswers.length);
    
    const reportData = {
      name: formData.name,
      email: formData.email,
      role: formData.position,
      overallScore,
      totalQuestions: allAnswers.length,
      results
    };

    console.log('Sending report to:', reportData.email);
    console.log('Backend URL:', `${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/api/send-interview-report`);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/api/send-interview-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });

    const responseData = await response.json();
    console.log('Backend response:', responseData);

    if (response.ok) {
      setFinalScore(overallScore);
      setShowShareCard(true);
      
      setTimeout(async () => {
        try {
          await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/api/send-interview-report`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData)
          });
        } catch (error) {
          console.error('Failed to send delayed report:', error);
        }
      }, 1 * 60 * 1000);
    } else {
      console.error('Failed to send report:', responseData);
      alert(`Interview completed! Report generation failed: ${responseData.message || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('Report generation error:', error);
    alert('Interview completed! There was an error. Check console for details.');
  } finally {
    setLoading(false);
  }
};

const shareOnSocial = (platform) => {
  const text = `Just completed my ${formData.position} interview with AI! Scored ${finalScore}/10 🎯 #NeoRecruiter #AIInterview #JobPrep`;
  const url = 'https://neorecruiter.vercel.app';
  
  if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`);
  } else if (platform === 'instagram') {
    navigator.clipboard.writeText(text + ' ' + url);
    alert('Text copied! Paste it in your Instagram story/post.');
  }
};

const resetInterview = () => {
  setShowShareCard(false);
  setShowAiResponse(false);
  setCurrentQuestionIndex(0);
  setUserAnswers([]);
  setUserAnswer('');
  setFinalScore(0);
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full h-[70px] bg-white shadow-sm flex items-center justify-between px-6">
        <strong className="text-3xl text-blue-600">
          Neo<span className="text-gray-800">Recruiter</span>
        </strong>
        <div className="text-sm text-gray-600 font-medium">
          AI-Powered Mock Interviews
        </div>
      </div>

      {!isFormVisible && !showAiResponse && !loading && (
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Practice Mock Interviews &
            </h1>
            <img
              src="/hi3.jpg"
              alt="Hero"
              className="mx-auto mb-6 w-[400px] h-[300px] object-cover rounded-lg shadow-lg"
            />
            <h1 className="text-5xl font-bold text-blue-600 mb-6">
              Become UNSTOPPABLE
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get AI-powered feedback, personalized questions, and detailed analysis to ace your next interview
            </p>
            <button
              onClick={handleStartInterviewClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Start Mock Interview
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)]">
          <ClipLoader size={50} color="#2563eb" />
          <img src="/ai.png" alt="AI Icon" className="w-[300px] h-[300px] mx-auto mb-4 mt-8" />
          <p className="text-center text-gray-600 text-lg">AI is generating personalized interview questions...</p>
        </div>
      )}















      

      













{showAiResponse && aiResponse.questions && aiResponse.questions.length > 0 && (
        <div className="flex min-h-[calc(100vh-70px)]">
          <div className="w-1/2 border-r border-gray-200 bg-white p-6 shadow-lg">
            <h1 className="font-bold text-blue-500 text-2xl text-center mb-2">{formData.companyName} {formData.interviewRound} Mock Interview</h1>
            <p className="text-center text-sm mb-4">powered by NeoRecruiter</p>
            <hr className="mb-4"/>

            <div>
              {!webcamPermission && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
                  onClick={startWebcam}
                  type="button"
                >
                  Enable Webcam (Interview Video)
                </button>
              )}

              {webcamPermission && (
                <video
                  autoPlay
                  playsInline
                  ref={videoEl => {
                    if (videoEl && webcamStream) {
                      videoEl.srcObject = webcamStream;
                    }
                  }}
                  className="w-full h-96 rounded border shadow mb-4"
                />
              )}
            </div>
          </div>

          <div className="w-1/2 bg-white p-6 shadow-lg">
            <h1 className="font-bold text-blue-500 text-xl text-center mb-2">Your question will appear here</h1>
            <p className="text-center text-sm mb-4">Analysis report will be sent to your email in 4 minutes</p>
            <hr className="mb-6"/>

            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Question {currentQuestionIndex + 1} of {aiResponse.questions.length}</h3>
                <p className="text-gray-800">{aiResponse.questions[currentQuestionIndex]}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
              <textarea 
                value={userAnswer}
                onChange={handleUserAnswerChange}
                className="w-full p-3 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Type your answer here..."
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">Progress: {currentQuestionIndex + 1}/{aiResponse.questions.length}</span>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors" 
                  onClick={submitAnswer}
                  disabled={loading || !userAnswer.trim()}
                >
                  {loading ? 'Processing...' : (currentQuestionIndex >= aiResponse.questions.length - 1 ? 'Finish Interview' : 'Submit & Next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
   


















      {isFormVisible && !loading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-70px)] px-2 py-8">
          <form
            onSubmit={formsubmit}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full space-y-6 border-t-4 border-blue-600 relative"
          >
            <button
              type="button"
              onClick={handleBack}
              className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 text-xl"
              title="Back"
            >
              &times;
            </button>

            <h1 className="text-3xl font-black text-center text-blue-700">
              Create Your <span className="text-gray-700">Personalized</span>{" "}
              <br /> <span className="text-blue-500">INTERVIEW</span>
            </h1>
            <p className="text-lg text-gray-500 text-center mb-4">
              Fill the form below to customize your mock interview experience
            </p>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Interview Round<span className="text-red-500">*</span>
              </label>
              <select
                name="interviewRound"
                value={formData.interviewRound}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                required
              >
                <option value="">-- Select --</option>
                <option value="Resume Screen">Resume Screen</option>
                <option value="Online Coding Round">Online Coding Round</option>
                <option value="Technical Round 1">Technical Round 1</option>
                <option value="Technical Round 2">Technical Round 2</option>
                <option value="Hiring Manager Round">Hiring Manager Round</option>
                <option value="HR Round">HR Round</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Session Type<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewMode"
                    value="Interview"
                    checked={formData.interviewMode === "Interview"}
                    onChange={handleChange}
                    required
                  />
                  Interview
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewMode"
                    value="Personal"
                    checked={formData.interviewMode === "Personal"}
                    onChange={handleChange}
                    required
                  />
                  Personal
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Position<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Resume<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                  accept="application/pdf"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Years of Experience<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Skills<span className="text-red-500">*</span>
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tell us more (optional)
              </label>
              <input
                type="text"
                name="moreInfo"
                value={formData.moreInfo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
                rows="2"
              ></textarea>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms and Condition
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg mt-2"
            >
              Generate AI Inteqwdrview Questions
            </button>
          </form>
        </div>
      )}

      {showShareCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Completed!</h2>
              <div className="text-4xl font-bold text-blue-600 mb-2">{finalScore}/10</div>
              <p className="text-gray-600">{formData.position} Position</p>
              <p className="text-sm text-gray-500 mt-2">Report will be sent to your email in 1 minute</p>
            </div>
            
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-4">Share your achievement:</p>
              <div className="flex gap-3 justify-center mb-6">
                <button
                  onClick={() => shareOnSocial('linkedin')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => shareOnSocial('instagram')}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600"
                >
                  Instagram
                </button>
              </div>
              
              <button
                onClick={resetInterview}
                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Start New Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default EnhancedStudentInterview;