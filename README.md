# NeoRecruiter - AI-Powered Interview Platform

## 🚀 Live Demo
**Frontend**: [https://neorecruiter-frontend.vercel.app](https://neorecruiter.vercel.app/)
**Backend**: [https://neorecruiter-backend.onrender.com](https://neorecruiter-ai-hr-1.onrender.com)
**login credentials** - interview123@gmail.com   interv@123

## 📋 Overview

NeoRecruiter is a cutting-edge AI-powered interview platform that revolutionizes the hiring process. It enables HR professionals to conduct intelligent interviews, evaluate candidates automatically, and make data-driven hiring decisions with advanced analytics and anti-cheating detection.

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Intelligent Scoring**: Advanced AI evaluates candidate responses using Google Gemini
- **Real-time Feedback**: Instant analysis and improvement suggestions
- **Multi-criteria Assessment**: Relevance, Content Depth, Communication Skills, Sentiment Analysis
- **Fallback Scoring**: Intelligent backup system when AI is unavailable

### 🛡️ Anti-Cheating Detection
- **Tab Switch Detection**: Monitors when candidates leave the interview page
- **Copy/Paste Monitoring**: Detects suspicious copy-paste activities
- **Screen Recording**: Optional full-screen recording for verification
- **Visual Indicators**: Red alerts for flagged candidates in dashboard

### 📊 Comprehensive Dashboard
- **Real-time Statistics**: Live interview and candidate metrics
- **Candidate Ranking**: Automatic sorting by AI scores (highest first)
- **Detailed Analytics**: In-depth performance insights with AI feedback
- **Balance Management**: ₹50 per candidate pricing system

### 📧 Automated Communication
- **Email Invitations**: Automatic interview invites to candidates
- **Professional Templates**: Branded email communications
- **Simple Links**: Clean interview URLs (localhost:5173/interview)

### 🎯 Interview Experience
- **3-Step Process**: Verification → Permissions → Interview
- **Voice Interaction**: Text-to-speech questions and speech-to-text answers
- **Fullscreen Mode**: Immersive interview environment
- **Company Branding**: Shows company name during interview

## 🏗️ Technology Stack

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB + Mongoose**: Database with intelligent schemas
- **Google Gemini AI**: Advanced answer analysis
- **JWT Authentication**: Secure token-based auth
- **Nodemailer**: Email service integration
- **Multer**: File upload handling

### Frontend
- **React + Vite**: Modern frontend framework
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Context API**: State management
- **Axios**: HTTP client

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- Gmail account for email service
- Google Gemini API key

### Backend Setup
```bash
cd Backend
npm install

# Create .env file
PORT=3000
MONGO_URI=mongodb://localhost:27017/neorecruiter
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key

npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install

# Create .env file
VITE_BASE_URL=http://localhost:3000

npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /hr/register` - HR registration
- `POST /hr/login` - HR login with balance check
- `GET /hr/profile` - Get HR profile
- `POST /hr/logout` - Secure logout

### Interview Management
- `POST /hr/interviews` - Create interview (with balance deduction)
- `GET /hr/interviews` - Get all interviews with real data
- `POST /hr/candidate-register` - Candidate registration with resume
- `POST /hr/save-answer` - Save answer with AI analysis

### File & Recording
- `POST /hr/upload-screen-recording` - Upload screen recordings
- `POST /hr/log-action` - Log user actions for cheating detection

## 🎯 Usage Guide

### For HR Professionals

1. **Registration & Login**
   - Create account with company details
   - Automatic balance management (₹50 per candidate)

2. **Create Interview**
   - 3-step wizard: Basic Details → Questions → Candidates
   - Balance verification before creation
   - Automatic email invitations

3. **Monitor Results**
   - Real-time dashboard with AI scores
   - Candidates sorted by performance
   - Anti-cheating alerts with red indicators

### For Candidates

1. **Receive Email**
   - Simple link: `localhost:5173/interview`
   - No complex parameters

2. **Complete Interview**
   - Email verification
   - Permission requests (screen, microphone)
   - Fullscreen AI interview with company branding

3. **AI Analysis**
   - Real-time answer processing
   - Scores saved to database
   - No feedback shown to candidate

## 🔒 Security Features

### Data Protection
- JWT-based authentication with blacklisting
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration

### Anti-Cheating System
- Real-time tab switch detection
- Copy/paste/cut monitoring
- Screen recording capability
- Comprehensive flag system

## 🚀 Deployment

### Free Deployment Options

#### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

#### Backend (Render)
```bash
# Deploy to Render with environment variables
```

#### Database (MongoDB Atlas)
- Free tier available
- Global cluster deployment

## 📊 Features Implemented

### ✅ Core Functionality
- Complete authentication system
- AI-powered interview analysis
- Real-time scoring with Gemini API
- Balance management system
- Email notification system
- File upload (resume, recordings)

### ✅ Advanced Features
- Anti-cheating detection
- Candidate ranking by scores
- Company branding in interviews
- Fullscreen interview mode
- Voice interaction (TTS/STT)
- Screen recording capability

### ✅ Dashboard Features
- Real-time statistics
- Candidate performance analytics
- Interview management
- Balance tracking
- Detailed candidate profiles

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/neorecruiter
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_BASE_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

### Issues & Bugs
- Create GitHub issue with detailed description
- Include error logs and steps to reproduce

### Contact
- **Developer**: Shivam Sharma
- **Email**: shivamsharma27107@gmail.com
- **GitHub**: [@shivamshrma09](https://github.com/shivamshrma09)

## 🎉 Acknowledgments

- **AI Integration**: Powered by Google Gemini AI
- **UI Framework**: React with Tailwind CSS
- **Backend**: Node.js and Express.js
- **Database**: MongoDB with Mongoose ODM

---

**Made with ❤️ for modern recruitment**
