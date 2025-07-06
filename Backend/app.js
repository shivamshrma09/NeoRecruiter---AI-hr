const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./db/db');
const hrRoutes = require('./routes/hr.route');

const app = express();

connectToDatabase();

// CORS with multiple origins and credentials support
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://neo-recruiter-ai-hr.vercel.app',
    'https://neorecruiter-ai-hr-1.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/hr', hrRoutes);

module.exports = app;
