const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // Add at the top
const OtpToken = require('../models/OtpToken');
const crypto = require('crypto');
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
  'Welcome email (plain text fallback)',
  `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); overflow: hidden;">
      
      <!-- Header with logo and wave -->
      <div style="background: linear-gradient(90deg, #4f46e5, #6366f1); padding: 30px; color: white; position: relative;">
        <div style="display: flex; align-items: center;">
          
          <h1 style="margin: 0; font-size: 26px;">Welcome to Actify, ${user.name}!</h1>
        </div>
        <svg style="position: absolute; bottom: -1px; left: 0;" width="100%" height="32" viewBox="0 0 1440 320"><path fill="#ffffff" fill-opacity="1" d="M0,288L1440,160L1440,0L0,0Z"></path></svg>
      </div>

      <!-- Body -->
      <div style="padding: 36px 30px 20px 30px; color: #333;">
        <p style="font-size: 16px; line-height: 1.7;">
          Thanks for joining <strong>Actify</strong> — your personal task and productivity partner.
        </p>
        <p style="font-size: 16px; line-height: 1.7;">
          Stay on top of your goals, track your daily progress, and receive smart reminders — all in one beautifully simple platform.
        </p>

        <!-- Decorative SVG -->
        <div style="text-align: center; margin: 30px 0;">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="#4f46e5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
            10-4.48 10-10S17.52 2 12 2zm-1
            15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20
            8l-9 9z"/>
          </svg>
          <p style="margin-top: 12px; font-size: 14px; color: #4f46e5;">
            You’re all set to begin your productivity journey.
          </p>
        </div>

        <!-- Call-to-action -->
        <div style="text-align: center;">
          <a href="https://dharmikgohil.fun/" style="
            background: linear-gradient(90deg, #4f46e5, #6366f1);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 15px;
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
            display: inline-block;
          ">🚀 Launch Actify Now</a>
        </div>

        <!-- Divider -->
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

        <!-- Feature Icons -->
        <div style="display: flex; justify-content: space-between; text-align: center;">
          <div style="flex: 1;">
            <img src="https://img.icons8.com/fluency/48/null/todo-list.png" alt="Tasks" />
            <p style="margin-top: 8px; font-size: 13px; color: #555;">Smart Tasking</p>
          </div>
          <div style="flex: 1;">
            <img src="https://img.icons8.com/fluency/48/null/appointment-reminders.png" alt="Reminders" />
            <p style="margin-top: 8px; font-size: 13px; color: #555;">Daily Reminders</p>
          </div>
        </div>

        <!-- Note -->
        
      </div>

      <!-- Footer -->
      <div style="background-color: #f3f4f6; padding: 18px; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Actify · Empowering your daily success · Built with ❤️ by Dharmik Gohil
      </div>
    </div>
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


// ✅ Step 1: Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "Email already registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  await OtpToken.deleteMany({ email }); // Clear old OTPs
  await OtpToken.create({ email, otp, expiresAt });

  await sendEmail(
    email,
    "Your Actify OTP",
    `Your OTP is: ${otp}`,
    `<div style="font-family:sans-serif; font-size:16px">
      <p>Your OTP for Actify registration:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 5 minutes.</p>
    </div>`
  );

  res.json({ msg: "OTP sent to email" });
};

// ✅ Step 2: Verify OTP and Register
exports.verifyOtpAndRegister = async (req, res) => {
  const { name, email, password, otp } = req.body;
  const otpDoc = await OtpToken.findOne({ email });

  if (!otpDoc || otpDoc.otp !== otp || Date.now() > otpDoc.expiresAt) {
    return res.status(400).json({ msg: "Invalid or expired OTP" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, verified: true });

  await OtpToken.deleteOne({ email });

  await sendEmail( // Optional welcome email
    email,
    '🎉 Welcome to Actify!',
    'Welcome email text',
    `<h2>Welcome ${name}!</h2><p>Your account has been successfully created.</p>`
  );

  const token = generateToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name, email } });
};
