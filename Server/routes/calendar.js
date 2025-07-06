const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const calendarController = require('../controllers/calendarController');

// Debug log
console.log('CALENDAR CONTROLLER:', calendarController);

router.use(requireAuth);

router.get('/tasks/date', calendarController.getTasksForDate);
router.get('/tasks/week', calendarController.getTasksForWeek);
router.get('/events', calendarController.getEvents);
router.post('/events', calendarController.addEvent);
router.delete('/events/:id', calendarController.deleteEvent);

module.exports = router;
