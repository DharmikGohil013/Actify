const nodemailer = require("nodemailer");

exports.sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your@email.com",
      pass: "yourpassword",
    },
  });

  await transporter.sendMail({
    from: '"Your App" <your@email.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });
};
