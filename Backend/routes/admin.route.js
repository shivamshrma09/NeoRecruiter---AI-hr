const express = require('express');
const router = express.Router();
const authHrMiddleware = require('../middlewares/hr.middleware');
const reminderTask = require('../tasks/reminderTask');

// Admin routes - all require authentication
router.use(authHrMiddleware.authHr);

// Manually trigger reminder emails
router.post('/send-reminders', async (req, res) => {
  try {
    const result = await reminderTask.sendInterviewReminders();
    res.json(result);
  } catch (err) {
    console.error('Error sending reminders:', err);
    res.status(500).json({ message: 'Failed to send reminders', error: err.message });
  }
});

module.exports = router;