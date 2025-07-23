const express = require('express');
const router = express.Router();
const { demoHrUser } = require('../utils/demoData');

// GET: Mock data for demo and fallback
router.get('/data', (req, res) => {
  console.log('Serving mock data as fallback');
  
  // Calculate statistics from demo data
  const totalInterviews = demoHrUser.interviews?.length || 0;
  const totalCandidates = demoHrUser.interviews?.reduce((sum, i) => sum + (i.candidates?.length || 0), 0) || 0;
  const completedInterviews = demoHrUser.interviews?.filter(i => i.candidates?.some(c => c.status === "completed")).length || 0;
  
  res.json({
    interviews: demoHrUser.interviews || [],
    totalInterviews,
    totalCandidates,
    completedInterviews,
    balance: demoHrUser.Balance || 0
  });
});

// Add a health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock API is running' });
});

module.exports = router;