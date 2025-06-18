// /controllers/calendarController.js
const Task = require('../models/Task');
const Calendar = require('../models/Calendar'); // optional

// Get all tasks for a specific date (for calendar day view)
exports.getTasksForDate = async (req, res) => {
  try {
    const { date } = req.query; // Expected format: 'YYYY-MM-DD'
    if (!date) return res.status(400).json({ msg: 'Date is required' });

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ time: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch tasks for date', err: err.message });
  }
};

// Get tasks for a week (for calendar week view)
exports.getTasksForWeek = async (req, res) => {
  try {
    const { weekStart } = req.query; // Expected format: 'YYYY-MM-DD' (Monday)
    if (!weekStart) return res.status(400).json({ msg: 'weekStart is required' });

    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1, time: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch tasks for week', err: err.message });
  }
};

// Get all events (if using Calendar model)
exports.getEvents = async (req, res) => {
  try {
    const events = await Calendar.find({ user: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch events', err: err.message });
  }
};

// Add a new event (if using Calendar model)
exports.addEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const event = new Calendar({
      user: req.user.id,
      title,
      description,
      date
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add event', err: err.message });
  }
};

// Delete an event (if using Calendar model)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Calendar.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete event', err: err.message });
  }
};
