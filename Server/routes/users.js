const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const userController = require('../controllers/userController');

// Debugging to confirm functions are defined
console.log('GET PROFILE:', userController.getProfile);
console.log('UPDATE PROFILE:', userController.updateProfile);

router.use(requireAuth);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

module.exports = router;
