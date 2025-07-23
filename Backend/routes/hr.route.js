const express = require('express');
const { body } = require('express-validator');
const authHrMiddleware = require('../middlewares/hr.middleware');
const hrController = require('../controllers/hr.controller');
const interviewController = require('../controllers/interview.controller');
const Hr = require('../models/hr.model');

const router = express.Router();

// ✅ Register HR
router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('companyName').isLength({ min: 3 }).withMessage('Company Name should be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.RegisterHr);

// ✅ Login HR
router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], hrController.loginHr);

// ✅ Get HR Profile
router.get('/profile', authHrMiddleware.authHr, hrController.getProfile);

// ✅ Logout HR
router.post('/logout', authHrMiddleware.authHr, hrController.logoutHr);

// ✅ POST /hr/interviews — fix for 404
router.post('/interviews', authHrMiddleware.authHr, interviewController.createInterview);

// ✅ GET /hr/interviews — returns interviews for authenticated HR
router.get('/interviews', authHrMiddleware.authHr, async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;

    let hrUser = await Hr.findById(userId).catch(() => Hr.findOne({ email }));
    if (!hrUser) {
      return res.status(404).json({ message: 'HR user not found' });
    }

    const interviews = hrUser.interviews || [];
    const totalInterviews = interviews.length;
    const totalCandidates = interviews.reduce((sum, i) => sum + (i.candidates?.length || 0), 0);
    const completedInterviews = interviews.filter(i =>
      i.candidates?.some(c => c.status === "completed")
    ).length;

    res.json({
      interviews,
      totalInterviews,
      totalCandidates,
      completedInterviews,
      balance: hrUser.Balance || 0
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Add missing /mock/data fallback route
router.get('/mock/data', (req, res) => {
  res.json({
    message: '✅ Mock data available',
    interviews: [
      {
        _id: 'mock123',
        role: 'Frontend Developer',
        domain: 'React',
        candidates: [{ name: 'Test Candidate', score: 85 }],
      },
    ],
  });
});

// ✅ Optional fallback route
router.get('/interviews-fallback', (req, res) => {
  res.json({
    message: 'Fallback interviews',
    interviews: [],
    totalInterviews: 0,
    totalCandidates: 0,
    completedInterviews: 0,
    balance: 1000
  });
});

module.exports = router;
