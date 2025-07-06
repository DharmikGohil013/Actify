const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Work', 'Personal', 'Learning', 'Other'], default: 'Work' },
  time: { type: String, required: true },
  duration: { type: Number },
  notes: { type: String },
  status: { type: String, enum: ['Complete', 'Incomplete'], default: 'Incomplete' },
  date: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  reminder: { type: Date },
  recurring: { type: Boolean, default: false },
  recurrenceRule: { type: String }, // e.g., 'FREQ=WEEKLY;BYDAY=MO,WE,FR'
  tags: [{ type: String }],
  labels: [{ type: String }],
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, // for sub-tasks
  attachments: [{ type: String }], // URLs or file refs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

TaskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
