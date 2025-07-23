const express = require('express');
const router = express.Router();
const { generateQuestions, analyzeInterview } = require('../controllers/ai.controller');

router.post('/generate-questions', generateQuestions);
router.post('/analyze-interview', analyzeInterview);

module.exports = router;