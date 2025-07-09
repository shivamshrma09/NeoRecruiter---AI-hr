const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./db/db');
const hrRoutes = require('./routes/hr.route');

const app = express();

connectToDatabase();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://neo-recruiter-ai-hr.vercel.app',
      'https://neorecruiter.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
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
  res.send('NeoRecruiter Backend API - Running Successfully - Updated');
});

app.use('/hr', hrRoutes);

module.exports = app;