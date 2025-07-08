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

    // --- Enhanced Gemini AI scoring integration ---
    const prompt = `You are a senior technical interviewer and HR expert. Conduct a comprehensive analysis of this candidate's response.

INTERVIEW CONTEXT:
Question: ${question}
Expected Answer: ${expectedAnswer || "Not provided"}
Candidate's Answer: ${answer}
Answer Length: ${answer.length} characters
Word Count: ${answer.split(' ').length} words

COMPREHENSIVE EVALUATION CRITERIA:
Analyze and score (1-5) each parameter with detailed reasoning:

1. TECHNICAL RELEVANCE: Direct alignment with question requirements
2. CONTENT DEPTH: Technical accuracy, completeness, and sophistication
3. COMMUNICATION CLARITY: Structure, articulation, and professional presentation
4. CONFIDENCE & ATTITUDE: Professional demeanor and self-assurance
5. PRACTICAL KNOWLEDGE: Real-world application and hands-on understanding
6. PROBLEM-SOLVING APPROACH: Logical thinking and methodology
7. INDUSTRY AWARENESS: Current trends and best practices knowledge
8. OVERALL COMPETENCY: Holistic candidate assessment for hiring decision

CRITICAL: Respond with ONLY valid JSON. No extra text, explanations, or formatting. Just the JSON object:

{
"TechnicalRelevance": "4 - Answer directly addresses the core question with good focus on key concepts",
"ContentDepth": "3 - Shows solid understanding but lacks some technical details and examples",
"CommunicationClarity": "4 - Well-structured response with clear explanations and logical flow",
"ConfidenceAttitude": "4 - Confident and professional tone, shows enthusiasm for the topic",
"PracticalKnowledge": "3 - Demonstrates competency but could show more practical application",
"ProblemSolving": "3 - Shows logical thinking but could demonstrate better methodology",
"IndustryAwareness": "3 - Basic awareness of industry practices and current trends",
"OverallCompetency": "4 - Strong candidate with good technical foundation and communication skills"
}

SCORING GUIDE:
1 = Poor (Major gaps, incorrect, unclear)
2 = Below Average (Some issues, incomplete)
3 = Average (Meets basic requirements)
4 = Good (Above expectations, well done)
5 = Excellent (Outstanding, comprehensive)

Provide detailed, constructive feedback in each score description.`;

    let scores = {};
    let aiFeedback = "";
    let improvement = "";

    try {
      // Check if Gemini API key is available
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }
      
      console.log('🤖 Starting REAL Gemini AI Analysis...');
      
      // 1. Get scores using Gemini API with retry mechanism
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      
      let result, response, text;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1}/${maxRetries} - Calling Gemini API...`);
          result = await model.generateContent(prompt);
          response = await result.response;
          text = response.text();
          console.log('✅ Gemini API call successful');
          break;
        } catch (apiError) {
          retryCount++;
          console.log(`❌ Attempt ${retryCount} failed:`, apiError.message);
          if (retryCount >= maxRetries) {
            throw apiError;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      console.log('\n=== GEMINI AI ANALYSIS ===');
      console.log('Question:', question);
      console.log('Candidate Answer:', answer.substring(0, 100) + '...');
      console.log('Raw AI Response:', text);
      
      // Try to parse JSON response with cleaning
      try {
        // Clean the response text
        let cleanText = text.trim();
        
        // Remove markdown code blocks if present
        cleanText = cleanText.replace(/```json\s*|```\s*/g, '');
        
        // Remove any text before the first { and after the last }
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
        
        console.log('Cleaned text for parsing:', cleanText);
        scores = JSON.parse(cleanText);
        console.log('✅ JSON Parsed Successfully');
        console.log('Parsed Scores:', scores);
      } catch (parseError) {
        console.log('❌ JSON Parsing Failed:', parseError.message);
        console.log('Original text:', text);
        console.log('🔄 Extracting scores manually from text');
        scores = extractScoresFromText(text, answer, expectedAnswer);
        console.log('Extracted Scores:', scores);
      }

      // 2. Get detailed improvement suggestion
      const improvementPrompt = `As an expert technical interviewer, provide detailed improvement suggestions for this candidate:

Question: ${question}
Expected Answer: ${expectedAnswer || "Not provided"}
Candidate Answer: ${answer}

Provide 2-3 specific, actionable improvement suggestions that would help the candidate give a stronger answer. Focus on:
- Technical accuracy and completeness
- Communication and structure
- Practical examples or use cases
- Industry best practices

Format as a clear, constructive paragraph (3-4 sentences):`;
      const improvementResult = await model.generateContent(improvementPrompt);
      const improvementResponse = await improvementResult.response;
      improvement = improvementResponse.text().trim();
      
      console.log('\n=== IMPROVEMENT SUGGESTION ===');
      console.log('AI Improvement:', improvement);

      aiFeedback = "Comprehensive AI analysis completed with detailed scoring and improvement suggestions.";

    } catch (geminiErr) {
      console.error('Gemini API Error:', geminiErr.message);
      // Use intelligent fallback scoring based on answer analysis
      scores = generateFallbackScores(answer, expectedAnswer, question);
      aiFeedback = "AI analysis completed using fallback system.";
      improvement = generateFallbackImprovement(answer, expectedAnswer);
    }

    // Save scores, feedback, and improvement with proper mapping
    if (!Array.isArray(candidate.scores)) candidate.scores = [];
    while (candidate.scores.length <= questionIndex) {
      candidate.scores.push({});
    }
    
    // Map new enhanced scores to old format for compatibility
    const mappedScores = {
      Relevance: scores.TechnicalRelevance || scores.Relevance || '0 - No analysis',
      ContentDepth: scores.ContentDepth || '0 - No analysis',
      CommunicationSkill: scores.CommunicationClarity || scores.CommunicationSkill || '0 - No analysis',
      Sentiment: scores.ConfidenceAttitude || scores.Sentiment || '0 - No analysis',
      skillcorrect: scores.PracticalKnowledge || scores.skillcorrect || '0 - No analysis',
      overallscore: scores.OverallCompetency || scores.overallscore || '0 - No analysis',
      // Enhanced fields
      TechnicalRelevance: scores.TechnicalRelevance || '0 - No analysis',
      ProblemSolving: scores.ProblemSolving || '0 - No analysis',
      IndustryAwareness: scores.IndustryAwareness || '0 - No analysis',
      aiFeedback,
      improvement
    };
    
    candidate.scores[questionIndex] = mappedScores;
    
    console.log('\n=== SAVING TO DATABASE ===');
    console.log('Question Index:', questionIndex);
    console.log('Mapped Scores:', mappedScores);
    console.log('Candidate Email:', email);

    // Update candidate status if all questions answered
    if (candidate.answers.filter(a => a && a.trim()).length === interview.questions.length) {
      candidate.status = 'completed';
      candidate.completedAt = new Date();
    }

    console.log('\n=== FORCE DATABASE SAVE ===');
    console.log('Before save - Candidate scores length:', candidate.scores.length);
    console.log('Saving scores for question', questionIndex);
    console.log('Final scores object:', candidate.scores[questionIndex]);
    
    // Simplified save approach
    hr.markModified('interviews');
    
    try {
      await hr.save();
      console.log('✅ Database save successful');
    } catch (saveError) {
      console.error('❌ Database save failed:', saveError.message);
      // Try alternative save method
      try {
        await Hr.findByIdAndUpdate(hr._id, { interviews: hr.interviews });
        console.log('✅ Alternative save method successful');
      } catch (altSaveError) {
        console.error('❌ Alternative save also failed:', altSaveError.message);
        throw new Error('Failed to save interview data');
      }
    }
    
    // Verify save by re-fetching
    try {
      const verifyHr = await Hr.findById(hr._id);
      const verifyInterview = verifyHr.interviews.find(i => i.candidates.some(c => c.email === email));
      const verifyCandidate = verifyInterview.candidates.find(c => c.email === email);
      
      console.log('✅ VERIFICATION - Scores in DB:', verifyCandidate.scores[questionIndex]);
    } catch (verifyError) {
      console.log('⚠️ Verification failed but save likely succeeded:', verifyError.message);
    }
    console.log('=== END AI ANALYSIS ===\n');

    res.json({ 
      msg: "Answer analyzed and saved successfully", 
      scores: candidate.scores[questionIndex], 
      improvement,
      isCompleted: candidate.status === 'completed',
      aiAnalysisComplete: true
    });
  } catch (err) {
    console.error('\n=== SAVE ANSWER ERROR ===');
    console.error('Error details:', err);
    console.error('Stack trace:', err.stack);
    console.error('Email:', email);
    console.error('Question Index:', questionIndex);
    console.error('=== END ERROR ===\n');
    
    res.status(500).json({ 
      msg: "Failed to save answer and analyze response", 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
  console.log('\n=== EXTRACTING SCORES FROM TEXT ===');
  console.log('Raw text to parse:', text);
  
  // Try to find JSON-like content in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      console.log('Found JSON-like content:', jsonMatch[0]);
      const cleanJson = jsonMatch[0]
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/,\s*}/g, '}');
      const parsed = JSON.parse(cleanJson);
      console.log('Successfully parsed JSON from text:', parsed);
      return parsed;
    } catch (e) {
      console.log('Failed to parse extracted JSON:', e.message);
    }
  }
  
  // Advanced pattern matching for scores
  const scores = {};
  
  // Look for "Relevance": "4 - description" patterns
  const patterns = {
    Relevance: /"?Relevance"?\s*:?\s*"?([1-5])\s*-\s*([^"\n]+)"?/i,
    ContentDepth: /"?ContentDepth"?\s*:?\s*"?([1-5])\s*-\s*([^"\n]+)"?/i,
    CommunicationSkill: /"?CommunicationSkill"?\s*:?\s*"?([1-5])\s*-\s*([^"\n]+)"?/i,
    Sentiment: /"?Sentiment"?\s*:?\s*"?([1-5])\s*-\s*([^"\n]+)"?/i,
    skillcorrect: /"?skillcorrect"?\s*:?\s*"?([1-5])\s*-\s*([^"\n]+)"?/i,
    overallscore: /"?overallscore"?\s*:?\s*"?([1-5])\s*-\s*([^"\n]+)"?/i
  };
  
  let foundAny = false;
  Object.keys(patterns).forEach(key => {
    const match = text.match(patterns[key]);
    if (match) {
      scores[key] = `${match[1]} - ${match[2].trim()}`;
      foundAny = true;
      console.log(`Extracted ${key}: ${scores[key]}`);
    }
  });
  
  if (foundAny) {
    console.log('Successfully extracted scores from patterns:', scores);
    return scores;
  }
  
  // If no patterns found, use intelligent fallback
  console.log('No patterns found, using intelligent fallback');
  return generateFallbackScores(answer, expectedAnswer, 'Failed to parse AI response');
}

// Generate intelligent fallback scores
function generateFallbackScores(answer, expectedAnswer, question) {
  console.log('\n=== FALLBACK SCORING SYSTEM ===');
  console.log('Using intelligent fallback analysis');
  
  if (!answer || answer.trim().length === 0) {
    return {
      Relevance: "1 - No answer provided, unable to assess relevance to the question",
      ContentDepth: "1 - No content available for technical depth analysis",
      CommunicationSkill: "1 - No communication demonstrated, cannot evaluate clarity",
      Sentiment: "2 - Neutral response, no engagement indicators present",
      skillcorrect: "1 - No technical skills or knowledge demonstrated in response",
      overallscore: "1 - Insufficient response for comprehensive evaluation"
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
  
  const finalScores = {
    Relevance: `${relevanceScore} - ${getDetailedScoreDescription(relevanceScore, 'relevance', answer, expectedAnswer)}`,
    ContentDepth: `${depthScore} - ${getDetailedScoreDescription(depthScore, 'depth', answer, expectedAnswer)}`,
    CommunicationSkill: `${commScore} - ${getDetailedScoreDescription(commScore, 'communication', answer, expectedAnswer)}`,
    Sentiment: `${sentimentScore} - Shows positive engagement and professional attitude in response`,
    skillcorrect: `${skillScore} - ${getDetailedScoreDescription(skillScore, 'skill', answer, expectedAnswer)}`,
    overallscore: `${overallScore} - ${getDetailedScoreDescription(overallScore, 'overall', answer, expectedAnswer)}`
  };
  
  console.log('Fallback scores generated:', finalScores);
  return finalScores;
}

function getDetailedScoreDescription(score, type, answer, expectedAnswer) {
  const answerLength = answer ? answer.length : 0;
  const wordCount = answer ? answer.split(/\s+/).length : 0;
  
  const descriptions = {
    1: { 
      relevance: `Answer does not address the core question. Lacks focus on required topics.`,
      depth: `Very superficial response with minimal technical content (${wordCount} words).`,
      communication: `Unclear expression with poor structure and difficult to follow logic.`,
      skill: `No demonstration of technical knowledge or practical understanding.`,
      overall: `Poor performance requiring significant improvement across all areas.`
    },
    2: { 
      relevance: `Somewhat addresses the question but misses key points or goes off-topic.`,
      depth: `Basic level understanding with limited technical details (${wordCount} words).`,
      communication: `Adequate communication but lacks clarity and proper structure.`,
      skill: `Limited technical understanding with gaps in fundamental concepts.`,
      overall: `Below average performance with room for improvement in technical depth.`
    },
    3: { 
      relevance: `Moderately relevant answer covering main points but could be more focused.`,
      depth: `Good understanding demonstrated with reasonable technical content (${wordCount} words).`,
      communication: `Clear communication with logical flow and understandable explanations.`,
      skill: `Basic competency shown with fundamental concepts understood correctly.`,
      overall: `Average performance meeting basic requirements with solid foundation.`
    },
    4: { 
      relevance: `Highly relevant response directly addressing question with good focus.`,
      depth: `Comprehensive understanding with detailed technical explanations (${wordCount} words).`,
      communication: `Articulate and well-structured response with clear professional communication.`,
      skill: `Good technical expertise demonstrated with practical knowledge application.`,
      overall: `Above average performance showing strong technical competency and communication.`
    },
    5: { 
      relevance: `Perfectly relevant answer comprehensively addressing all aspects of the question.`,
      depth: `Expert level understanding with exceptional technical depth and insights (${wordCount} words).`,
      communication: `Excellent communication with outstanding clarity, structure, and professional presentation.`,
      skill: `Expert demonstration of technical mastery with advanced practical applications.`,
      overall: `Excellent performance exceeding expectations with exceptional technical and communication skills.`
    }
  };
  
  return descriptions[score]?.[type] || `Good response demonstrating competency in ${type}.`;
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
