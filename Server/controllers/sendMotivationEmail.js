// controllers/sendMotivationEmail.js
const sendEmail = require('../utils/sendEmail');

exports.sendMotivationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    await sendEmail(
      email,
      '🌟 Boost Your Day with Actify!',
      'Motivational message for a powerful day.',
      `
      <div style="font-family: 'Segoe UI', sans-serif; background: #f0f4ff; padding: 30px;">
        <div style="max-width: 620px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #6366f1, #3b82f6); padding: 24px 30px; color: white;">
            <h2 style="margin: 0;">🌈 Let’s Make Today Count!</h2>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Hey there! 💬</p>
            <p style="font-size: 16px; color: #333;">
              We’re here to remind you that <strong>every small action</strong> adds up to big results.
            </p>
            <p style="font-size: 16px; color: #333;">
              Use <strong>Actify</strong> to stay on top of your tasks, goals, and habits. You’ve got this! 💪
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <svg width="90" height="90" viewBox="0 0 24 24" fill="#6366f1" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/>
              </svg>
              <svg width="90" height="90" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0 1.605 6v12L12 24l10.395-6V6L12 0Zm0 2.18 8.395 4.84-3.332 1.85L12 5.26 6.937 8.87 3.605 7.02 12 2.18Zm0 19.64-8.395-4.84V9.1l3.332 1.85 4.063-2.61 4.063 2.61 3.332-1.85v8.88L12 21.82Z"/>
              </svg>
            </div>

            <a href="https://actify.dharmikgohil.fun" style="
              background: #6366f1;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: block;
              text-align: center;
              margin-top: 10px;
            ">🚀 Start Using Actify</a>

            <p style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;">
              You’ve got a whole day ahead. Make it productive. Make it yours.
            </p>
          </div>
        </div>
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 16px;">
          &copy; ${new Date().getFullYear()} Actify • Stay Focused, Stay Winning
        </p>
      </div>
      `
    );

    res.status(200).json({ success: true, msg: 'Motivational email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Failed to send email.' });
  }
};
