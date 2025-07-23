const express = require('express');
const multer = require('multer');
const interviewController = require('../controllers/interview.controller');
const authHrMiddleware = require('../middlewares/hr.middleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 🔒 HR: Create interview (authenticated)
router.post('/create', authHrMiddleware.authHr, interviewController.createInterview);

// 👨‍💻 Candidate: Register with resume
router.post('/candidate/register', upload.single('resume'), interviewController.registerCandidate);

// 👨‍💻 Candidate: Submit answer
router.post('/candidate/submit-answer', interviewController.submitCandidateAnswer);

// 👨‍💻 Candidate: Upload screen recording
router.post('/candidate/upload-recording', upload.single('screenRecording'), interviewController.uploadScreenRecording);

// ⬇️ Candidate info (company, interview)
router.post('/candidate/company-info', interviewController.getCandidateCompany);
router.get('/candidate', interviewController.getInterviewForCandidate);
router.get('/candidate/interview', (req, res) => {
  // Dummy data for frontend dev
  const email = req.query.email || 'demo@example.com';
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
      email,
      answers: [],
      currentQuestion: 0
    }
  });
});

// ✔️ Fallback / test candidate-related routes
router.post('/save-answer', (req, res) => {
  const { email, answer, questionIndex } = req.body;
  const scores = {
    Relevance: "4 - Relevant to the question",
    ContentDepth: "3 - Covers main points",
    CommunicationSkill: "3 - Communicates clearly",
    Sentiment: "3 - Positive tone",
    overallscore: "3 - Meets expectations",
    improvement: "Try to give more specific examples."
  };

  res.json({
    msg: "Answer saved and scored",
    scores,
    isCompleted: questionIndex >= 1,
    aiAnalysisComplete: true,
  });
});

router.post('/log-action', (req, res) => {
  res.json({ message: 'Action logged successfully' });
});

module.exports = router;
