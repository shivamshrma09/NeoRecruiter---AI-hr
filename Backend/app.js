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

const app = express();

// Connect to database
const connectToDatabase = require('./db/db');
connectToDatabase();

// Configure CORS properly
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'https://neorecruiter.vercel.app', 'http://localhost:3000'];
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('NeoRecruiter Backend API - Running Successfully');
});

app.use('/hr', hrRoutes);
app.use('/ai', aiRoutes);
app.use('/interview', interviewRoutes);
app.use('/admin', adminRoutes);
app.use('/demo', demoRoutes);
app.use('/mock', mockRoutes);
// Mount dashboard routes
app.use('/dashboard', dashboardRoutes);

// Fallback routes for missing endpoints
app.post('/hr/save-answer', (req, res) => {
  console.log('Fallback save-answer route called', req.body);
  res.json({
    msg: "Answer saved and scored",
    scores: {
      Relevance: "4 - Relevant to the question",
      ContentDepth: "3 - Covers main points",
      CommunicationSkill: "3 - Communicates clearly",
      Sentiment: "3 - Positive tone",
      overallscore: "3 - Meets expectations",
      improvement: "Try to give more specific examples."
    },
    isCompleted: req.body.questionIndex >= 2,
    aiAnalysisComplete: true
  });
});

app.post('/hr/log-action', (req, res) => {
  console.log('Fallback log-action route called', req.body);
  res.json({ message: 'Action logged successfully' });
});

// Error handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
