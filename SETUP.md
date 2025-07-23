# NeoRecruiter - Setup Guide

This guide will help you set up and run the NeoRecruiter AI-powered interview platform.

## Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- Gmail account for email service
- Google Gemini API key

## Installation

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/neorecruiter
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   GEMINI_API_KEY=your-gemini-api-key
   NODE_ENV=development
   ```

   Note: For the EMAIL_PASS, you need to generate an app password from your Google account.

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_BASE_URL=http://localhost:4000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage Guide

### HR User Flow

1. **Register/Login**: Create an account or log in with your credentials.

2. **Create Interview**:
   - Click "Create New Interview" on the dashboard.
   - Fill in the role details, technical domain, and questions.
   - Add candidate emails to send invitations.

3. **Monitor Results**:
   - View the dashboard for an overview of all interviews.
   - Check the "Results" tab to see candidate responses and AI analysis.
   - Review detailed candidate performance in the "Analytics" section.

### Candidate User Flow

1. **Receive Invitation**: Candidates receive an email with a link to the interview.

2. **Start Interview**:
   - Click the link in the email.
   - Fill in personal details and upload resume.
   - Grant necessary permissions for screen recording.

3. **Complete Interview**:
   - Answer each question thoughtfully.
   - Submit responses for AI analysis.
   - Receive confirmation upon completion.

## Key Features

- **AI-Powered Analysis**: Automatic evaluation of candidate responses.
- **Anti-Cheating Detection**: Monitors tab switching and copy/paste activities.
- **Comprehensive Dashboard**: Real-time statistics and candidate rankings.
- **Email Notifications**: Automatic emails for invitations and completions.
- **Reminder System**: Scheduled reminders for pending interviews.

## Troubleshooting

- **Email Issues**: Ensure your Gmail account has "Less secure app access" enabled or use an app password.
- **MongoDB Connection**: Verify your MongoDB instance is running and accessible.
- **API Key**: Make sure your Gemini API key is valid and has sufficient quota.

## Support

For any issues or questions, please contact:
- Email: support@neorecruiter.com
- GitHub: [NeoRecruiter Repository](https://github.com/neorecruiter)