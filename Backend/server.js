const http = require('http');
const app = require('./app');
const port = process.env.PORT || 4000;
const cron = require('node-cron');
const reminderTask = require('./tasks/reminderTask');
const server = http.createServer(app);

// Better logging for production
const log = (message, type = 'INFO') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${type}: ${message}`);
};

if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 10 * * *', async () => {
    try {
      log('Running scheduled reminder task');
      await reminderTask.sendInterviewReminders();
      log('Reminder task completed successfully');
    } catch (error) {
      log(`Error in scheduled reminder task: ${error.message}`, 'ERROR');
    }
  });
  log('Scheduled tasks initialized');
}

server.listen(port, () => {
  log(`🚀 NeoRecruiter API Server running on port ${port}`);
  log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    log('Server closed');
    process.exit(0);
  });
});