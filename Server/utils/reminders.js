const Task = require('../models/Task');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');
const sendPush = require('./sendPush');
const User = require('../models/User');

const processReminders = async () => {
  const now = new Date();

  // Find tasks with due reminders not yet sent
  const tasks = await Task.find({
    reminder: { $lte: now },
    status: 'Incomplete',
    isDeleted: { $ne: true },
    reminderSent: { $ne: true }
  });

  for (const task of tasks) {
    const user = await User.findById(task.user).populate('settings');

    const message = `Reminder: "${task.name}" is scheduled for ${task.time}`;

    // Create in-app notification
    await Notification.create({
      user: user._id,
      message,
      type: 'Reminder',
      date: new Date()
    });

    // Optional email
    if (user.email && user.settings?.pushNotifications !== false) {
      await sendEmail(user.email, 'Task Reminder', message);
    }

    // Optional push
    await sendPush(user, message);

    // Mark reminder as sent
    task.reminderSent = true;
    await task.save();
  }
};

module.exports = { processReminders };
