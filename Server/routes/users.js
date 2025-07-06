const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.use(requireAuth);

// Profile and settings
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

// Avatar & password
router.post('/me/avatar', userController.updateAvatar); // NEW
router.patch('/me/password', userController.changePassword); // NEW

// Admin
router.get('/all', userController.getAllUsers); // if user is admin
router.patch('/:id/role', userController.changeUserRole); // Admin only
router.patch('/:id/delete', userController.softDeleteUser); // Soft delete
router.patch('/:id/restore', userController.restoreUser); // Soft restore

module.exports = router;
