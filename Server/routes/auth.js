const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, createAccount, login } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/create-account", createAccount);
router.post("/login", login);

module.exports = router;
