// /models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Hashed password
  avatar: { type: String }, // Optional: URL or file ref
  settings: { type: mongoose.Schema.Types.ObjectId, ref: 'Setting' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
