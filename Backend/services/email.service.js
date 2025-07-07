const nodemailer = require('nodemailer')

// Create transporter (dummy configuration)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendInterviewInvitation = async (candidateEmail, interviewDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@neorecruiter.com',
      to: candidateEmail,
      subject: `Interview Invitation - ${interviewDetails.role} Position`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Interview Invitation</h2>
          <p>Dear Candidate,</p>
          <p>You have been invited to participate in an AI-powered interview for the <strong>${interviewDetails.role}</strong> position.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Interview Details:</h3>
            <p><strong>Role:</strong> ${interviewDetails.role}</p>
            <p><strong>Technical Domain:</strong> ${interviewDetails.technicalDomain || 'General'}</p>
            <p><strong>Number of Questions:</strong> ${interviewDetails.questions.length}</p>
          </div>
          
          <p>Click the link below to start your interview:</p>
          <a href="${interviewDetails.interviewLink}" 
             style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Interview
          </a>
          
          <p style="margin-top: 20px; color: #666;">
            This is an automated AI interview. Please ensure you have a stable internet connection and a quiet environment.
          </p>
          
          <p>Best regards,<br>NeoRecruiter Team</p>
        </div>
      `
    }

    // Send email
    try {
      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)

    }
    
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, message: 'Failed to send email' }
  }
}

module.exports = {
  sendInterviewInvitation
}