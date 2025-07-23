const Hr = require('../models/hr.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

// Initialize Gemini AI
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDDy3ynmYdkLRTWGRQmUaVYNJKemSssIKs');
} catch (err) {
  console.error('Failed to initialize Gemini AI:', err);
}

// Get interview details for a candidate
exports.getInterviewForCandidate = async (req, res) => {
  try {
    const { id, email } = req.query;
    
    if (!id || !email) {
      return res.status(400).json({ message: 'Interview ID and email are required' });
    }
    
    // Find the HR that has this interview
    const hr = await Hr.findOne({ 'interviews._id': id });
    if (!hr) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the interview
    const interview = hr.interviews.find(i => i._id.toString() === id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the candidate
    const candidateIndex = interview.candidates.findIndex(c => c.email === email);
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found in this interview' });
    }
    
    const candidate = interview.candidates[candidateIndex];
    
    // Return interview details with questions
    res.json({
      interview: {
        role: interview.role,
        technicalDomain: interview.technicalDomain,
        questions: interview.questions.map(q => ({ text: q.text }))
      },
      candidate: {
        email: candidate.email,
        name: candidate.name || '',
        answers: candidate.answers || [],
        currentQuestion: candidate.answers ? candidate.answers.length : 0
      }
    });
  } catch (error) {
    console.error('Error getting interview for candidate:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit candidate answer and analyze with Gemini AI
exports.submitCandidateAnswer = async (req, res) => {
  try {
    const { interviewId, email, answer, questionIndex } = req.body;
    
    if (!interviewId || !email || !answer || questionIndex === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find the HR that has this interview
    const hr = await Hr.findOne({ 'interviews._id': interviewId });
    if (!hr) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the interview
    const interviewIndex = hr.interviews.findIndex(i => i._id.toString() === interviewId);
    if (interviewIndex === -1) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    const interview = hr.interviews[interviewIndex];
    
    // Find the candidate
    const candidateIndex = interview.candidates.findIndex(c => c.email === email);
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found in this interview' });
    }
    
    // Get the question
    if (questionIndex >= interview.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }
    
    const question = interview.questions[questionIndex];
    const expectedAnswer = question.expectedAnswer;
    
    // Analyze the answer with Gemini AI
    let analysis = {};
    let aiAnalysisComplete = false;
    
    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
          Analyze the following interview answer for a ${interview.role} position:
          
          Question: ${question.text}
          Expected Answer: ${expectedAnswer}
          Candidate's Answer: ${answer}
          
          Provide a detailed analysis in JSON format with the following structure:
          {
            "Relevance": "Score on a scale of 1-5 with description",
            "ContentDepth": "Score on a scale of 1-5 with description",
            "CommunicationSkill": "Score on a scale of 1-5 with description",
            "Sentiment": "Score on a scale of 1-5 with description",
            "overallscore": "Score on a scale of 1-5 with description",
            "improvement": "Specific suggestion for improvement"
          }
          
          For each score, use this format: "4 - Detailed description of the score"
          For example: "4 - Answer directly addresses the core question with good focus on key concepts"
          
          Be fair and objective in your assessment.
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        try {
          analysis = JSON.parse(text);
          aiAnalysisComplete = true;
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          // Use fallback scoring
          analysis = generateFallbackScores(answer, expectedAnswer, question.text);
        }
      } else {
        // Use fallback scoring if Gemini AI is not available
        analysis = generateFallbackScores(answer, expectedAnswer, question.text);
      }
    } catch (aiError) {
      console.error('Error analyzing answer with AI:', aiError);
      // Use fallback scoring
      analysis = generateFallbackScores(answer, expectedAnswer, question.text);
    }
    
    // Update the candidate's answers and scores
    if (!hr.interviews[interviewIndex].candidates[candidateIndex].answers) {
      hr.interviews[interviewIndex].candidates[candidateIndex].answers = [];
    }
    if (!hr.interviews[interviewIndex].candidates[candidateIndex].scores) {
      hr.interviews[interviewIndex].candidates[candidateIndex].scores = [];
    }
    
    // Add or update the answer
    if (questionIndex < hr.interviews[interviewIndex].candidates[candidateIndex].answers.length) {
      hr.interviews[interviewIndex].candidates[candidateIndex].answers[questionIndex] = answer;
      hr.interviews[interviewIndex].candidates[candidateIndex].scores[questionIndex] = analysis;
    } else {
      hr.interviews[interviewIndex].candidates[candidateIndex].answers.push(answer);
      hr.interviews[interviewIndex].candidates[candidateIndex].scores.push(analysis);
    }
    
    // Check if this is the last question
    const isCompleted = hr.interviews[interviewIndex].candidates[candidateIndex].answers.length >= interview.questions.length;
    
    if (isCompleted) {
      hr.interviews[interviewIndex].candidates[candidateIndex].status = 'completed';
      hr.interviews[interviewIndex].candidates[candidateIndex].completedAt = new Date();
    }
    
    // Save the changes
    hr.markModified('interviews');
    await hr.save();
    
    res.json({ 
      message: 'Answer analyzed and saved successfully', 
      scores: analysis,
      isCompleted,
      aiAnalysisComplete
    });
  } catch (error) {
    console.error('Error submitting candidate answer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register a candidate for an interview
exports.registerCandidate = async (req, res) => {
  try {
    const { interviewId, email, name, phone } = req.body;
    const resume = req.file ? req.file.path : null;
    
    if (!interviewId || !email) {
      return res.status(400).json({ message: 'Interview ID and email are required' });
    }
    
    // Find the HR that has this interview
    const hr = await Hr.findOne({ 'interviews._id': interviewId });
    if (!hr) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the interview
    const interviewIndex = hr.interviews.findIndex(i => i._id.toString() === interviewId);
    if (interviewIndex === -1) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    const interview = hr.interviews[interviewIndex];
    
    // Check if candidate already exists
    const candidateIndex = interview.candidates.findIndex(c => c.email === email);
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found in this interview' });
    }
    
    // Update candidate information
    hr.interviews[interviewIndex].candidates[candidateIndex].name = name || '';
    hr.interviews[interviewIndex].candidates[candidateIndex].phone = phone || '';
    if (resume) {
      hr.interviews[interviewIndex].candidates[candidateIndex].resume = resume;
    }
    
    // Save the changes
    hr.markModified('interviews');
    await hr.save();
    
    // Return the questions for the interview
    res.json({ 
      message: 'Candidate registered successfully',
      questions: interview.questions.map(q => ({ text: q.text }))
    });
  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload screen recording for a candidate
exports.uploadScreenRecording = async (req, res) => {
  try {
    const { interviewId, email } = req.body;
    const screenRecording = req.file ? req.file.path : null;
    
    if (!interviewId || !email || !screenRecording) {
      return res.status(400).json({ message: 'Interview ID, email, and screen recording are required' });
    }
    
    // Find the HR that has this interview
    const hr = await Hr.findOne({ 'interviews._id': interviewId });
    if (!hr) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the interview
    const interviewIndex = hr.interviews.findIndex(i => i._id.toString() === interviewId);
    if (interviewIndex === -1) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the candidate
    const candidateIndex = hr.interviews[interviewIndex].candidates.findIndex(c => c.email === email);
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found in this interview' });
    }
    
    // Update screen recording
    hr.interviews[interviewIndex].candidates[candidateIndex].screenRecording = screenRecording;
    
    // Save the changes
    hr.markModified('interviews');
    await hr.save();
    
    res.json({ message: 'Screen recording saved successfully' });
  } catch (error) {
    console.error('Error uploading screen recording:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company info for a candidate
exports.getCandidateCompany = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find the HR that has this candidate
    const hr = await Hr.findOne({ 'interviews.candidates.email': email });
    if (!hr) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Find the interview that has this candidate
    const interview = hr.interviews.find(i => i.candidates.some(c => c.email === email));
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found for this candidate' });
    }
    
    res.json({
      companyName: hr.companyName,
      email: hr.email,
      role: interview.role,
      technicalDomain: interview.technicalDomain
    });
  } catch (error) {
    console.error('Error getting candidate company:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new interview
exports.createInterview = async (req, res) => {
  try {
    const { role, technicalDomain, questions, candidateEmails } = req.body;
    const userId = req.user._id;
    
    if (!role || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Role and at least one question are required' });
    }
    
    // Find the HR user - handle both string and ObjectId types
    let hr;
    try {
      hr = await mongoose.model('Hr').findById(userId);
    } catch (idError) {
      // If userId is not a valid ObjectId, try finding by other means
      hr = await mongoose.model('Hr').findOne({ email: req.user.email });
    }
    
    if (!hr) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create a new interview
    const newInterview = {
      _id: new mongoose.Types.ObjectId(),
      role,
      technicalDomain: technicalDomain || 'General',
      questions: questions.map(q => ({
        text: q.question || q.text,
        expectedAnswer: q.expectedAnswer
      })),
      candidates: [],
      createdAt: new Date()
    };
    
    // Add candidates if provided
    if (candidateEmails && Array.isArray(candidateEmails) && candidateEmails.length > 0) {
      newInterview.candidates = candidateEmails.map(email => ({
        email,
        status: 'pending',
        interviewLink: `https://neorecruiter.vercel.app/interview?id=${newInterview._id}&email=${encodeURIComponent(email)}`
      }));
    }
    
    // Add the interview to the HR user
    hr.interviews.push(newInterview);
    hr.interviewCount += 1;
    hr.interviewCountCandidate += newInterview.candidates.length;
    
    // Deduct balance for each candidate (₹50 per candidate)
    const costPerCandidate = 50;
    const totalCost = newInterview.candidates.length * costPerCandidate;
    hr.Balance -= totalCost;
    
    // Save the changes
    await hr.save();
    
    res.status(201).json({
      message: 'Interview created and invitations sent successfully',
      interview: newInterview,
      emailsSent: newInterview.candidates.length,
      remainingBalance: hr.Balance
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to generate fallback scores when AI is unavailable
function generateFallbackScores(answer, expectedAnswer, question) {
  // Simple scoring based on answer length and keyword matching
  const answerLength = answer.length;
  const expectedLength = expectedAnswer ? expectedAnswer.length : 0;
  
  // Calculate a basic relevance score based on length comparison
  let relevanceScore = 3; // Default to average
  if (answerLength >= expectedLength * 0.8) {
    relevanceScore = 4; // Good length
  } else if (answerLength <= expectedLength * 0.3) {
    relevanceScore = 2; // Too short
  }
  
  // Check for keyword matches
  const keywords = expectedAnswer
    ? expectedAnswer.toLowerCase().split(/\s+/).filter(word => word.length > 4)
    : [];
  
  const answerLower = answer.toLowerCase();
  const matchedKeywords = keywords.filter(keyword => answerLower.includes(keyword));
  const keywordMatchRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0;
  
  let contentScore = 3; // Default to average
  if (keywordMatchRatio >= 0.7) {
    contentScore = 4; // Good keyword match
  } else if (keywordMatchRatio <= 0.3) {
    contentScore = 2; // Poor keyword match
  }
  
  // Communication score based on sentence structure
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? answerLength / sentences.length : 0;
  
  let communicationScore = 3; // Default to average
  if (sentences.length >= 3 && avgSentenceLength >= 10 && avgSentenceLength <= 25) {
    communicationScore = 4; // Good sentence structure
  } else if (sentences.length <= 1 || avgSentenceLength > 40) {
    communicationScore = 2; // Poor sentence structure
  }
  
  // Calculate overall score
  const overallScore = Math.round((relevanceScore + contentScore + communicationScore) / 3);
  
  return {
    Relevance: `${relevanceScore} - ${getScoreDescription(relevanceScore, 'Relevance')}`,
    ContentDepth: `${contentScore} - ${getScoreDescription(contentScore, 'ContentDepth')}`,
    CommunicationSkill: `${communicationScore} - ${getScoreDescription(communicationScore, 'CommunicationSkill')}`,
    Sentiment: "3 - Shows positive engagement and professional attitude in response",
    overallscore: `${overallScore} - ${getScoreDescription(overallScore, 'Overall')}`,
    improvement: generateFallbackImprovement(answer, expectedAnswer, question)
  };
}

// Helper function to get score descriptions
function getScoreDescription(score, category) {
  const descriptions = {
    Relevance: {
      1: "Answer does not address the question or is completely off-topic",
      2: "Answer partially addresses the question but misses key points",
      3: "Moderately relevant answer covering main points but could be more focused",
      4: "Answer directly addresses the core question with good focus on key concepts",
      5: "Perfectly relevant answer comprehensively addressing all aspects of the question"
    },
    ContentDepth: {
      1: "Very superficial understanding with significant technical errors",
      2: "Basic level understanding with limited technical details",
      3: "Good understanding demonstrated with reasonable technical content",
      4: "Comprehensive understanding with detailed technical explanations",
      5: "Exceptional depth of knowledge with advanced technical insights"
    },
    CommunicationSkill: {
      1: "Unclear communication with poor structure and difficult to follow",
      2: "Basic communication with some logical gaps and unclear explanations",
      3: "Clear communication with logical flow and understandable explanations",
      4: "Articulate and well-structured response with clear professional communication",
      5: "Exceptional communication with precise, concise, and engaging explanations"
    },
    Overall: {
      1: "Poor performance with significant gaps in knowledge and communication",
      2: "Below average performance with room for improvement in technical depth",
      3: "Average performance meeting basic requirements with solid foundation",
      4: "Above average performance showing strong technical competency and communication",
      5: "Outstanding performance demonstrating exceptional competency across all areas"
    }
  };
  
  return descriptions[category]?.[score] || "Average performance";
}

// Helper function to generate improvement suggestions
function generateFallbackImprovement(answer, expectedAnswer, question) {
  if (!expectedAnswer) {
    return "Consider providing more specific examples to illustrate your points.";
  }
  
  const answerLength = answer.length;
  const expectedLength = expectedAnswer.length;
  
  if (answerLength < expectedLength * 0.5) {
    return "Your answer could be more comprehensive. Consider expanding on key concepts and providing more details.";
  }
  
  const keywords = expectedAnswer.toLowerCase().split(/\s+/).filter(word => word.length > 4);
  const answerLower = answer.toLowerCase();
  const missingKeywords = keywords.filter(keyword => !answerLower.includes(keyword));
  
  if (missingKeywords.length > keywords.length * 0.3) {
    const sampleKeywords = missingKeywords.slice(0, 3).join(', ');
    return `Your answer could be improved by addressing important concepts such as ${sampleKeywords}.`;
  }
  
  return "Consider providing more specific examples to illustrate your points and strengthen your technical explanation.";
}