const express = require('express');
const router = express.Router();
const multer = require('multer');
const { demoHrUser } = require('../utils/demoData');
const { sendInterviewReport } = require('../services/email.service');
const upload = multer({ dest: 'uploads/' });
router.get('/data', (req, res) => {
  console.log('Serving mock data as fallback');
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
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock API is running' });
});
router.post('/candidate-register', upload.single('resume'), (req, res) => {
  console.log('Mock candidate registration called');
  res.json({
    success: true,
    message: 'Candidate registered successfully (mock)',
    questions: [
      { text: "What is your experience with React?" },
      { text: "Explain the concept of state management in frontend applications." }
    ]
  });
});
router.post('/send-report', async (req, res) => {
  try {
    const reportData = req.body;
    console.log('Sending interview report to:', reportData.email);
    const result = await sendInterviewReport(reportData);
    if (result.success) {
      res.json({ success: true, message: 'Report sent successfully' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error sending report:', error);
    res.status(500).json({ success: false, message: 'Failed to send report' });
  }
});
router.post('*', (req, res) => {
  console.log('Generic mock POST handler called for:', req.path);
  res.json({
    success: true,
    message: 'Mock endpoint response',
    path: req.path
  });
});
module.exports = router;
