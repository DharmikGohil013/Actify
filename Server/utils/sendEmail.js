// /utils/sendEmail.js
const nodemailer = require('nodemailer');

// Configure your transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g. Gmail, or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER,   // Add to your .env
    pass: process.env.EMAIL_PASS    // Add to your .env
  }
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `"Actify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

module.exports = sendEmail;
