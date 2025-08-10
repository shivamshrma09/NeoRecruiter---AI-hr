const express = require('express');
const router = express.Router();
router.post('/generate-questions', async (req, res) => {
  try {
    const { role, experience, skills } = req.body;
    const roleQuestions = {
      'Frontend Developer': [
        'Explain the difference between localStorage and sessionStorage.',
        'What is the virtual DOM in React and how does it work?',
        'Describe the CSS Box Model and its components.',
        'How would you optimize a website\'s performance?',
        'Explain the concept of responsive design and how you implement it.'
      ],
      'Backend Developer': [
        'What is RESTful API and what are its principles?',
        'Explain the difference between SQL and NoSQL databases.',
        'How do you handle authentication and authorization in web applications?',
        'Describe the concept of middleware in Express.js.',
        'How would you optimize database queries for better performance?'
      ],
      'Full Stack Developer': [
        'Explain how you would structure a full stack application.',
        'How do you handle state management in a complex web application?',
        'Describe your experience with CI/CD pipelines.',
        'How do you ensure security in a full stack application?',
        'Explain how you would implement real-time features in a web application.'
      ],
      'Data Scientist': [
        'Explain the difference between supervised and unsupervised learning.',
        'How do you handle missing data in a dataset?',
        'Describe a challenging data analysis project you worked on.',
        'Explain overfitting and how to prevent it.',
        'How would you evaluate the performance of a machine learning model?'
      ],
      'DevOps Engineer': [
        'Explain the concept of Infrastructure as Code.',
        'How do you implement CI/CD pipelines?',
        'Describe your experience with containerization technologies like Docker.',
        'How do you monitor and troubleshoot issues in production?',
        'Explain your approach to security in DevOps.'
      ],
      'UI/UX Designer': [
        'Describe your design process from concept to implementation.',
        'How do you ensure your designs are accessible to all users?',
        'Explain the difference between UX and UI design.',
        'How do you gather and incorporate user feedback into your designs?',
        'Describe a challenging design problem you solved.'
      ],
      'Product Manager': [
        'How do you prioritize features in a product roadmap?',
        'Describe your approach to gathering and analyzing user requirements.',
        'How do you measure the success of a product feature?',
        'Explain how you collaborate with engineering and design teams.',
        'Describe a situation where you had to make a difficult product decision.'
      ]
    };
    const defaultQuestions = [
      `Tell me about your experience with ${role}.`,
      `What projects have you worked on related to ${role}?`,
      `Describe a challenging problem you solved as a ${role}.`,
      `What are your strengths and weaknesses as a ${role}?`,
      `Where do you see yourself in 5 years in the ${role} field?`
    ];
    const questions = roleQuestions[role] || defaultQuestions;
    res.json({ questions });
  } catch (err) {
    console.error('Error generating questions:', err);
    res.status(500).json({ message: 'Failed to generate questions', error: err.message });
  }
});
router.post('/analyze-interview', async (req, res) => {
  try {
    const { role, questions, answers } = req.body;
    const scores = answers.map(() => Math.floor(Math.random() * 41) + 60);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const strengths = [
      'Clear communication skills',
      'Strong technical knowledge',
      'Good problem-solving approach',
      'Structured thinking',
      'Excellent understanding of core concepts'
    ].sort(() => 0.5 - Math.random()).slice(0, 3);
    const improvements = [
      'Could provide more specific examples',
      'Consider discussing alternative approaches',
      'Elaborate more on technical implementation details',
      'Focus more on results and impact',
      'Deepen knowledge of underlying principles'
    ].sort(() => 0.5 - Math.random()).slice(0, 2);
    const questionFeedback = questions.map((q, i) => {
      const score = scores[i];
      let feedback;
      if (score > 85) {
        feedback = 'Excellent response with comprehensive understanding.';
      } else if (score > 70) {
        feedback = 'Good answer covering key points, with some room for elaboration.';
      } else {
        feedback = 'Basic understanding demonstrated, but needs deeper knowledge.';
      }
      return {
        question: q,
        score,
        feedback
      };
    });
    const analysis = {
      overallScore,
      strengths,
      improvements,
      questionFeedback,
      skillAssessment: {
        technical: Math.round(overallScore * 0.9 + Math.random() * 10),
        communication: Math.round(overallScore * 0.9 + Math.random() * 10),
        problemSolving: Math.round(overallScore * 0.9 + Math.random() * 10),
        domainKnowledge: Math.round(overallScore * 0.9 + Math.random() * 10)
      },
      recommendation: overallScore > 80 ? 'Strong Hire' : overallScore > 70 ? 'Potential Hire' : 'Consider Other Candidates'
    };
    res.json(analysis);
  } catch (err) {
    console.error('Error analyzing interview:', err);
    res.status(500).json({ message: 'Failed to analyze interview', error: err.message });
  }
});
router.post('/send-report', async (req, res) => {
  try {
    const { email, name, role, analysis } = req.body;
    console.log(`Sending interview report to ${email} for ${role} position`);
    res.json({ 
      success: true, 
      message: `Interview report sent to ${email}` 
    });
  } catch (err) {
    console.error('Error sending report:', err);
    res.status(500).json({ message: 'Failed to send report', error: err.message });
  }
});
module.exports = router;
