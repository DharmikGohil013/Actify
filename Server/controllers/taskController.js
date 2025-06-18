// /controllers/taskController.js
const Task = require('../models/Task');

// Get all tasks for a user (optionally filter by status/type/date)
exports.getTasks = async (req, res) => {
  try {
    const { status, type, date } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (date) filter.date = date;

    const tasks = await Task.find(filter).sort({ date: 1, time: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch tasks', err: err.message });
  }
};

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { name, type, time, duration, notes, date, priority, reminder, recurring } = req.body;
    const task = new Task({
      user: req.user.id,
      name,
      type,
      time,
      duration,
      notes,
      date,
      priority,
      reminder,
      recurring
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add task', err: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update task', err: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete task', err: err.message });
  }
};

// Mark as done/undone
exports.toggleStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    task.status = task.status === 'Complete' ? 'Incomplete' : 'Complete';
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update task status', err: err.message });
  }
};
