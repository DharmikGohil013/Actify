const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    await transporter.sendMail({
      from: `"Actify - Start Your Journey" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

module.exports = sendEmail;
