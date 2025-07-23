const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const hrRoutes = require('./routes/hr.route');
const aiRoutes = require('./routes/ai.route');
const dashboardRoutes = require('./routes/dashboard.route');

const app = express();

// Skip database connection for demo
// const connectToDatabase = require('./db/db');
// connectToDatabase();

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  credentials: false, // Set to false to avoid preflight issues
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('NeoRecruiter Backend API - Running Successfully');
});

app.use('/hr', hrRoutes);
app.use('/ai', aiRoutes);
app.use('/dashboard', dashboardRoutes);

module.exports = app;