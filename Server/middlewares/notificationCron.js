const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const sendPush = require('../utils/sendPush'); // Optional custom module
const sendEmail = require('../utils/sendEmail'); // Optional custom module

const startNotificationCron = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const nextFiveMin = new Date(now.getTime() + 5 * 60000);

    const tasks = await Task.find({
      reminder: { $gte: now, $lte: nextFiveMin },
      status: 'Incomplete',
      isDeleted: { $ne: true }
    }).populate('user');

    for (const task of tasks) {
      const message = `Reminder: "${task.name}" starts at ${task.time}`;

      // Create Notification
      await Notification.create({
        user: task.user._id,
        message,
        type: 'Reminder',
        date: new Date()
      });

      // Push (optional)
      if (task.user.settings?.pushNotifications) {
        sendPush(task.user, message);
      }

      // Email (optional)
      if (task.user.email) {
        sendEmail(task.user.email, 'Task Reminder', message);
      }
    }
  });
};

module.exports = startNotificationCron;
