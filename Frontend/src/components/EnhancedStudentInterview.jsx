import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

function EnhancedStudentInterview() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "beginner",
  });

  const [isVisible, setIsVisible] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [error, setError] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [aiQuestions, setAiQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [scoreArray, setScoreArray] = useState([]);
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const genAI = new GoogleGenerativeAI("AIzaSyCMUk5m1FCh6Q5tUDEeQnXc7xABZv8V_BA");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResumeChange = async (event) => {
    setError("");
    setResumeError("");
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileUrl(selectedFile ? URL.createObjectURL(selectedFile) : "");

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload only PDF files.");
        setFile(null);
        setFileUrl("");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        setFile(null);
        setFileUrl("");
        return;
      }

      try {
        const text = await extractTextFromPdf(selectedFile);
        setPdfText(text);
        if (!text.trim()) {
          setError("PDF में कोई text नहीं मिला। यह scanned PDF हो सकती है।");
        }
      } catch (err) {
        setError("PDF फाइल पढ़ने में समस्या आ रही है: " + err.message);
        setFile(null);
        setFileUrl("");
      }
    }
  };

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textOutput = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      textOutput += pageText + "\n";
    }
    return textOutput;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      setResumeError("Please fill all required fields.");
      return;
    }
    if (!file) {
      setResumeError("Please upload your resume.");
      return;
    }
    if (!pdfText.trim()) {
      setResumeError("Resume text could not be extracted. Please upload a valid PDF.");
      return;
    }
    setResumeError("");
    setIsVisible(false);
    setInterviewStarted(true);
  };

  useEffect(() => {
    const generateQuestions = async () => {
      if (!pdfText || !formData.name || !formData.role || !interviewStarted) return;

      const prompt = `Mera naam ${formData.name} hai. Resume ka content yeh hai: ${pdfText}. Iske basis pe mujhe ${formData.role} ke liye 15 HR-style interview questions do jis me 5 DSA ke questions ho. Har question JSON array format me ho jisme "question" aur "expected_answer" fields ho. Mujhe only JSON dena.`;

      try {
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleanedResponse);

        if (Array.isArray(parsed)) {
          setAiQuestions(parsed);
          setCurrentQuestionIndex(0);
        } else {
          throw new Error("Invalid AI response format");
        }
      } catch (err) {
        setError("❌ AI Error: " + err.message);
        setAiQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    generateQuestions();
  }, [pdfText, formData.name, formData.role, interviewStarted]);

  const handleInputChange1 = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit1 = (event) => {
    event.preventDefault();
    if (input) {
      setDataArray([...dataArray, input]);
      setInput("");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEffect(() => {
    const generateEvaluation = async () => {
      if (
        dataArray.length !== aiQuestions.length ||
        !pdfText ||
        !formData.name ||
        !formData.role
      )
        return;

      const prompt2 = `Mera naam ${formData.name} hai. Resume: ${pdfText}. Interview questions and expected answers: ${JSON.stringify(
        aiQuestions
      )}. Candidate ke answers: ${JSON.stringify(
        dataArray
      )}. Har question ka evaluation karo. Output JSON array with "question", "expected_answer", "user_answer", "score" (0-10), and "feedback". Only JSON.`;

      try {
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt2);
        const responseText = await result.response.text();
        const cleaned = responseText.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          setScoreArray(parsed);
          // Calculate overall score
          const totalScore = parsed.reduce((sum, item) => sum + item.score, 0);
          const avgScore = (totalScore / parsed.length).toFixed(1);
          setOverallScore(avgScore);
        } else {
          throw new Error("Invalid evaluation format");
        }
      } catch (err) {
        setError("❌ AI Error: " + err.message);
        setScoreArray([]);
      } finally {
        setLoading(false);
      }
    };

    generateEvaluation();
  }, [dataArray]);

  const sendEmailReport = async () => {
    setEmailLoading(true);
    try {
      setEmailSent(true);
      console.log('Report ready for:', formData.email);
    } catch (err) {
      setError('❌ Email sending failed: ' + err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full h-[60px] bg-blue-500 flex justify-center items-center">
        <h1 className="text-3xl font-bold text-white">Student Interview</h1>
      </div>

      <div className="flex justify-center mt-10">
        {isVisible && (
          <form onSubmit={handleSubmit} className="w-4/12 bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Fill Basic Information</h2>

            <label className="block mb-1 font-medium">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            />

            <label className="block mb-1 font-medium">Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            />

            <label className="block mb-1 font-medium">Phone</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <label className="block mb-1 font-medium">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>

            <label className="block mb-1 font-medium">Experience Level</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            >
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="experienced">Experienced (3+ years)</option>
            </select>

            <label className="block mb-1 font-medium">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            {fileUrl && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => window.open(fileUrl, "_blank")}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  📄 Open PDF
                </button>
              </div>
            )}

            {resumeError && <p className="text-red-600 mb-2">⚠️ {resumeError}</p>}
            {error && <p className="text-red-600 mb-2">❌ {error}</p>}
            {pdfText && <p className="text-green-600 mb-2">✅ Resume text extracted!</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Start Interview
            </button>
          </form>
        )}
      </div>

      {loading && (
        <div className="text-center mt-6 text-blue-500 font-semibold">
          ⏳ Loading... please wait.
        </div>
      )}

      {interviewStarted && aiQuestions.length > 0 && currentQuestionIndex < aiQuestions.length && (
        <div className="mt-10 w-4/12 mx-auto bg-white rounded-xl shadow-xl p-6">
          <h3 className="font-semibold mb-2">
            Question {currentQuestionIndex + 1}:
          </h3>
          <p className="mb-4">{aiQuestions[currentQuestionIndex].question}</p>
          <form onSubmit={handleSubmit1}>
            <textarea
              value={input}
              onChange={handleInputChange1}
              className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
              placeholder="Your answer..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit Answer & Next
            </button>
          </form>
        </div>
      )}

      {scoreArray.length > 0 && (
        <div className="mt-10 w-8/12 mx-auto bg-white rounded p-6 border">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Interview Results</h2>
          
          <div className="bg-blue-500 text-white rounded p-6 mb-6 text-center">
            <h3 className="text-xl font-bold mb-2">Overall Performance</h3>
            <div className="text-4xl font-bold mb-2">{overallScore}/10</div>
            <div className="text-sm">
              {overallScore >= 8 ? 'Excellent!' : overallScore >= 6 ? 'Good Job!' : overallScore >= 4 ? 'Keep Improving!' : 'Practice More!'}
            </div>
            <div className="mt-4 text-sm">
              <span className="bg-blue-600 px-3 py-1 rounded mr-2">
                {scoreArray.length} Questions
              </span>
              <span className="bg-blue-600 px-3 py-1 rounded">
                {formData.email}
              </span>
            </div>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={sendEmailReport}
              disabled={emailLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition disabled:opacity-50 font-semibold mr-4"
            >
              {emailLoading ? 'Processing...' : 'Generate Report'}
            </button>
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition font-semibold"
            >
              Print Report
            </button>
          </div>

          <div className="space-y-6">
            {scoreArray.map((item, index) => (
              <div key={index} className="bg-blue-50 rounded p-5 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg text-blue-800">Question {index + 1}</h4>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-bold">
                    {item.score}/10
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-blue-700 font-medium">{item.question}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">Expected Answer:</h5>
                    <p className="text-sm text-gray-700">{item.expected_answer}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">Your Answer:</h5>
                    <p className="text-sm text-gray-700">{item.user_answer}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">Feedback:</h5>
                  <p className="text-sm text-gray-700">{item.feedback}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-100 rounded p-6 mt-6">
            <h4 className="font-bold mb-4 text-center text-blue-800">Performance Summary</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded">
                <div className="font-bold text-blue-600">{((scoreArray.filter(item => item.score >= 6).length / scoreArray.length) * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="font-bold text-blue-600">{overallScore >= 7 ? 'Ready' : 'Practice'}</div>
                <div className="text-sm text-gray-600">Interview Status</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="font-bold text-blue-600">{scoreArray.filter(item => item.score < 6).length}</div>
                <div className="text-sm text-gray-600">Areas to Improve</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                const reportData = {
                  name: formData.name,
                  email: formData.email,
                  role: formData.role,
                  score: overallScore,
                  results: scoreArray
                };
                const dataStr = JSON.stringify(reportData, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `interview-report-${formData.name.replace(/\s+/g, '-')}.json`;
                link.click();
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition font-semibold"
            >
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedStudentInterview;
