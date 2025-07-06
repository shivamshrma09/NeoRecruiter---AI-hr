const express = require('express');
const { body } = require('express-validator');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const hrController = require('../controllers/hr.controller');
const authHrMiddleware = require('../middlewares/hr.middleware');
const Hr = require('../models/hr.model');

// Gemini AI integration (backend)
const { GoogleGenerativeAI, Type } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();

// --- HR Registration ---
router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('companyName').isLength({ min: 3 }).withMessage('Company Name should be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.RegisterHr);

// --- HR Login ---
router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.loginHr);

// --- HR Profile & Logout ---
router.get('/profile', authHrMiddleware.authHr, hrController.getProfile);
router.post('/logout', authHrMiddleware.authHr, hrController.logoutHr);

// --- Create Interview & Send Invites ---
router.post('/interviews', authHrMiddleware.authHr, async (req, res) => {
  try {
    const { role, technicalDomain, questions, candidateEmails } = req.body;
    
    // Check balance - 50rs per candidate
    const hr = await Hr.findById(req.user._id);
    const requiredBalance = candidateEmails.length * 50;
    
    if ((hr.Balance || 0) < requiredBalance) {
      return res.status(400).json({ 
        message: `Insufficient balance. Required: ₹${requiredBalance}, Available: ₹${hr.Balance || 0}` 
      });
    }
    
    const interviewId = Date.now();
    const newInterview = {
      role,
      technicalDomain,
      questions: questions.map(q => ({
        text: q.question || q.text,
        expectedAnswer: q.expectedAnswer || q.answer
      })),
      candidates: candidateEmails.map(email => ({
        email,
        interviewLink: `http://localhost:5173/interview`,
        answers: [],
        scores: []
      })),
      createdAt: new Date()
    };
    
    if (!hr.interviews) hr.interviews = [];
    hr.interviews.push(newInterview);
    hr.interviewCount = (hr.interviewCount || 0) + 1;
    hr.Balance = (hr.Balance || 0) - requiredBalance; // Deduct balance
    await hr.save();

    // Send email invites (implement sendInterviewInvitation in your email service)
    const { sendInterviewInvitation } = require('../services/email.service');
    await Promise.all(candidateEmails.map(email => {
      const interviewDetails = {
        role,
        technicalDomain,
        questions,
        interviewLink: `http://localhost:5173/interview`
      };
      return sendInterviewInvitation(email, interviewDetails);
    }));

    res.status(201).json({
      message: 'Interview created and invitations sent successfully',
      interview: newInterview,
      emailsSent: candidateEmails.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- Get All Interviews for HR ---
router.get('/interviews', authHrMiddleware.authHr, async (req, res) => {
  try {
    const hr = await Hr.findById(req.user._id);
    res.json({ interviews: hr.interviews || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- Get Candidate's Company/Interview Info ---
router.post('/get-candidate-company', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });
  try {
    const hr = await Hr.aggregate([
      { $match: { 'interviews.candidates.email': email } },
      { $project: {
          companyName: 1,
          email: 1,
          profilePicture: 1,
          socialLinks: 1,
          interviewCount: 1,
          interviewCountCandidate: 1,
          createdAt: 1,
          interviews: {
            $filter: {
              input: '$interviews',
              as: 'interview',
              cond: {
                $in: [
                  email,
                  { $map: { input: '$$interview.candidates', as: 'c', in: '$$c.email' } }
                ]
              }
            }
          }
        }
      }
    ]);
    if (!hr || hr.length === 0) return res.status(404).json({ msg: "Candidate not found" });
    res.json(hr[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- Candidate Register for Interview ---
router.post("/candidate-register", upload.single("resume"), async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone || !req.file) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  try {
    const hr = await Hr.findOne({ "interviews.candidates.email": email });
    if (!hr) return res.status(404).json({ msg: "Candidate's interview not found" });
    const interview = hr.interviews.find(interview =>
      interview.candidates.some(c => c.email === email)
    );
    if (!interview) return res.status(404).json({ msg: "Interview not found" });
    const candidate = interview.candidates.find(c => c.email === email);
    if (!candidate) return res.status(404).json({ msg: "Candidate not found in interview" });
    if (candidate.status === "completed") {
      return res.status(403).json({ msg: "You have already completed the interview." });
    }
    candidate.name = name;
    candidate.phone = phone;
    candidate.resume = req.file.path;
    hr.markModified("interviews");
    await hr.save();
    res.json({ questions: interview.questions });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// --- Upload Candidate's Screen Recording ---
router.post("/upload-screen-recording", upload.single("screenRecording"), async (req, res) => {
  const { email } = req.body;
  if (!email || !req.file) {
    return res.status(400).json({ msg: "Email and recording required" });
  }
  try {
    const hr = await Hr.findOne({ "interviews.candidates.email": email });
    if (!hr) return res.status(404).json({ msg: "Candidate not found" });
    const interview = hr.interviews.find(interview =>
      interview.candidates.some(c => c.email === email)
    );
    if (!interview) return res.status(404).json({ msg: "Interview not found" });
    const candidate = interview.candidates.find(c => c.email === email);
    if (!candidate) return res.status(404).json({ msg: "Candidate not found in interview" });
    candidate.screenRecording = req.file.path;
    hr.markModified("interviews");
    await hr.save();
    res.json({ msg: "Screen recording saved" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// --- Save Candidate Answer + Gemini AI Scoring & Improvement Suggestion ---
router.post("/save-answer", async (req, res) => {
  const { email, answer, questionIndex, question, expectedAnswer } = req.body;
  if (!email || answer === undefined || questionIndex === undefined || !question) {
    return res.status(400).json({ msg: "Missing required fields" });
  }
  try {
    const hr = await Hr.findOne({ "interviews.candidates.email": email });
    if (!hr) return res.status(404).json({ msg: "Candidate not found" });
    const interview = hr.interviews.find(interview =>
      interview.candidates.some(c => c.email === email)
    );
    if (!interview) return res.status(404).json({ msg: "Interview not found" });
    const candidate = interview.candidates.find(c => c.email === email);
    if (!candidate) return res.status(404).json({ msg: "Candidate not found in interview" });

    // Save answer
    if (!Array.isArray(candidate.answers)) candidate.answers = [];
    while (candidate.answers.length <= questionIndex) {
      candidate.answers.push("");
    }
    candidate.answers[questionIndex] = answer;

    // --- Gemini AI scoring integration ---
    const prompt = `You are an expert technical interviewer. Analyze this candidate's answer and provide scores from 1-5 for each criteria.

Question: ${question}
Expected Answer: ${expectedAnswer || "Not provided"}
Candidate Answer: ${answer}

Please respond ONLY with valid JSON in this exact format:
{
  "Relevance": "4 - Directly addresses the question",
  "ContentDepth": "3 - Shows good understanding", 
  "CommunicationSkill": "4 - Clear and well-structured",
  "Sentiment": "4 - Positive and confident",
  "skillcorrect": "3 - Demonstrates competency",
  "overallscore": "4 - Strong overall response"
}

Score 1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent. Respond with JSON only.`;

    let scores = {};
    let aiFeedback = "";
    let improvement = "";

    try {
      // Check if Gemini API key is available
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }
      
      // 1. Get scores using Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini API Response:', text);
      
      // Try to parse JSON response
      try {
        scores = JSON.parse(text);
      } catch (parseError) {
        // Extract scores from text response manually
        console.log('Parsing JSON failed, extracting scores manually');
        scores = extractScoresFromText(text, answer, expectedAnswer);
      }

      // 2. Get improvement suggestion
      const improvementPrompt = `Based on this interview question and answer, provide ONE specific improvement suggestion in 1-2 sentences:

Question: ${question}
Candidate Answer: ${answer}

Provide only the improvement suggestion, no other text:`;
      const improvementResult = await model.generateContent(improvementPrompt);
      const improvementResponse = await improvementResult.response;
      improvement = improvementResponse.text().trim();

      aiFeedback = "See detailed scores and comments above.";

    } catch (geminiErr) {
      console.error('Gemini API Error:', geminiErr.message);
      // Use intelligent fallback scoring based on answer analysis
      scores = generateFallbackScores(answer, expectedAnswer, question);
      aiFeedback = "AI analysis completed using fallback system.";
      improvement = generateFallbackImprovement(answer, expectedAnswer);
    }

    // Save scores, feedback, and improvement
    if (!Array.isArray(candidate.scores)) candidate.scores = [];
    while (candidate.scores.length <= questionIndex) {
      candidate.scores.push({});
    }
    candidate.scores[questionIndex] = {
      Relevance: scores.Relevance || '0 - No analysis',
      ContentDepth: scores.ContentDepth || '0 - No analysis',
      CommunicationSkill: scores.CommunicationSkill || '0 - No analysis',
      Sentiment: scores.Sentiment || '0 - No analysis',
      skillcorrect: scores.skillcorrect || '0 - No analysis',
      overallscore: scores.overallscore || '0 - No analysis',
      aiFeedback,
      improvement
    };

    // Update candidate status if all questions answered
    if (candidate.answers.filter(a => a && a.trim()).length === interview.questions.length) {
      candidate.status = 'completed';
      candidate.completedAt = new Date();
    }

    hr.markModified("interviews");
    await hr.save();

    res.json({ 
      msg: "Answer and scores saved", 
      scores: candidate.scores[questionIndex], 
      improvement,
      isCompleted: candidate.status === 'completed'
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Candidate answer submission with cheating detection
router.post('/candidate/submit-answer', async (req, res) => {
  try {
    const { interviewId, candidateEmail, questionIndex, answer, cheatingFlags } = req.body
    
    const hr = await Hr.findOne({ 'interviews._id': interviewId })
    if (!hr) return res.status(404).json({ message: 'Interview not found' })
    
    const interview = hr.interviews.id(interviewId)
    const candidate = interview.candidates.find(c => c.email === candidateEmail)
    
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' })
    
    // Save answer
    if (!candidate.answers) candidate.answers = []
    candidate.answers[questionIndex] = answer
    
    // Calculate score (dummy AI scoring)
    const expectedAnswer = interview.questions[questionIndex]?.expectedAnswer || ''
    const score = calculateAnswerScore(answer, expectedAnswer)
    
    if (!candidate.scores) candidate.scores = []
    candidate.scores[questionIndex] = score
    
    // Save cheating flags
    if (cheatingFlags && cheatingFlags.length > 0) {
      candidate.cheatingDetected = true
      candidate.cheatingFlags = cheatingFlags
    }
    
    await hr.save()
    res.json({ message: 'Answer submitted successfully', score })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get candidate interview using query parameters
router.get('/candidate/interview', async (req, res) => {
  try {
    const { id: interviewId, email } = req.query
    
    if (!interviewId || !email) {
      return res.status(400).json({ message: 'Interview ID and email are required' })
    }
    
    const hr = await Hr.findOne({ 'interviews._id': interviewId })
    if (!hr) return res.status(404).json({ message: 'Interview not found' })
    
    const interview = hr.interviews.id(interviewId)
    const candidate = interview.candidates.find(c => c.email === email)
    
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' })
    
    res.json({ 
      interview: {
        role: interview.role,
        technicalDomain: interview.technicalDomain,
        questions: interview.questions.map(q => ({ text: q.text }))
      },
      candidate: {
        email: candidate.email,
        answers: candidate.answers || [],
        currentQuestion: candidate.answers?.length || 0
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Helper function for scoring
function calculateAnswerScore(answer, expectedAnswer) {
  if (!answer || !expectedAnswer) return 0
  
  const answerWords = answer.toLowerCase().split(' ')
  const expectedWords = expectedAnswer.toLowerCase().split(' ')
  
  let matches = 0
  expectedWords.forEach(word => {
    if (word.length > 3 && answerWords.some(aw => aw.includes(word))) {
      matches++
    }
  })
  
  const score = Math.min(100, Math.max(0, (matches / expectedWords.length) * 100))
  return Math.round(score)
}

// Log user actions for cheating detection
router.post('/log-action', async (req, res) => {
  try {
    const { email, action, timestamp } = req.body
    // You can save this to a separate logging collection or add to candidate record
    console.log(`User Action: ${email} - ${action} at ${timestamp}`)
    res.json({ message: 'Action logged successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Helper function to extract scores from text response
function extractScoresFromText(text, answer, expectedAnswer) {
  const scores = {
    Relevance: "3 - Moderate relevance",
    ContentDepth: "3 - Adequate depth", 
    CommunicationSkill: "3 - Clear communication",
    Sentiment: "4 - Positive attitude",
    skillcorrect: "3 - Basic understanding",
    overallscore: "3 - Satisfactory response"
  };
  
  // Try to extract numeric scores from text
  const relevanceMatch = text.match(/relevance[:\s]*(\d)/i);
  const depthMatch = text.match(/depth[:\s]*(\d)/i);
  const commMatch = text.match(/communication[:\s]*(\d)/i);
  const sentMatch = text.match(/sentiment[:\s]*(\d)/i);
  const skillMatch = text.match(/skill[:\s]*(\d)/i);
  const overallMatch = text.match(/overall[:\s]*(\d)/i);
  
  if (relevanceMatch) scores.Relevance = `${relevanceMatch[1]} - AI analyzed relevance`;
  if (depthMatch) scores.ContentDepth = `${depthMatch[1]} - AI analyzed depth`;
  if (commMatch) scores.CommunicationSkill = `${commMatch[1]} - AI analyzed communication`;
  if (sentMatch) scores.Sentiment = `${sentMatch[1]} - AI analyzed sentiment`;
  if (skillMatch) scores.skillcorrect = `${skillMatch[1]} - AI analyzed skill`;
  if (overallMatch) scores.overallscore = `${overallMatch[1]} - AI overall score`;
  
  return scores;
}

// Generate intelligent fallback scores
function generateFallbackScores(answer, expectedAnswer, question) {
  if (!answer || answer.trim().length === 0) {
    return {
      Relevance: "1 - No answer provided",
      ContentDepth: "1 - No content to analyze",
      CommunicationSkill: "1 - No communication",
      Sentiment: "2 - Neutral",
      skillcorrect: "1 - No demonstration of skill",
      overallscore: "1 - Insufficient response"
    };
  }
  
  const answerLength = answer.trim().length;
  const wordCount = answer.trim().split(/\s+/).length;
  
  // Basic scoring based on answer characteristics
  let relevanceScore = 2;
  let depthScore = 2;
  let commScore = 2;
  let sentimentScore = 3;
  let skillScore = 2;
  
  // Length-based scoring
  if (answerLength > 100) depthScore += 1;
  if (answerLength > 200) depthScore += 1;
  if (wordCount > 20) commScore += 1;
  
  // Keyword matching for relevance
  if (expectedAnswer) {
    const expectedWords = expectedAnswer.toLowerCase().split(/\s+/);
    const answerWords = answer.toLowerCase().split(/\s+/);
    let matches = 0;
    
    expectedWords.forEach(word => {
      if (word.length > 3 && answerWords.some(aw => aw.includes(word))) {
        matches++;
      }
    });
    
    const matchRatio = matches / expectedWords.length;
    if (matchRatio > 0.3) relevanceScore += 1;
    if (matchRatio > 0.5) {
      relevanceScore += 1;
      skillScore += 1;
    }
  }
  
  // Technical terms boost
  const techTerms = ['function', 'method', 'class', 'object', 'array', 'database', 'api', 'server', 'client', 'framework'];
  const hasTechTerms = techTerms.some(term => answer.toLowerCase().includes(term));
  if (hasTechTerms) {
    skillScore += 1;
    depthScore += 1;
  }
  
  // Cap scores at 5
  relevanceScore = Math.min(5, relevanceScore);
  depthScore = Math.min(5, depthScore);
  commScore = Math.min(5, commScore);
  skillScore = Math.min(5, skillScore);
  
  const overallScore = Math.round((relevanceScore + depthScore + commScore + skillScore) / 4);
  
  return {
    Relevance: `${relevanceScore} - ${getScoreDescription(relevanceScore, 'relevance')}`,
    ContentDepth: `${depthScore} - ${getScoreDescription(depthScore, 'depth')}`,
    CommunicationSkill: `${commScore} - ${getScoreDescription(commScore, 'communication')}`,
    Sentiment: `${sentimentScore} - Positive and engaged`,
    skillcorrect: `${skillScore} - ${getScoreDescription(skillScore, 'skill')}`,
    overallscore: `${overallScore} - ${getScoreDescription(overallScore, 'overall')}`
  };
}

function getScoreDescription(score, type) {
  const descriptions = {
    1: { relevance: 'Not relevant', depth: 'Superficial', communication: 'Unclear', skill: 'No demonstration', overall: 'Poor' },
    2: { relevance: 'Somewhat relevant', depth: 'Basic level', communication: 'Adequate', skill: 'Limited understanding', overall: 'Below average' },
    3: { relevance: 'Moderately relevant', depth: 'Good understanding', communication: 'Clear', skill: 'Basic competency', overall: 'Average' },
    4: { relevance: 'Highly relevant', depth: 'Comprehensive', communication: 'Articulate', skill: 'Good expertise', overall: 'Above average' },
    5: { relevance: 'Perfectly relevant', depth: 'Expert level', communication: 'Excellent', skill: 'Expert demonstration', overall: 'Excellent' }
  };
  
  return descriptions[score]?.[type] || 'Good response';
}

function generateFallbackImprovement(answer, expectedAnswer) {
  if (!answer || answer.trim().length === 0) {
    return "Please provide a complete answer to demonstrate your understanding of the topic.";
  }
  
  const improvements = [
    "Consider providing more specific examples to illustrate your points.",
    "Try to elaborate on the technical details and implementation aspects.",
    "Include practical use cases or scenarios where this concept applies.",
    "Explain the benefits and potential challenges of your approach.",
    "Consider mentioning best practices or industry standards related to this topic."
  ];
  
  return improvements[Math.floor(Math.random() * improvements.length)];
}

module.exports = router;
