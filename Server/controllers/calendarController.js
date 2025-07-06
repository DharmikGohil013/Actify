const Calendar = require('../models/Calendar');
const Task = require('../models/Task');

// Get tasks for a specific date (from query param ?date=YYYY-MM-DD)
exports.getTasksForDate = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const tasks = await Task.find({ user: req.user.id, date });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get tasks for date', err: err.message });
  }
};

// Get all tasks for a week (from query param ?start=YYYY-MM-DD&end=YYYY-MM-DD)
exports.getTasksForWeek = async (req, res) => {
  try {
    const { start, end } = req.query;
    const tasks = await Task.find({
      user: req.user.id,
      date: { $gte: new Date(start), $lte: new Date(end) }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get tasks for week', err: err.message });
  }
};

// Get all calendar events
exports.getEvents = async (req, res) => {
  try {
    const events = await Calendar.find({ user: req.user.id }).populate('tasks');
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get events', err: err.message });
  }
};

// Add a new calendar event
exports.addEvent = async (req, res) => {
  try {
    const { title, description, date, tasks = [] } = req.body;
    const event = await Calendar.create({
      user: req.user.id,
      title,
      description,
      date,
      tasks
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add event', err: err.message });
  }
};

// Delete calendar event
exports.deleteEvent = async (req, res) => {
  try {
    await Calendar.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete event', err: err.message });
  }
};
