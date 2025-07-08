const sendEmail = require('../utils/sendEmail');

exports.sendMotivationEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    await sendEmail(
      email,
      '🚀 Stay Motivated with Actify!',
      'Your daily motivation from Actify',
      `
        <div style="font-family: Arial, sans-serif; background: #f0f4f8; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(90deg, #4f46e5, #3b82f6); color: white; padding: 24px 30px;">
              <h2 style="margin: 0; font-size: 24px;">✨ You’re One Step Closer to Greatness!</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; line-height: 1.6;">
                Every great achievement begins with a decision to try. Let Actify guide your journey—one task at a time.
              </p>
              <p style="font-size: 16px; color: #4f46e5; font-weight: bold;">
                You’ve got what it takes. Let’s go 💪
              </p>

              <div style="text-align: center; margin: 24px 0;">
                <svg width="96" height="96" viewBox="0 0 24 24" fill="#4f46e5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                  10-4.48 10-10S17.52 2 12 2zm-1
                  15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20
                  8l-9 9z"/>
                </svg>
              </div>

              <a href="https://actify.dharmikgohil.fun" style="
                display: inline-block;
                background-color: #4f46e5;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
              ">Launch Actify</a>
            </div>
          </div>
          <p style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} Actify | Empower Your Every Day
          </p>
        </div>
      `
    );

    res.status(200).json({ msg: 'Motivational email sent successfully!' });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(500).json({ msg: 'Email could not be sent' });
  }
};
