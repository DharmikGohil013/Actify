// routes/extra.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail'); // Make sure this exists

router.post('/send-motivation', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    await sendEmail(
  email,
  '🚀 Welcome to Actify!',
  'Welcome to Actify! Let’s get started...', // Plaintext fallback
  `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 0 25px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(to right, #4f46e5, #3b82f6); padding: 30px 20px; text-align: center;">
        <img src="https://drive.google.com/uc?export=view&id=1I-DWOESw2oXk-j1MD_qf2H-OlF8n2PUk" alt="Actify Logo" style="width: 60px; height: 60px; border-radius: 50%; background: white; padding: 10px;"/>
        <h1 style="color: #fff; margin-top: 16px; font-size: 28px;">Welcome to Actify!</h1>
        <p style="color: #dbeafe; font-size: 16px;">Your journey to productivity starts now 🌟</p>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 17px; line-height: 1.6; color: #111827;">
          We're thrilled to have you here. Actify helps you <strong>organize your day, plan tasks, track habits, and stay motivated</strong> — all in one powerful platform.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://actify.dharmikgohil.fun" target="_blank" style="
            background: #4f46e5;
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          ">🚀 Start Using Actify</a>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#4f46e5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 
              10 10 10-4.48 10-10S17.52 2 
              12 2zm-1 15l-5-5 1.41-1.41L11 
              14.17l7.59-7.59L20 8l-9 9z"/>
          </svg>
        </div>

        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
          You’re on your way to a more focused and fulfilling daily life.
        </p>
      </div>

      <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
        &copy; ${new Date().getFullYear()} Actify by Dharmik Gohil • <a href="https://dharmikgohil.fun" style="color: #6366f1;">dharmikgohil.fun</a>
      </div>
    </div>
  </div>
  `
);


    res.json({ success: true, msg: 'Motivational email sent successfully!' });
  } catch (err) {
    console.error('Send email failed:', err);
    res.status(500).json({ msg: 'Failed to send email' });
  }
});

module.exports = router;
