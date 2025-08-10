const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const hrModel = require('../models/hr.model');
router.post('/token', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const hr = await hrModel.findOne({ 'interviews.candidates.email': email });
    if (!hr) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const demoToken = `demo-token-${Date.now()}`;
    let candidateFound = false;
    for (const interview of hr.interviews) {
      for (const candidate of interview.candidates) {
        if (candidate.email === email) {
          candidate.accessToken = demoToken;
          candidateFound = true;
          break;
        }
      }
      if (candidateFound) break;
    }
    if (!candidateFound) {
      return res.status(404).json({ message: 'Candidate not found in any interview' });
    }
    hr.markModified('interviews');
    await hr.save();
    res.json({ 
      success: true, 
      token: demoToken,
      message: 'Demo token generated successfully'
    });
  } catch (err) {
    console.error('Demo token error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.post('/validate', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({ message: 'Email and token are required' });
    }
    const hr = await hrModel.findOne({ 'interviews.candidates.email': email });
    if (!hr) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    let isValid = false;
    let interviewData = null;
    for (const interview of hr.interviews) {
      for (const candidate of interview.candidates) {
        if (candidate.email === email && candidate.accessToken === token) {
          isValid = true;
          interviewData = {
            interviewId: interview._id,
            role: interview.role,
            technicalDomain: interview.technicalDomain,
            questions: interview.questions.map(q => ({ text: q.text }))
          };
          break;
        }
      }
      if (isValid) break;
    }
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ 
      success: true, 
      message: 'Token is valid',
      interviewData
    });
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;
