const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String },
  settings: { type: mongoose.Schema.Types.ObjectId, ref: 'Setting' },
  lastLogin: { type: Date },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', UserSchema);
