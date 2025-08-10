const notificationService = require('../services/notification.service');

const sendInterviewReminders = async () => {
  console.log('Starting scheduled task: Send interview reminders');
  try {
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
