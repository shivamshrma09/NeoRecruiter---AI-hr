const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import your existing routes and controllers
const hrRoutes = require('./routes/hr.route');

const app = express();

// Database connection
const connectToDatabase = async () => {
  try {
    const mongoUri = functions.config().app?.mongo_uri || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectToDatabase();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('NeoRecruiter Backend API - Running on Firebase Functions');
});

app.use('/hr', hrRoutes);

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);