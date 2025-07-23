const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Candidate routes (no authentication required)
router.get('/candidate', (req, res) => {
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
});

router.post('/candidate/submit-answer', (req, res) => {
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
});

router.post('/candidate/register', upload.single('resume'), (req, res) => {
  res.json({ 
    message: 'Candidate registered successfully',
    questions: [
      { text: "What is React?" },
      { text: "Explain hooks in React" }
    ]
  });
});

router.post('/candidate/upload-recording', upload.single('screenRecording'), (req, res) => {
  res.json({ message: 'Screen recording saved successfully' });
});

router.post('/candidate/company-info', (req, res) => {
  const { email } = req.body;
  res.json({
    companyName: "Demo Company",
    email: "company@example.com",
    role: "Frontend Developer"
  });
});

module.exports = router;