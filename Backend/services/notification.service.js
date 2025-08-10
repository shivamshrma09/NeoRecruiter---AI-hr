const emailService = require('./email.service');
const hrModel = require('../models/hr.model');

const notifyInterviewCompletion = async (interviewId, candidateEmail) => {
  try {
    const hr = await hrModel.findOne({ 'interviews._id': interviewId });
    if (!hr) {
      return { success: false, message: 'HR not found for this interview' };
    }
    const interview = hr.interviews.id(interviewId);
    if (!interview) {
      return { success: false, message: 'Interview not found' };
    }
    const candidate = interview.candidates.find(c => c.email === candidateEmail);
    if (!candidate) {
      return { success: false, message: 'Candidate not found in interview' };
    }
    const result = await emailService.sendInterviewCompletionNotification(
      hr.email,
      {
        name: candidate.name,
        email: candidate.email,
        answeredQuestions: candidate.answers.length
      },
      {
        role: interview.role,
        technicalDomain: interview.technicalDomain,
        interviewId: interview._id,
        questions: interview.questions
      }
    );
    return result;
  } catch (error) {
    console.error('Failed to send interview completion notification:', error);
    return { success: false, message: 'Failed to send notification', error: error.message };
  }
};

const sendInterviewReminders = async (daysOld = 3) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const hrs = await hrModel.find({
      'interviews.createdAt': { $lt: cutoffDate },
      'interviews.candidates.status': 'pending'
    });
    let remindersSent = 0;
    for (const hr of hrs) {
      for (const interview of hr.interviews) {
        if (new Date(interview.createdAt) > cutoffDate) continue;
        const pendingCandidates = interview.candidates.filter(c => c.status === 'pending');
        for (const candidate of pendingCandidates) {
          if (candidate.lastReminderSent && 
              new Date(candidate.lastReminderSent) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            continue;
          }
          const interviewLink = `https://neorecruiter.vercel.app/interview?id=${interview._id}&email=${encodeURIComponent(candidate.email)}`;
          const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@neorecruiter.com',
            to: candidate.email,
            subject: `Reminder: Complete Your ${interview.role} Interview`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(to right, #1e40af, #3b82f6); padding: 30px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Interview Reminder</h1>
                  <p style="color: white; margin-top: 10px; font-size: 16px;">Your AI Interview is Waiting</p>
                </div>
                <div style="padding: 30px 20px;">
                  <p style="font-size: 16px;">Dear Candidate,</p>
                  <p style="font-size: 16px; line-height: 1.5;">
                    This is a friendly reminder that you have an interview pending for the <strong>${interview.role}</strong> position.
                    Your interview was scheduled a few days ago and we noticed you haven't completed it yet.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 16px; margin-bottom: 15px;"><strong>Ready to begin? Click the button below:</strong></p>
                    <a href="${interviewLink}" 
                       style="background: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                      Start My Interview
                    </a>
                  </div>
                  <p style="font-size: 16px; line-height: 1.5;">
                    This interview is an important step in our hiring process. It should only take about 
                    ${Math.max(15, interview.questions.length * 5)} minutes to complete.
                  </p>
                  <p style="margin-top: 30px;">Best regards,<br>The ${hr.companyName || 'NeoRecruiter'} Team</p>
                </div>
                <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                  <p>© ${new Date().getFullYear()} NeoRecruiter - AI-Powered Interview Platform</p>
                </div>
              </div>
            `
          };
          try {
            await emailService.transporter.sendMail(mailOptions);
            candidate.lastReminderSent = new Date();
            hr.markModified('interviews');
            await hr.save();
            remindersSent++;
          } catch (emailError) {
            console.error(`Failed to send reminder to ${candidate.email}:`, emailError);
          }
        }
      }
    }
    return { 
      success: true, 
      message: `Sent ${remindersSent} interview reminders to pending candidates` 
    };
  } catch (error) {
    console.error('Failed to send interview reminders:', error);
    return { success: false, message: 'Failed to send reminders', error: error.message };
  }
};
module.exports = {
  notifyInterviewCompletion,
  sendInterviewReminders
};
