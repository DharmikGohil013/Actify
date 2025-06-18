// /models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },      // Task Name
  type: { type: String, enum: ['Work', 'Personal', 'Learning', 'Other'], default: 'Work' },
  time: { type: String, required: true },      // Could also use Date if full timestamp
  duration: { type: Number },                  // in minutes
  notes: { type: String },
  status: { type: String, enum: ['Complete', 'Incomplete'], default: 'Incomplete' },
  date: { type: Date, required: true },        // Task for which day
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  reminder: { type: Date },                    // For push/email reminders
  recurring: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
