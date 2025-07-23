const http = require('http');
const app = require('./app');
const port = process.env.PORT || 4000;
const cron = require('node-cron');
const reminderTask = require('./tasks/reminderTask');

const server = http.createServer(app);

// Schedule tasks
if (process.env.NODE_ENV === 'production') {
  // Send reminders daily at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('Running scheduled reminder task');
      await reminderTask.sendInterviewReminders();
    } catch (error) {
      console.error('Error in scheduled reminder task:', error);
    }
  });
  
  console.log('Scheduled tasks initialized');
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});