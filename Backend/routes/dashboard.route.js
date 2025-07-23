const express = require('express');
const router = express.Router();
const authHrMiddleware = require('../middlewares/hr.middleware');

// Dashboard data endpoint
router.get('/data', authHrMiddleware.authHr, (req, res) => {
  try {
    // Mock dashboard data
    const dashboardData = {
      totalInterviews: 12,
      totalCandidates: 45,
      completedInterviews: 32,
      pendingInterviews: 13,
      balance: 750,
      recentActivity: [
        { type: 'interview_created', date: new Date(), details: 'Frontend Developer interview created' },
        { type: 'candidate_completed', date: new Date(Date.now() - 86400000), details: 'John Doe completed interview' },
        { type: 'candidate_invited', date: new Date(Date.now() - 172800000), details: '3 candidates invited to Backend Developer interview' }
      ],
      analytics: {
        interviewsByMonth: [5, 7, 10, 12, 8, 15, 12, 9, 11, 14, 10, 12],
        candidatePerformance: {
          excellent: 15,
          good: 20,
          average: 7,
          poor: 3
        },
        topSkills: [
          { name: 'React', score: 85 },
          { name: 'Node.js', score: 78 },
          { name: 'JavaScript', score: 92 },
          { name: 'TypeScript', score: 76 },
          { name: 'MongoDB', score: 70 }
        ]
      }
    };
    
    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Analytics data endpoint
router.get('/analytics', authHrMiddleware.authHr, (req, res) => {
  try {
    // Mock analytics data
    const analyticsData = {
      interviewStats: {
        total: 45,
        completed: 32,
        pending: 13,
        averageScore: 78.5
      },
      candidateStats: {
        total: 120,
        interviewed: 95,
        hired: 18,
        rejected: 42,
        inProgress: 35
      },
      skillsAnalysis: [
        { skill: 'JavaScript', count: 42, averageScore: 82 },
        { skill: 'React', count: 38, averageScore: 79 },
        { skill: 'Node.js', count: 35, averageScore: 76 },
        { skill: 'TypeScript', count: 28, averageScore: 81 },
        { skill: 'MongoDB', count: 25, averageScore: 74 }
      ],
      monthlyTrends: {
        interviews: [12, 15, 18, 22, 19, 24, 28, 25, 30, 32, 35, 45],
        candidates: [25, 30, 35, 40, 38, 45, 50, 48, 55, 60, 65, 70],
        averageScores: [72, 74, 75, 76, 78, 77, 79, 80, 78, 81, 82, 83]
      }
    };
    
    res.json(analyticsData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;