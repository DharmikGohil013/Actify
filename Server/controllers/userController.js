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
  const query = req.query.q;
  const currentUserId = req.user.id;

  try {
    const users = await User.find({
      name: { $regex: query, $options: "i" },
      _id: { $ne: currentUserId },
    }).select("name completedTasks");

    const currentUser = await User.findById(currentUserId).select("friends blocked");

    // fallback to empty array if undefined
    const friendIds = currentUser?.friends || [];
    const blockedIds = currentUser?.blocked || [];

    const result = users.map(u => ({
      _id: u._id,
      name: u.name,
      completedTasks: u.completedTasks || 0,
      isFriend: friendIds.includes(u._id.toString()),
      isBlocked: blockedIds.includes(u._id.toString()),
    }));

    res.json({ users: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// Follow user
// controllers/userController.js
exports.followUser = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const friendId = req.params.friendId;

    if (userId === friendId)
      return res.status(400).json({ msg: "Cannot follow yourself" });

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend)
      return res.status(404).json({ msg: "User not found" });

    if (user.friends.includes(friendId))
      return res.status(400).json({ msg: "Already following this user" });

    user.friends.push(friendId);
    await user.save(); // ❗ You MUST save the change

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
