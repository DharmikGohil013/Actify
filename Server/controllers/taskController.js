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


exports.restoreDeletedTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: false },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task restored', task });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to restore task', err: err.message });
  }
};

exports.getTodayTasks = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  try {
    const tasks = await Task.find({ user: req.user.id, date: { $gte: today, $lte: end }, isDeleted: false });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch today\'s tasks', err: err.message });
  }
};

exports.getTasksByTag = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, tags: req.params.tag, isDeleted: false });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch tagged tasks', err: err.message });
  }
};

exports.getSubTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, parentTask: req.params.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch subtasks', err: err.message });
  }
};

exports.addSubTask = async (req, res) => {
  try {
    const parent = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!parent) return res.status(404).json({ msg: 'Parent task not found' });

    const subtask = await Task.create({
      user: req.user.id,
      ...req.body,
      parentTask: parent._id
    });

    res.status(201).json(subtask);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add subtask', err: err.message });
  }
};
