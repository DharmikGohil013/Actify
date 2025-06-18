// /controllers/userController.js
const User = require('../models/User');
const Task = require('../models/Task');

// Get user profile + stats
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Stats: completion, common types, productive time
    const tasks = await Task.find({ user: user._id });
    const completed = tasks.filter(t => t.status === 'Complete').length;
    const total = tasks.length;
    const typeCount = {};
    let hourCount = Array(24).fill(0);

    tasks.forEach(task => {
      typeCount[task.type] = (typeCount[task.type] || 0) + 1;
      if (task.time) {
        const hour = parseInt(task.time.split(':')[0]);
        if (!isNaN(hour)) hourCount[hour]++;
      }
    });

    const mostCommonType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    const mostProductiveHour = hourCount.indexOf(Math.max(...hourCount));

    res.json({
      user,
      stats: {
        completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        mostCommonType,
        mostProductiveHour: mostProductiveHour === -1 ? null : `${mostProductiveHour}:00`
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get profile', err: err.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password; // don't update password here
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update profile', err: err.message });
  }
};
