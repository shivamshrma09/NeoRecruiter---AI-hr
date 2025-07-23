// Simple interview controller with hardcoded responses

exports.getInterviewForCandidate = (req, res) => {
  res.json({
    interview: {
      role: "Frontend Developer",
      technicalDomain: "React",
      questions: [
        { text: "What is React?" },
        { text: "Explain hooks in React" }
      ]
    },
    candidate: {
      email: req.query.email,
      answers: [],
      currentQuestion: 0
    }
  });
};

exports.submitCandidateAnswer = (req, res) => {
  res.json({ 
    message: 'Answer submitted successfully', 
    score: 85,
    analysis: {
      Relevance: "4 - Good",
      ContentDepth: "4 - Good",
      CommunicationSkill: "3 - Average",
      overallscore: "4 - Good"
    }
  });
};

exports.registerCandidate = (req, res) => {
  res.json({ 
    message: 'Candidate registered successfully',
    questions: [
      { text: "What is React?" },
      { text: "Explain hooks in React" }
    ]
  });
};

exports.uploadScreenRecording = (req, res) => {
  res.json({ message: 'Screen recording saved successfully' });
};

exports.getCandidateCompany = (req, res) => {
  const { email } = req.body;
  res.json({
    companyName: "Demo Company",
    email: "company@example.com",
    role: "Frontend Developer"
  });
};

exports.createInterview = (req, res) => {
  res.status(201).json({
    message: 'Interview created successfully',
    interview: {
      _id: "new-interview-" + Date.now(),
      role: req.body.role || "New Role",
      technicalDomain: req.body.technicalDomain || "General",
      questions: req.body.questions || [],
      candidates: [],
      createdAt: new Date()
    }
  });
};