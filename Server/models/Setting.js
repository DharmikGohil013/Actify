const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme: { type: String, enum: ['Light', 'Dark', 'System'], default: 'Light' },
  reminderDefault: { type: Number, default: 10 },
  calendarSync: { type: Boolean, default: false },
  googleCalendarToken: { type: String },
  pushNotifications: { type: Boolean, default: true },
  sound: { type: Boolean, default: true },
  vibration: { type: Boolean, default: false },
  timezone: { type: String, default: 'Asia/Kolkata' },
  language: { type: String, default: 'en' },
  weeklySummary: { type: Boolean, default: true }, // email digest
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SettingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Setting', SettingSchema);
