const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const notificationController = require('../controllers/notificationController');

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount); // NEW
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
