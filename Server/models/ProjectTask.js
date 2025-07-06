const mongoose = require('mongoose');

const ProjectTaskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  name: { type: String, required: true },
  description: String,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Not Started', 'In Progress', 'Complete'], default: 'Not Started' },
  deadline: Date,
  startedAt: Date,
  endedAt: Date,
  timeLogs: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    start: Date,
    end: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProjectTask', ProjectTaskSchema);
