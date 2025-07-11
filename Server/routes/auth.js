const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

console.log('REGISTER:', authController.register);
console.log('LOGIN:', authController.login); // 👈 Add this line temporarily

router.post('/register', authController.register);
router.post('/login', authController.login); // This is crashing if `login` is undefined
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp-register', authController.verifyOtpAndRegister);

module.exports = router;
