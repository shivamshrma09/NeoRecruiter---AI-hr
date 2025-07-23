const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendInterviewInvitation = async (candidateEmail, interviewDetails) => {
  try {
    // Create personalized interview link with interview ID and candidate email
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

module.exports = {
  sendInterviewInvitation,
  sendInterviewCompletionNotification
}