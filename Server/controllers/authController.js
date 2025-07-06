const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // Add at the top

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    await sendEmail(
  user.email,
  '🎉 Welcome to Actify!',
  'Welcome email (plain text fallback)', // Optional plain text
  `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="background-color: #4f46e5; color: white; padding: 20px 30px;">
        <h1 style="margin: 0; font-size: 24px;">👋 Welcome to Actify, ${user.name}!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; line-height: 1.5;">
          Thank you for registering with <strong>Actify</strong> — your personal task and calendar assistant.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          We’re excited to have you on board! You can now manage your daily tasks, set reminders, and get notifications to stay productive.
        </p>

        <!-- SVG icon -->
        <div style="text-align: center; margin: 30px 0;">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="#4f46e5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
            10-4.48 10-10S17.52 2 12 2zm-1
            15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20
            8l-9 9z"/>
          </svg>
        </div>

        <a href="https://dharmikgohil.fun/" style="
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Get Started</a>

        <p style="font-size: 14px; color: #555; margin-top: 30px;">
          If you didn’t sign up for Actify, you can ignore this email.
        </p>
      </div>
    </div>
    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
      &copy; ${new Date().getFullYear()} Actify. All rights reserved.
    </p>
  </div>
  `
);


    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Registration failed', err: err.message });
  }
};

// ✅ LOGIN — MAKE SURE THIS FUNCTION EXISTS!
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.isDeleted) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', err: err.message });
  }
};


