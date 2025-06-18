// /controllers/notificationController.js
const Notification = require('../models/Notification');

// Get all notifications for logged-in user (most recent first)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch notifications', err: err.message });
  }
};

// Mark one notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update notification', err: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete notification', err: err.message });
  }
};

// Mark ALL as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark all as read', err: err.message });
  }
};
