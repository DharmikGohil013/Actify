const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const settingsController = require('../controllers/settingsController');

router.use(requireAuth);

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.post('/sync-calendar', settingsController.syncGoogleCalendar); // NEW
router.post('/unsubscribe-weekly-summary', settingsController.unsubscribeWeeklySummary); // NEW

module.exports = router;
