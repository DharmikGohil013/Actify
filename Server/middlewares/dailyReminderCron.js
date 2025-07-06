// /middlewares/dailyReminderCron.js

const cron = require('node-cron');
const User = require('../models/User');
const Task = require('../models/Task');
const sendEmail = require('../utils/sendEmail');

const startDailyReminderCron = () => {
  // 🕕 MORNING MAIL — Motivation + Add Tasks
  cron.schedule('0 6 * * *', async () => {
    try {
      const users = await User.find({});
      for (const user of users) {
        const subject = `Good Morning, ${user.name}! 🌅`;
        const text = `Hi ${user.name},\n\nIt's a new day! Plan it well.\nStart by adding your tasks in Actify and stay focused.\n\n👉 Stay motivated! \n– Your Actify Team`;
        const html = `
          <div style="font-family:sans-serif; padding:20px">
            <h2>🌞 Good Morning, ${user.name}!</h2>
            <p>Today is a fresh start. Add your important tasks in Actify and stay in control of your day.</p>
            <ul>
              <li><b>Prioritize</b> what matters</li>
              <li><b>Stay positive</b> – you're doing great!</li>
              <li><b>Take breaks</b> and breathe</li>
            </ul>
            <p><a href="https://actify.app" target="_blank">📝 Open Actify to plan your day</a></p>
            <hr>
            <p style="color:gray;font-size:12px">Actify – Your Daily Growth Partner</p>
          </div>`;

        await sendEmail(user.email, subject, text, html);
      }
    } catch (err) {
      console.error('Morning motivation cron failed:', err);
    }
  });

  // 🌙 NIGHT MAIL — Incomplete Tasks Reminder
  cron.schedule('0 23 * * *', async () => {
    try {
      const users = await User.find({});
      for (const user of users) {
        const tasks = await Task.find({ user: user._id, status: 'Incomplete' });
        if (tasks.length === 0) continue;

        const subject = `⏰ You have ${tasks.length} pending task(s)!`;
        const text = `Hey ${user.name},\n\nHere's your end-of-day task summary:\n\n` + tasks.map(t => `- ${t.name}`).join('\n') + `\n\nComplete what you can, and rest well.\n– Actify`;

        const html = `
          <div style="font-family:sans-serif; padding:20px">
            <h2>⏳ You still have ${tasks.length} task(s) to complete</h2>
            <p>Here's what remains:</p>
            <ul>
              ${tasks.map(t => `<li>${t.name}</li>`).join('')}
            </ul>
            <p>Don't worry if you can't finish everything. Review and reschedule if needed.</p>
            <p><a href="https://actify.app" target="_blank">📋 Open Actify to review your tasks</a></p>
            <hr>
            <p style="color:gray;font-size:12px">Actify – Helping you grow, one task at a time.</p>
          </div>`;

        await sendEmail(user.email, subject, text, html);
      }
    } catch (err) {
      console.error('Night reminder cron failed:', err);
    }
  });
};

module.exports = startDailyReminderCron;