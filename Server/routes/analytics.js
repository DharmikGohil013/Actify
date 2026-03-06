const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth");
const analyticsController = require("../controllers/analyticsController");

router.use(requireAuth);

// Personal deep analytics
router.get("/me", analyticsController.getMyAnalytics);

// Global leaderboard
router.get("/leaderboard", analyticsController.getLeaderboard);

// Compare with another user
router.get("/compare/:userId", analyticsController.compareWithUser);

module.exports = router;
