// /routes/calendar.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const calendarController = require('../controllers/calendarController');

// All routes require authentication
router.use(requireAuth);

// Get all tasks for a specific date
router.get('/tasks/date', calendarController.getTasksForDate);

// Get all tasks for a specific week
router.get('/tasks/week', calendarController.getTasksForWeek);

// If using Calendar model for events:
router.get('/events', calendarController.getEvents);
router.post('/events', calendarController.addEvent);
router.delete('/events/:id', calendarController.deleteEvent);

module.exports = router;
