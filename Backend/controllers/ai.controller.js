const { GoogleGenerativeAI } = require('@google/generative-ai');
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDDy3ynmYdkLRTWGRQmUaVYNJKemSssIKs');
} catch (err) {
  console.error('Failed to initialize Gemini AI:', err);
}
exports.generateQuestions = async (req, res) => {
  try {
    const { role, experience, skills } = req.body;
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    const prompt = `Generate 5 technical interview questions for a ${role} role${
      experience ? ` with ${experience} years of experience` : ''
    }${
      skills ? ` who has skills in ${skills}` : ''
    }. For each question, also provide 2 follow-up questions.
    Format the response as a JSON array with this structure:
    [
      {
        "main": "Main question text",
        "followUps": ["Follow-up question 1", "Follow-up question 2"]
      }
    ]
    Make the questions challenging but appropriate for the role and experience level.`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    try {
      const questions = JSON.parse(text);
      return res.status(200).json({ questions });
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return res.status(500).json({ 
        message: 'Error parsing AI response', 
        error: parseError.message,
        rawResponse: text
      });
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ message: 'Failed to generate questions', error: error.message });
  }
};
exports.analyzeInterview = async (req, res) => {
  try {
    const { 
      role, 
      candidateName, 
      questions, 
      answers, 
      followUpQuestions, 
      followUpAnswers,
      cheatingAttempts,
      tabSwitches
    } = req.body;
    if (!questions || !answers) {
      return res.status(400).json({ message: 'Questions and answers are required' });
    }
    const prompt = `Analyze the following interview for a ${role} position:
    Candidate: ${candidateName || 'Anonymous'}
    ${questions.map((q, i) => `
    Question ${i+1}: ${q}
    Answer: ${answers[i] || 'No answer provided'}
    ${followUpQuestions && followUpQuestions[i] ? followUpQuestions[i].map((fq, fi) => `
    Follow-up ${i+1}.${fi+1}: ${fq}
    Answer: ${followUpAnswers && followUpAnswers[i] ? followUpAnswers[i][fi] || 'No answer provided' : 'No answer provided'}
    `).join('') : ''}
    `).join('')}
    Integrity issues:
    - Copy/paste attempts: ${cheatingAttempts || 0}
    - Tab switches: ${tabSwitches || 0}
    Provide a comprehensive analysis in JSON format with the following structure:
    {
      "overallScore": 85,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2"],
      "questionFeedback": [
        {
          "question": "question text",
          "score": 80,
          "feedback": "detailed feedback"
        }
      ],
      "skillAssessment": {
        "technical": 85,
        "communication": 80,
        "problemSolving": 75,
        "domainKnowledge": 70
      },
      "recommendation": "Strong Hire / Potential Hire / Consider Other Candidates",
      "aiGeneratedInsights": [
        "insight1",
        "insight2",
        "insight3"
      ]
    }`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    try {
      const analysis = JSON.parse(text);
      return res.status(200).json(analysis);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return res.status(500).json({ 
        message: 'Error parsing AI response', 
        error: parseError.message,
        rawResponse: text
      });
    }
  } catch (error) {
    console.error('Error analyzing interview:', error);
    return res.status(500).json({ message: 'Failed to analyze interview', error: error.message });
  }
};
