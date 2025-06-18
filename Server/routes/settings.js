// /routes/settings.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const settingsController = require('../controllers/settingsController');

// All routes require authentication
router.use(requireAuth);

// Get current user's settings
router.get('/', settingsController.getSettings);

// Update current user's settings
router.put('/', settingsController.updateSettings);

module.exports = router;
