const nodemailer = require("nodemailer");

exports.sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your@email.com",
      pass: "yourpassword",
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Your One-Time Password</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #555;">
            We received a request to verify your email. Please use the following OTP (One-Time Password) to continue:
          </p>
          <p style="font-size: 36px; font-weight: bold; color: #4a90e2; margin: 30px 0;">${otp}</p>
          <p style="font-size: 14px; color: #888;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        </div>
        <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #888;">
          If you did not request this, please ignore this email or contact support.
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"Your App" <your@email.com>',
    to: email,
    subject: "Your OTP Code – Action Required - Can't Share It With Anyone",
    html: htmlContent,
  });
};
