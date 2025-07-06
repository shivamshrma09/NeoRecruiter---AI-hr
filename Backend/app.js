const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./db/db');
const hrRoutes = require('./routes/hr.route');

const app = express();

connectToDatabase();

// CORS with specific origin and credentials support
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/hr', hrRoutes);

module.exports = app;
