
// /routes/users.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.use(requireAuth);

// Profile
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

// Friends
router.post('/follow/:friendId', userController.followUser);
router.get('/friends', userController.getFriends);

module.exports = router;
