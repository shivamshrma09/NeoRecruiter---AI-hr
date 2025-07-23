const express = require('express');
const router = express.Router();
const multer = require('multer');
const interviewController = require('../controllers/interview.controller');
const authHrMiddleware = require('../middlewares/hr.middleware');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// HR routes (authenticated)
router.post('/create', authHrMiddleware.authHr, interviewController.createInterview);

// Candidate routes (no authentication required)
router.get('/candidate', interviewController.getInterviewForCandidate);
router.post('/candidate/submit-answer', interviewController.submitCandidateAnswer);
router.post('/candidate/register', upload.single('resume'), interviewController.registerCandidate);
router.post('/candidate/upload-recording', upload.single('screenRecording'), interviewController.uploadScreenRecording);
router.post('/candidate/company-info', interviewController.getCandidateCompany);

module.exports = router;