const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const scoreSchema = new mongoose.Schema({
  Relevance: String,
  ContentDepth: String,
  CommunicationSkill: String,
  Sentiment: String,
  skillcorrect: String,
  overallscore: String,
  aiFeedback: String,      
  improvement: String     
});
const questionSchema = new mongoose.Schema({
  text: String,
  expectedAnswer: String,
});
const candidateSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  resume: String,
  screenRecording: String,
  interviewLink: String,
  answers: [String],
  scores: [scoreSchema],
  status: { type: String, default: "pending" },
  cheatingDetected: { type: Boolean, default: false },
  cheatingFlags: [String],
  completedAt: Date,
  accessToken: String,
  lastReminderSent: Date
});
const interviewSchema = new mongoose.Schema({
  role: { type: String, required: true },
  technicalDomain: { type: String },
  questions: [questionSchema],
  candidates: [candidateSchema],
  createdAt: { type: Date, default: Date.now },
});
const hrSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Company Name is required"],
    minlength: [3, "Company Name should be at least 3 characters"],
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  profilePicture: { type: String, default: "default-profile.png" },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
  },
  interviews: [interviewSchema], 
  interviewCount: { type: Number, default: 0 },
  interviewCountCandidate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  Balance: { type: Number, default: 1000 },
});
hrSchema.methods.generateAuthToken = function () {
  const jwtSecret = process.env.JWT_SECRET;
  console.log('JWT_SECRET exists:', !!jwtSecret);
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not found in environment variables');
  }
  const token = jwt.sign({ _id: this._id, email: this.email }, jwtSecret, {
    expiresIn: "1d",
  });
  console.log('Token generated successfully');
  return token;
};
hrSchema.methods.comparePassword = async function (password) {
  console.log('Comparing password for user:', this.email);
  console.log('Stored password hash exists:', !!this.password);
  const isValid = await bcrypt.compare(password, this.password);
  console.log('Password comparison result:', isValid);
  return isValid;
};
hrSchema.statics.hashPassword = async function (password) {
  console.log('Hashing password...');
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password hashed successfully');
  return hashedPassword;
};
module.exports = mongoose.model("Hr", hrSchema);
