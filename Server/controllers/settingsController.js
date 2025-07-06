// /controllers/settingsController.js
const Setting = require('../models/Setting');

// Get current user's settings
exports.getSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ user: req.user.id });
    if (!setting) return res.status(404).json({ msg: 'Settings not found' });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get settings', err: err.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne({ user: req.user.id });
    if (!setting) {
      setting = new Setting({ user: req.user.id, ...req.body });
    } else {
      Object.assign(setting, req.body);
    }
    await setting.save();
    res.json(setting);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update settings', err: err.message });
  }
};


exports.syncGoogleCalendar = async (req, res) => {
  try {
    // Placeholder logic for syncing
    res.json({ msg: 'Google Calendar sync initiated (mock)' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to sync calendar', err: err.message });
  }
};

exports.unsubscribeWeeklySummary = async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { user: req.user.id },
      { weeklySummary: false },
      { new: true }
    );
    res.json({ msg: 'Weekly summary disabled', setting });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to unsubscribe', err: err.message });
  }
};

