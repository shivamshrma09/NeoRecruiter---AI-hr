const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'neorecruiter.ai@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  }
})
const sendInterviewInvitation = async (candidateEmail, interviewDetails) => {
  try {
    const interviewLink = interviewDetails.interviewLink || 
      `https://neorecruiter.vercel.app/interview?id=${interviewDetails.interviewId}&email=${encodeURIComponent(candidateEmail)}`;
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@neorecruiter.com',
      to: candidateEmail,
      subject: `Interview Invitation - ${interviewDetails.role} Position`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(to right, #1e40af, #3b82f6); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Interview Invitation</h1>
            <p style="color: white; margin-top: 10px; font-size: 16px;">AI-Powered Assessment</p>
          </div>
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px;">Dear Candidate,</p>
            <p style="font-size: 16px; line-height: 1.5;">You have been invited to participate in an AI-powered interview for the <strong>${interviewDetails.role}</strong> position. This innovative interview process allows you to showcase your skills and experience at your convenience.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Interview Details:</h3>
              <p><strong>Role:</strong> ${interviewDetails.role}</p>
              <p><strong>Technical Domain:</strong> ${interviewDetails.technicalDomain || 'General'}</p>
              <p><strong>Number of Questions:</strong> ${interviewDetails.questions.length}</p>
              <p><strong>Estimated Duration:</strong> ${Math.max(15, interviewDetails.questions.length * 5)} minutes</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;"><strong>Ready to begin? Click the button below:</strong></p>
              <a href="${interviewLink}" 
                 style="background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                Start My Interview
              </a>
            </div>
            <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin: 25px 0;">
              <h4 style="margin-top: 0; color: #1e40af;">Important Information:</h4>
              <ul style="padding-left: 20px; line-height: 1.5;">
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet environment without distractions</li>
                <li>Have your resume and any relevant documents ready</li>
                <li>The interview will be conducted by our AI system</li>
                <li>Your responses will be analyzed for technical accuracy and communication skills</li>
              </ul>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">This interview link is unique to you and will expire in 7 days. If you have any questions or need assistance, please reply to this email.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ${interviewDetails.companyName || 'NeoRecruiter'} Team</p>
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© ${new Date().getFullYear()} NeoRecruiter - AI-Powered Interview Platform</p>
          </div>
        </div>
      `
    }
    try {
      await transporter.sendMail(mailOptions)
      console.log(`Interview invitation sent to ${candidateEmail} for ${interviewDetails.role} position`)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      throw emailError; // Propagate the error to handle it in the calling function
    }
    return { success: true, message: 'Email sent successfully', email: candidateEmail }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, message: 'Failed to send email', error: error.message }
  }
}
const sendInterviewCompletionNotification = async (hrEmail, candidateDetails, interviewDetails) => {
  try {
    const viewResultsLink = `https://neorecruiter.vercel.app/dashboard/results?id=${interviewDetails.interviewId}`;
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@neorecruiter.com',
      to: hrEmail,
      subject: `Interview Completed - ${candidateDetails.name || candidateDetails.email} for ${interviewDetails.role}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(to right, #1e40af, #3b82f6); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Interview Completed</h1>
            <p style="color: white; margin-top: 10px; font-size: 16px;">AI Analysis Ready</p>
          </div>
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">
              <strong>${candidateDetails.name || candidateDetails.email}</strong> has completed the interview for the 
              <strong>${interviewDetails.role}</strong> position.
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Interview Summary:</h3>
              <p><strong>Candidate:</strong> ${candidateDetails.name || candidateDetails.email}</p>
              <p><strong>Position:</strong> ${interviewDetails.role}</p>
              <p><strong>Domain:</strong> ${interviewDetails.technicalDomain || 'General'}</p>
              <p><strong>Questions Answered:</strong> ${candidateDetails.answeredQuestions || interviewDetails.questions.length}</p>
              <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;"><strong>View the detailed AI analysis by clicking below:</strong></p>
              <a href="${viewResultsLink}" 
                 style="background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                View Interview Results
              </a>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">
              Our AI has analyzed the candidate's responses for technical accuracy, communication skills, and overall fit for the role.
              Log in to your dashboard to see the complete analysis and make informed hiring decisions.
            </p>
            <p style="margin-top: 30px;">Best regards,<br>The NeoRecruiter Team</p>
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© ${new Date().getFullYear()} NeoRecruiter - AI-Powered Interview Platform</p>
          </div>
        </div>
      `
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Interview completion notification sent to ${hrEmail} for candidate ${candidateDetails.email}`);
      return { success: true, message: 'Notification sent successfully' };
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      throw emailError;
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send notification', error: error.message };
  }
};
const sendStudentAnalysisEmail = async (studentEmail, analysisData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@neorecruiter.com',
      to: studentEmail,
      subject: `Interview Analysis - ${analysisData.role} Position`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(to right, #1e40af, #3b82f6); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Interview Analysis Report</h1>
            <p style="color: white; margin-top: 10px; font-size: 16px;">AI-Powered Assessment Results</p>
          </div>
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px;">Dear ${analysisData.name},</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for completing the mock interview for the <strong>${analysisData.role}</strong> position. Here's your detailed AI-powered analysis:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h2 style="color: #1e40af; margin-top: 0;">Overall Score</h2>
              <div style="font-size: 48px; font-weight: bold; color: ${analysisData.finalScore >= 80 ? '#10b981' : analysisData.finalScore >= 60 ? '#f59e0b' : '#ef4444'}; margin: 10px 0;">
                ${analysisData.finalScore}%
              </div>
              <p style="color: #6b7280; margin: 0;">
                ${analysisData.finalScore >= 80 ? 'Excellent Performance!' : analysisData.finalScore >= 60 ? 'Good Performance!' : 'Keep Practicing!'}
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">AI Feedback</h3>
              <p style="line-height: 1.6; margin: 0;">${analysisData.overallFeedback}</p>
            </div>
            <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin: 25px 0;">
              <h4 style="margin-top: 0; color: #1e40af;">Questions Covered:</h4>
              <ul style="padding-left: 20px; line-height: 1.5;">
                ${analysisData.questions.map((q, i) => `<li>${q}</li>`).join('')}
              </ul>
            </div>
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="margin-top: 0; color: #059669;">Next Steps:</h4>
              <ul style="padding-left: 20px; line-height: 1.5; color: #047857;">
                <li>Review the feedback and work on suggested improvements</li>
                <li>Practice more interviews to build confidence</li>
                <li>Research the role and company before real interviews</li>
                <li>Prepare specific examples from your experience</li>
              </ul>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">Keep practicing and improving! This AI analysis is designed to help you prepare for real interviews.</p>
            <p style="margin-top: 30px;">Best of luck with your job search!<br>The NeoRecruiter AI Team</p>
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© ${new Date().getFullYear()} NeoRecruiter - AI-Powered Interview Platform</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Student analysis email sent to ${studentEmail}`);
    return { success: true, message: 'Analysis email sent successfully' };
  } catch (error) {
    console.error('Failed to send student analysis email:', error);
    return { success: false, message: 'Failed to send analysis email', error: error.message };
  }
};
const sendInterviewReport = async (reportData) => {
  try {
    const { name, email, role, overallScore, totalQuestions, results } = reportData;
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@neorecruiter.com',
      to: email,
      subject: `Interview Report - ${role} Position | Score: ${overallScore}/10`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 24px;">Interview Report</h1>
            <p style="margin: 10px 0 0 0;">NeoRecruiter AI Assessment</p>
          </div>
          <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for completing the mock interview for the <strong>${role}</strong> position.</p>
            <div style="text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #2563eb; margin: 0;">Your Score</h2>
              <div style="font-size: 36px; font-weight: bold; color: #2563eb; margin: 10px 0;">${overallScore}/10</div>
              <p style="margin: 0; color: #666;">${totalQuestions} Questions Completed</p>
            </div>
            <h3 style="color: #2563eb;">Question Analysis:</h3>
            ${results.map((item, index) => `
              <div style="border-left: 3px solid #2563eb; padding: 15px; margin: 15px 0; background: #f8f9fa;">
                <h4 style="margin: 0 0 10px 0;">Question ${index + 1} - Score: ${item.score}/10</h4>
                <p style="margin: 5px 0; font-weight: 500;">${item.question}</p>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;"><strong>Feedback:</strong> ${item.feedback}</p>
              </div>
            `).join('')}
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #0277bd;">Tips for Improvement:</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Practice more technical questions</li>
                <li>Prepare specific examples from your experience</li>
                <li>Work on communication clarity</li>
              </ul>
            </div>
            <p>Keep practicing and good luck with your interviews!</p>
            <p>Best regards,<br>NeoRecruiter Team</p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} NeoRecruiter - AI Interview Platform</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Interview report sent to ${email} for ${role} position`);
    return { success: true, message: 'Report sent successfully' };
  } catch (error) {
    console.error('Failed to send interview report:', error);
    return { success: false, message: 'Failed to send report', error: error.message };
  }
};
module.exports = {
  sendInterviewInvitation,
  sendInterviewCompletionNotification,
  sendStudentAnalysisEmail,
  sendInterviewReport
}
