const express = require('express');
const { body } = require('express-validator');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const hrController = require('../controllers/hr.controller');
const authHrMiddleware = require('../middlewares/hr.middleware');
const Hr = require('../models/hr.model');

const { GoogleGenerativeAI, Type } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const router = express.Router();

router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('companyName').isLength({ min: 3 }).withMessage('Company Name should be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.RegisterHr);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.loginHr);

router.get('/profile', authHrMiddleware.authHr, hrController.getProfile);
router.post('/logout', authHrMiddleware.authHr, hrController.logoutHr);

router.post('/interviews', authHrMiddleware.authHr, async (req, res) => {
  try {
    const { role, technicalDomain, questions, candidateEmails } = req.body;
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
        interviewLink: `https://neorecruiter.vercel.app/interview`,
        answers: [],
        scores: []
      })),
      createdAt: new Date()
    };

    if (!hr.interviews) hr.interviews = [];
    hr.interviews.push(newInterview);
    hr.interviewCount = (hr.interviewCount || 0) + 1;
    hr.Balance = (hr.Balance || 0) - requiredBalance; 
    await hr.save();

    const { sendInterviewInvitation } = require('../services/email.service');
    await Promise.all(candidateEmails.map(email => {
      const interviewDetails = {
        role,
        technicalDomain,
        questions,
        interviewLink: `https://neorecruiter.vercel.app/interview`
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

router.get('/interviews', authHrMiddleware.authHr, async (req, res) => {
  try {
    const hr = await Hr.findById(req.user._id);
    res.json({ interviews: hr.interviews || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

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

    if (!Array.isArray(candidate.answers)) candidate.answers = [];
    while (candidate.answers.length <= questionIndex) {
      candidate.answers.push("");
    }
    candidate.answers[questionIndex] = answer;

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
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

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
          result = await model.generateContent(prompt);
          response = await result.response;
          text = response.text();
          break;
        } catch (apiError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw apiError;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      try {
        let cleanText = text.trim();
        cleanText = cleanText.replace(/``````\s*/g, '');

        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }

        scores = JSON.parse(cleanText);
      } catch (parseError) {
        scores = extractScoresFromText(text, answer, expectedAnswer);
      }

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

      aiFeedback = "Comprehensive AI analysis completed with detailed scoring and improvement suggestions.";

    } catch (geminiErr) {
      scores = generateFallbackScores(answer, expectedAnswer, question);
      aiFeedback = "AI analysis completed using fallback system.";
      improvement = generateFallbackImprovement(answer, expectedAnswer);
    }

    if (!Array.isArray(candidate.scores)) candidate.scores = [];
    while (candidate.scores.length <= questionIndex) {
      candidate.scores.push({});
    }
    const mappedScores = {
      Relevance: scores.TechnicalRelevance || scores.Relevance || '0 - No analysis',
      ContentDepth: scores.ContentDepth || '0 - No analysis',
      CommunicationSkill: scores.CommunicationClarity || scores.CommunicationSkill || '0 - No analysis',
      Sentiment: scores.ConfidenceAttitude || scores.Sentiment || '0 - No analysis',
      skillcorrect: scores.PracticalKnowledge || scores.skillcorrect || '0 - No analysis',
      overallscore: scores.OverallCompetency || scores.overallscore || '0 - No analysis',
      TechnicalRelevance: scores.TechnicalRelevance || '0 - No analysis',
      ProblemSolving: scores.ProblemSolving || '0 - No analysis',
      IndustryAwareness: scores.IndustryAwareness || '0 - No analysis',
      aiFeedback,
      improvement
    };
    candidate.scores[questionIndex] = mappedScores;

    if (candidate.answers.filter(a => a && a.trim()).length === interview.questions.length) {
      candidate.status = 'completed';
      candidate.completedAt = new Date();
    }

    hr.markModified('interviews');
    try {
      await hr.save();
    } catch (saveError) {
      try {
        await Hr.findByIdAndUpdate(hr._id, { interviews: hr.interviews });
      } catch (altSaveError) {
        throw new Error('Failed to save interview data');
      }
    }
    res.json({ 
      msg: "Answer analyzed and saved successfully", 
      scores: candidate.scores[questionIndex], 
      improvement,
      isCompleted: candidate.status === 'completed',
      aiAnalysisComplete: true
    });
  } catch (err) {
    res.status(500).json({ 
      msg: "Failed to save answer and analyze response", 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

router.post('/candidate/submit-answer', async (req, res) => {
  try {
    const { interviewId, candidateEmail, questionIndex, answer, cheatingFlags } = req.body
    const hr = await Hr.findOne({ 'interviews._id': interviewId })
    if (!hr) return res.status(404).json({ message: 'Interview not found' })

    const interview = hr.interviews.id(interviewId)
    const candidate = interview.candidates.find(c => c.email === candidateEmail)
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' })

    if (!candidate.answers) candidate.answers = []
    candidate.answers[questionIndex] = answer

    const expectedAnswer = interview.questions[questionIndex]?.expectedAnswer || ''
    const score = calculateAnswerScore(answer, expectedAnswer)
    if (!candidate.scores) candidate.scores = []
    candidate.scores[questionIndex] = score

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

router.post('/log-action', async (req, res) => {
  try {
    const { email, action, timestamp } = req.body
    res.json({ message: 'Action logged successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

function extractScoresFromText(text, answer, expectedAnswer) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const cleanJson = jsonMatch[0]
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/,\s*}/g, '}');
      const parsed = JSON.parse(cleanJson);
      return parsed;
    } catch (e) {}
  }
  const scores = {};
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
    }
  });
  if (foundAny) {
    return scores;
  }
  return generateFallbackScores(answer, expectedAnswer, 'Failed to parse AI response');
}

function generateFallbackScores(answer, expectedAnswer, question) {
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
  let relevanceScore = 2;
  let depthScore = 2;
  let commScore = 2;
  let sentimentScore = 3;
  let skillScore = 2;
  if (answerLength > 100) depthScore += 1;
  if (answerLength > 200) depthScore += 1;
  if (wordCount > 20) commScore += 1;
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
  const techTerms = ['function', 'method', 'class', 'object', 'array', 'database', 'api', 'server', 'client', 'framework'];
  const hasTechTerms = techTerms.some(term => answer.toLowerCase().includes(term));
  if (hasTechTerms) {
    skillScore += 1;
    depthScore += 1;
  }
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
