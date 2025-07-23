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
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
hrSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
hrSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("Hr", hrSchema);
