const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const hrRoutes = require('./routes/hr.route');
const aiRoutes = require('./routes/ai.route');
const dashboardRoutes = require('./routes/dashboard.route');
const interviewRoutes = require('./routes/interview.route');
const adminRoutes = require('./routes/admin.route');
const demoRoutes = require('./routes/demo.route');
const mockRoutes = require('./routes/mock.route');
const { sendInterviewReport } = require('./services/email.service');
const app = express();
const connectToDatabase = require('./db/db');
connectToDatabase();
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173', 
      'https://neorecruiter.vercel.app',
      'http://localhost:3000',
      'http://localhost:4000',
      'https://neo-recruiter-ai-hr.vercel.app'
    ];
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('NeoRecruiter Backend API - Running Successfully');
});
app.post('/api/send-interview-report', async (req, res) => {
  try {
    const { name, email, role, overallScore, totalQuestions, results } = req.body;
    if (!name || !email || !role || !results) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, role, results' 
      });
    }
    const emailResult = await sendInterviewReport({
      name,
      email,
      role,
      overallScore,
      totalQuestions,
      results
    });
    if (emailResult.success) {
      res.json({ success: true, message: 'Interview report sent successfully' });
    } else {
      res.status(500).json({ success: false, message: emailResult.message });
    }
  } catch (error) {
    console.error('Error sending interview report:', error);
    res.status(500).json({ success: false, message: 'Failed to send report' });
  }
});
app.post('/api/test-email', async (req, res) => {
  try {
    const { sendInterviewInvitation } = require('./services/email.service');
    const result = await sendInterviewInvitation('shivamsharma27107@gmail.com', {
      role: 'Test Developer',
      technicalDomain: 'Testing',
      questions: [{ text: 'Test question?' }],
      interviewId: 'test123',
      interviewLink: 'https://neorecruiter.vercel.app/interview?id=test123&email=test@example.com',
      companyName: 'Test Company'
    });
    res.json({ success: true, result });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.use('/hr', hrRoutes);
app.use('/ai', aiRoutes);
app.use('/interview', interviewRoutes);
app.use('/admin', adminRoutes);
app.use('/demo', demoRoutes);
app.use('/mock', mockRoutes);
app.use('/dashboard', dashboardRoutes);
app.use((req, res, next) => {
  console.log('404 for:', req.method, req.path);
  res.status(404).json({ message: 'Endpoint not found', path: req.path });
});
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});
module.exports = app;
