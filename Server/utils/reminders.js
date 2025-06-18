// /utils/reminders.js
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');
const sendPush = require('./sendPush');

/**
 * Check for tasks with reminders and send notifications.
 * Call this from your cron or notification service.
 */
const processReminders = async () => {
  // Example: find tasks with a reminder time <= now, status incomplete
  const now = new Date();
  const tasks = await Task.find({
    reminder: { $lte: now },
    status: 'Incomplete'
    // Add filter so you don't double-notify (e.g., add a "reminderSent" flag on task)
  });

  for (const task of tasks) {
    // Send notification
    await Notification.create({
      user: task.user,
      message: `Reminder: "${task.name}" is scheduled soon!`,
      type: 'Reminder'
    });

    // (Optional) Email/push
    // Fetch user info if needed
    // const user = await User.findById(task.user);
    // await sendEmail(user.email, 'Task Reminder', `Reminder: ${task.name}`);
    // await sendPush(user, `Task Reminder: ${task.name}`);

    // Optionally, mark as sent so you don't remind again
    // task.reminderSent = true;
    // await task.save();
  }
};

module.exports = { processReminders };
