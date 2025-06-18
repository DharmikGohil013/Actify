// /routes/notifications.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(requireAuth);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Mark a single notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
