const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['Reminder', 'DueSoon', 'Missed', 'Review', 'General'],
    default: 'General'
  },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  device: { type: String }, // e.g., 'mobile', 'web'
  source: { type: String }, // e.g., 'email', 'push', 'sms'
  actionLink: { type: String }, // URL or deep link
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
