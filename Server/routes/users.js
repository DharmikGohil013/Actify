// /routes/users.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const userController = require('../controllers/userController');

// All routes below require authentication
router.use(requireAuth);

// Get current user profile and stats
router.get('/me', userController.getProfile);

// Update profile (no password change here)
router.put('/me', userController.updateProfile);

module.exports = router;
