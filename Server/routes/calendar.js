const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const calendarController = require('../controllers/calendarController');

router.use(requireAuth);

// Events & tasks calendar views
router.get('/tasks/date', calendarController.getTasksForDate);
router.get('/tasks/week', calendarController.getTasksForWeek);
router.get('/tasks/month', calendarController.getTasksForMonth); // NEW

// Calendar events CRUD
router.get('/events', calendarController.getEvents);
router.post('/events', calendarController.addEvent);
router.put('/events/:id', calendarController.updateEvent); // NEW
router.delete('/events/:id', calendarController.deleteEvent);

// Shared calendar support
router.post('/events/:id/share', calendarController.shareEventWithUsers); // NEW

module.exports = router;
