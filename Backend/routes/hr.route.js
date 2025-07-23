const express = require('express');
const { body } = require('express-validator');
const multer = require("multer");
const authHrMiddleware = require('../middlewares/hr.middleware');
const hrController = require('../controllers/hr.controller');
const interviewController = require('../controllers/interview.controller');
const Hr = require('../models/hr.model');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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

// ✅ GET/POST: Get candidate company information
router.post('/get-candidate-company', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find HR that has this candidate
    const hr = await Hr.findOne({ 'interviews.candidates.email': email });
    
    if (!hr) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Return company info
    res.json({
      companyName: hr.companyName,
      companyLogo: hr.profilePicture || null,
      socialLinks: hr.socialLinks || {}
    });
  } catch (err) {
    console.error('Error getting candidate company:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// For backward compatibility
router.get('/get-candidate-company', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find HR that has this candidate
    const hr = await Hr.findOne({ 'interviews.candidates.email': email });
    
    if (!hr) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Return company info
    res.json({
      companyName: hr.companyName,
      companyLogo: hr.profilePicture || null,
      socialLinks: hr.socialLinks || {}
    });
  } catch (err) {
    console.error('Error getting candidate company:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ POST: Register candidate (missing endpoint)
router.post('/candidate-register', upload.single('resume'), async (req, res) => {
  try {
    const { interviewId, email, name, phone } = req.body;
    const resume = req.file ? req.file.path : null;
    
    if (!interviewId || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Interview ID and email are required' 
      });
    }
    
    // Find the HR that has this interview
    const hr = await Hr.findOne({ 'interviews._id': interviewId });
    if (!hr) {
      return res.status(404).json({ 
        success: false,
        message: 'Interview not found' 
      });
    }
    
    // Find the interview
    const interviewIndex = hr.interviews.findIndex(i => i._id.toString() === interviewId);
    if (interviewIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Interview not found' 
      });
    }
    
    const interview = hr.interviews[interviewIndex];
    
    // Check if candidate already exists
    const candidateIndex = interview.candidates.findIndex(c => c.email === email);
    if (candidateIndex === -1) {
      // Add new candidate if not found
      interview.candidates.push({
        email,
        name: name || '',
        phone: phone || '',
        resume: resume || '',
        status: 'pending',
        interviewLink: `https://neorecruiter.vercel.app/interview?id=${interview._id}&email=${encodeURIComponent(email)}`
      });
    } else {
      // Update existing candidate
      hr.interviews[interviewIndex].candidates[candidateIndex].name = name || hr.interviews[interviewIndex].candidates[candidateIndex].name || '';
      hr.interviews[interviewIndex].candidates[candidateIndex].phone = phone || hr.interviews[interviewIndex].candidates[candidateIndex].phone || '';
      if (resume) {
        hr.interviews[interviewIndex].candidates[candidateIndex].resume = resume;
      }
    }
    
    // Save the changes
    hr.markModified('interviews');
    await hr.save();
    
    // Return success
    res.json({ 
      success: true,
      message: 'Candidate registered successfully',
      questions: interview.questions.map(q => ({ text: q.text }))
    });
  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
