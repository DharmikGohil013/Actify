const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const otpStore = {}; // in-memory { email: otp }

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  await sendEmail(
    email,
    "🔐 Your Actify OTP Code",
    `Your Actify verification code is ${otp}`,
    `<p>Your OTP for Actify is <strong>${otp}</strong></p>`
  );

  res.json({ success: true, msg: "OTP sent" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    return res.json({ success: true });
  }
  return res.status(400).json({ msg: "Invalid OTP" });
};

exports.createAccount = async (req, res) => {
  const { name, email, password } = req.body;
  if (!otpStore[email]) return res.status(400).json({ msg: "OTP not verified" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, verified: true });

  const token = generateToken(user._id);
  delete otpStore[email];

  res.status(201).json({ token, user: { id: user._id, name, email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generateToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};
