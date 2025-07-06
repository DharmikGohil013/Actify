const Task = require('../models/Task');
const Calendar = require('../models/Calendar');

// Get tasks for specific date/week/month – already handled well

// Add/Update/Delete events – already covered

// NEW: Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Calendar.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update event', err: err.message });
  }
};

// NEW: Share Event
exports.shareEventWithUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    const event = await Calendar.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    event.sharedWith = [...new Set([...event.sharedWith, ...userIds])];
    await event.save();
    res.json({ msg: 'Event shared', sharedWith: event.sharedWith });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to share event', err: err.message });
  }
};
