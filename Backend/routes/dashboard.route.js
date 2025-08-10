const express = require('express');
const router = express.Router();
const authHrMiddleware = require('../middlewares/hr.middleware');
router.get('/data', (req, res) => {
  res.json({
    totalInterviews: 2,
    totalCandidates: 3,
    completedInterviews: 2,
    pendingInterviews: 0,
    averageScore: 78,
    balance: 1000,
    recentActivity: [
      {
        type: 'interview_created',
        date: new Date(),
        details: 'Frontend Developer interview created'
      },
      {
        type: 'candidate_completed',
        date: new Date(),
        details: 'John Doe completed Frontend Developer interview'
      }
    ],
    analytics: {
      interviewsByMonth: [5, 7, 10, 12, 8, 15, 12, 9, 11, 14, 10, 12],
      candidatePerformance: {
        excellent: 1,
        good: 1,
        average: 1,
        poor: 0
      },
      topSkills: [
        { name: 'React', score: 85 },
        { name: 'Node.js', score: 78 },
        { name: 'JavaScript', score: 92 },
        { name: 'TypeScript', score: 76 },
        { name: 'MongoDB', score: 70 }
      ]
    }
  });
});
router.get('/analytics', (req, res) => {
  res.json({
    interviewStats: {
      total: 2,
      completed: 2,
      pending: 0,
      averageScore: "78.5"
    },
    candidateStats: {
      total: 3,
      interviewed: 2,
      hired: 1,
      rejected: 1,
      inProgress: 1
    },
    skillsAnalysis: [
      { skill: 'JavaScript', count: 2, averageScore: 82 },
      { skill: 'React', count: 2, averageScore: 79 },
      { skill: 'Node.js', count: 1, averageScore: 76 },
      { skill: 'TypeScript', count: 1, averageScore: 81 },
      { skill: 'MongoDB', count: 1, averageScore: 74 }
    ],
    monthlyTrends: {
      interviews: [12, 15, 18, 22, 19, 24, 28, 25, 30, 32, 35, 45],
      candidates: [25, 30, 35, 40, 38, 45, 50, 48, 55, 60, 65, 70],
      averageScores: [72, 74, 75, 76, 78, 77, 79, 80, 78, 81, 82, 83]
    }
  });
});
module.exports = router;
