// /models/Setting.js
const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme: { type: String, enum: ['Light', 'Dark'], default: 'Light' },
  reminderDefault: { type: Number, default: 10 }, // in minutes before task
  calendarSync: { type: Boolean, default: false },
  googleCalendarToken: { type: String }, // optional, for sync
  pushNotifications: { type: Boolean, default: true },
  sound: { type: Boolean, default: true },
  vibration: { type: Boolean, default: false }
});

module.exports = mongoose.model('Setting', SettingSchema);
