const notificationService = require('../services/notification.service');

/**
 * Send reminders to candidates who haven't completed their interviews
 * This function can be called by a scheduler like node-cron
 */
const sendInterviewReminders = async () => {
  console.log('Starting scheduled task: Send interview reminders');
  
  try {
    // Send reminders for interviews that are 3 days old
    const result = await notificationService.sendInterviewReminders(3);
    console.log('Reminder task result:', result);
    return result;
  } catch (error) {
    console.error('Error in reminder task:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInterviewReminders
};