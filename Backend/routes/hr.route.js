const express = require('express');
const { body } = require('express-validator');
const multer = require("multer");
const authHrMiddleware = require('../middlewares/hr.middleware');
const hrController = require('../controllers/hr.controller');
const interviewController = require('../controllers/interview.controller');
const Hr = require('../models/hr.model');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Register HR
router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('companyName').isLength({ min: 3 }).withMessage('Company Name should be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.RegisterHr);

// Login HR
router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.loginHr);

// Authenticated HR routes
router.get('/profile', authHrMiddleware.authHr, hrController.getProfile);
router.post('/logout', authHrMiddleware.authHr, hrController.logoutHr);

// POST: Create interview (must match what frontend calls)
router.post('/interviews', authHrMiddleware.authHr, interviewController.createInterview);

// GET: All interviews for a logged-in HR
router.get('/interviews', authHrMiddleware.authHr, async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;

    let hrUser = await Hr.findById(userId).catch(() => Hr.findOne({ email }));
    if (!hrUser) return res.status(404).json({ message: 'User not found' });

    const interviews = hrUser.interviews || [];
    const totalInterviews = interviews.length;
    const totalCandidates = interviews.reduce((sum, i) => sum + (i.candidates?.length || 0), 0);
    const completedInterviews = interviews.filter(i => i.candidates?.some(c => c.status === "completed")).length;

    return res.json({
      interviews,
      totalInterviews,
      totalCandidates,
      completedInterviews,
      balance: hrUser.Balance
    });
  } catch (err) {
    console.error("Failed to fetch interviews:", err);
    res.status(500).json({ message: "Error fetching interviews", error: err.message });
  }
});

// GET: Mock/Fallback data for demo
router.get('/interviews-fallback', (req, res) => {
  res.json({
    interviews: [
      {
        _id: "interview1",
        role: "Frontend Developer",
        technicalDomain: "React",
        questions: [
          { text: "What is React?", expectedAnswer: "React is a UI library developed by Facebook" }
        ],
        candidates: [
          {
            email: "candidate@example.com",
            name: "John Doe",
            status: "completed",
            scores: [{ overallscore: "4 - Good" }]
          }
        ],
        createdAt: new Date()
      }
    ],
    totalInterviews: 1,
    totalCandidates: 1,
    completedInterviews: 1,
    balance: 1000
  });
});

module.exports = router;
