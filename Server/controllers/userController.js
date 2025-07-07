// /controllers/userController.js
const User = require('../models/User');
const Task = require('../models/Task');

// Get current user profile + stats
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('friends', 'name email');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const tasks = await Task.find({ user: user._id });
    const completed = tasks.filter(t => t.status === 'Complete').length;
    const total = tasks.length;

    const typeCount = {};
    let hourCount = Array(24).fill(0);

    tasks.forEach(task => {
      typeCount[task.type] = (typeCount[task.type] || 0) + 1;
      const hour = parseInt(task.time?.split(':')[0]);
      if (!isNaN(hour)) hourCount[hour]++;
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

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update profile', err: err.message });
  }
};



// Get my friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'name email');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get friends', err: err.message });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.json({ users: [] });

    const regex = new RegExp(query, "i");
    const users = await User.find({ name: regex }).select("_id name followers blocked");

    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const completed = await Task.countDocuments({ user: u._id, status: "Completed" });
        return {
          _id: u._id,
          name: u.name,
          completedTasks: completed,
          isFriend: u.followers?.includes(req.user?._id), // safe even if user is undefined
          isBlocked: u.blocked?.includes(req.user?._id),
        };
      })
    );

    res.json({ users: enrichedUsers });
  } catch (err) {
    console.error("searchUsers error", err);
    res.status(500).json({ msg: "Search failed" });
  }
};

// Follow user
exports.followUser = async (req, res) => {
  const me = req.user._id;
  const targetId = req.params.id;

  if (me.toString() === targetId) return res.status(400).json({ error: "You cannot follow yourself." });

  await User.findByIdAndUpdate(me, { $addToSet: { friends: targetId } });
  res.json({ success: true });
};