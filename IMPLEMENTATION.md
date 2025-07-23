# NeoRecruiter - Implementation Details

## Overview

This document outlines the implementation details of the NeoRecruiter AI-powered interview platform. The platform enables HR professionals to create interviews, send invitations to candidates, and analyze responses using AI.

## Backend Components

### Controllers

1. **Interview Controller** (`interview.controller.js`)
   - Handles interview creation, candidate registration, answer submission, and screen recording uploads
   - Integrates with notification service to alert HR when interviews are completed

2. **HR Controller** (`hr.controller.js`)
   - Manages HR user authentication, profile management, and dashboard data

3. **AI Controller** (`ai.controller.js`)
   - Interfaces with Google Gemini AI for question generation and response analysis

### Services

1. **Email Service** (`email.service.js`)
   - Sends interview invitations to candidates
   - Sends completion notifications to HR
   - Uses customized HTML templates for professional communication

2. **Notification Service** (`notification.service.js`)
   - Centralizes notification logic
   - Handles interview completion notifications
   - Manages reminder emails for pending interviews

3. **HR Service** (`hr.service.js`)
   - Handles HR user creation and management

### Models

1. **HR Model** (`hr.model.js`)
   - Stores HR user information
   - Contains nested schemas for interviews, candidates, questions, and scores
   - Includes authentication methods

2. **BlackList Token Model** (`black.list.token.model.js`)
   - Manages token invalidation for logout functionality

### Routes

1. **Interview Routes** (`interview.route.js`)
   - Endpoints for interview creation and candidate interactions
   - Handles file uploads for resumes and screen recordings

2. **HR Routes** (`hr.route.js`)
   - Authentication endpoints
   - HR profile management

3. **Dashboard Routes** (`dashboard.route.js`)
   - Provides dashboard data and analytics

4. **Admin Routes** (`admin.route.js`)
   - Administrative functions like manually triggering reminders

### Scheduled Tasks

1. **Reminder Task** (`reminderTask.js`)
   - Sends automated reminders to candidates who haven't completed interviews
   - Configured to run daily using node-cron

## Frontend Components

1. **Interview Component** (`Interview.jsx`)
   - Main interface for candidates to take interviews
   - Handles screen recording, answer submission, and anti-cheating detection

2. **InterviewLink Component** (`InterviewLink.jsx`)
   - Landing page for candidates clicking email links
   - Displays interview details and instructions

3. **InterviewResults Component** (`InterviewResults.jsx`)
   - Detailed view of candidate responses and AI analysis for HR
   - Shows individual scores and improvement suggestions

4. **Dashboard Component** (`HomeDashboard.jsx`)
   - Main HR interface with overview statistics
   - Access to interview creation and results

5. **API Utilities** (`interviewApi.js`)
   - Centralizes API calls for interview-related functions
   - Handles error management and response formatting

## Key Features Implemented

1. **Interview Creation and Management**
   - HR can create interviews with custom questions
   - System tracks interview status and completion rates

2. **Email Notifications**
   - Candidates receive professional invitation emails
   - HR receives notifications when interviews are completed
   - Automated reminders for pending interviews

3. **Candidate Experience**
   - User-friendly interface for taking interviews
   - Clear instructions and progress tracking
   - Resume upload and screen recording capabilities

4. **AI Analysis**
   - Integration with Google Gemini for response evaluation
   - Detailed scoring across multiple dimensions
   - Improvement suggestions for candidates

5. **Anti-Cheating Measures**
   - Tab switch detection
   - Copy/paste monitoring
   - Screen recording for verification

6. **Dashboard and Analytics**
   - Real-time statistics on interview completion
   - Candidate ranking by AI scores
   - Detailed performance insights

## Security Considerations

1. **Authentication**
   - JWT-based authentication for HR users
   - Token blacklisting for secure logout

2. **Data Protection**
   - Secure storage of candidate information
   - Password hashing with bcrypt

3. **API Security**
   - Input validation using express-validator
   - Protected routes with middleware authentication

## Future Enhancements

1. **Advanced Analytics**
   - Machine learning models for candidate success prediction
   - Comparative analysis across multiple interviews

2. **Integration Capabilities**
   - API endpoints for ATS integration
   - Webhook support for external notifications

3. **Enhanced Candidate Experience**
   - Mobile-optimized interface
   - Offline mode with synchronization
   - Multi-language support

4. **Advanced Anti-Cheating**
   - AI-based plagiarism detection
   - Behavioral analysis during interviews