const Task = require("../models/Task");
const User = require("../models/User");

// ─── Helper: get date range boundaries ───
function getStartOf(period) {
  const now = new Date();
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "year") return new Date(now.getFullYear(), 0, 1);
  // default: last 30 days
  const d = new Date(now);
  d.setDate(d.getDate() - 30);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ═══════════════════════════════════════════
//  GET /api/analytics/me  — Personal deep analytics
// ═══════════════════════════════════════════
exports.getMyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "month" } = req.query;
    const since = getStartOf(period);

    const allTasks = await Task.find({ user: userId, isDeleted: { $ne: true } }).lean();
    const periodTasks = allTasks.filter((t) => new Date(t.date) >= since);

    const total = periodTasks.length;
    const completed = periodTasks.filter((t) => t.status === "Complete").length;
    const incomplete = periodTasks.filter((t) => t.status === "Incomplete").length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    // ── By type breakdown ──
    const byType = {};
    periodTasks.forEach((t) => {
      if (!byType[t.type]) byType[t.type] = { total: 0, completed: 0 };
      byType[t.type].total++;
      if (t.status === "Complete") byType[t.type].completed++;
    });

    // ── By priority breakdown ──
    const byPriority = {};
    periodTasks.forEach((t) => {
      if (!byPriority[t.priority]) byPriority[t.priority] = { total: 0, completed: 0 };
      byPriority[t.priority].total++;
      if (t.status === "Complete") byPriority[t.priority].completed++;
    });

    // ── Hourly productivity (what hours user is most productive) ──
    const hourlyMap = Array(24).fill(0);
    const hourlyCompleted = Array(24).fill(0);
    periodTasks.forEach((t) => {
      const h = parseInt(t.time?.split(":")[0]);
      if (!isNaN(h)) {
        hourlyMap[h]++;
        if (t.status === "Complete") hourlyCompleted[h]++;
      }
    });
    const hourlyProductivity = hourlyMap.map((count, h) => ({
      hour: h,
      total: count,
      completed: hourlyCompleted[h],
      label: `${h.toString().padStart(2, "0")}:00`,
    }));

    // ── Daily trend (tasks per day in period) ──
    const dailyMap = {};
    periodTasks.forEach((t) => {
      const day = new Date(t.date).toISOString().split("T")[0];
      if (!dailyMap[day]) dailyMap[day] = { date: day, total: 0, completed: 0 };
      dailyMap[day].total++;
      if (t.status === "Complete") dailyMap[day].completed++;
    });
    const dailyTrend = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    // ── Weekly trend (last 12 weeks) ──
    const weeklyMap = {};
    allTasks.forEach((t) => {
      const d = new Date(t.date);
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split("T")[0];
      if (!weeklyMap[key]) weeklyMap[key] = { week: key, total: 0, completed: 0 };
      weeklyMap[key].total++;
      if (t.status === "Complete") weeklyMap[key].completed++;
    });
    const weeklyTrend = Object.values(weeklyMap)
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12);

    // ── Streak calculation (consecutive days with >=1 completed task) ──
    const completedDays = new Set();
    allTasks
      .filter((t) => t.status === "Complete")
      .forEach((t) => completedDays.add(new Date(t.date).toISOString().split("T")[0]));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    // Current streak (backwards from today)
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (completedDays.has(key)) {
        currentStreak++;
      } else {
        break;
      }
    }
    // Longest streak
    const sortedDays = [...completedDays].sort();
    sortedDays.forEach((day, i) => {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDays[i - 1]);
        const curr = new Date(day);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        tempStreak = diff === 1 ? tempStreak + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    });

    // ── Most productive day of week ──
    const dayOfWeekMap = Array(7).fill(0);
    periodTasks
      .filter((t) => t.status === "Complete")
      .forEach((t) => {
        dayOfWeekMap[new Date(t.date).getDay()]++;
      });
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const bestDayIndex = dayOfWeekMap.indexOf(Math.max(...dayOfWeekMap));
    const bestDay = dayOfWeekMap[bestDayIndex] > 0 ? dayNames[bestDayIndex] : null;
    const dayOfWeekBreakdown = dayNames.map((name, i) => ({
      day: name,
      completed: dayOfWeekMap[i],
    }));

    // ── Tags analysis ──
    const tagMap = {};
    periodTasks.forEach((t) => {
      (t.tags || []).forEach((tag) => {
        if (!tagMap[tag]) tagMap[tag] = { tag, count: 0 };
        tagMap[tag].count++;
      });
    });
    const topTags = Object.values(tagMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ── Average tasks per day ──
    const uniqueDays = new Set(periodTasks.map((t) => new Date(t.date).toISOString().split("T")[0]));
    const avgTasksPerDay = uniqueDays.size === 0 ? 0 : +(total / uniqueDays.size).toFixed(1);

    // ── Score (gamification) ──
    const score =
      completed * 10 +
      currentStreak * 5 +
      (completionRate >= 80 ? 50 : completionRate >= 50 ? 20 : 0);

    res.json({
      period,
      summary: {
        total,
        completed,
        incomplete,
        completionRate,
        currentStreak,
        longestStreak,
        bestDay,
        avgTasksPerDay,
        score,
      },
      byType,
      byPriority,
      hourlyProductivity,
      dailyTrend,
      weeklyTrend,
      dayOfWeekBreakdown,
      topTags,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ msg: "Failed to generate analytics", err: err.message });
  }
};

// ═══════════════════════════════════════════
//  GET /api/analytics/leaderboard  — Global leaderboard
// ═══════════════════════════════════════════
exports.getLeaderboard = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const since = getStartOf(period);
    const currentUserId = req.user.id;

    // Get all non-deleted users
    const users = await User.find({ isDeleted: { $ne: true } })
      .select("name avatar friends createdAt")
      .lean();

    // Get all tasks in period
    const tasks = await Task.find({
      isDeleted: { $ne: true },
      date: { $gte: since },
    }).lean();

    // Group tasks by user
    const tasksByUser = {};
    tasks.forEach((t) => {
      const uid = t.user.toString();
      if (!tasksByUser[uid]) tasksByUser[uid] = [];
      tasksByUser[uid].push(t);
    });

    // Build leaderboard entries
    const leaderboard = users.map((u) => {
      const userTasks = tasksByUser[u._id.toString()] || [];
      const total = userTasks.length;
      const completed = userTasks.filter((t) => t.status === "Complete").length;
      const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

      // Calculate streak
      const completedDays = new Set();
      userTasks
        .filter((t) => t.status === "Complete")
        .forEach((t) => completedDays.add(new Date(t.date).toISOString().split("T")[0]));
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        if (completedDays.has(key)) streak++;
        else break;
      }

      const score =
        completed * 10 +
        streak * 5 +
        (completionRate >= 80 ? 50 : completionRate >= 50 ? 20 : 0);

      return {
        _id: u._id,
        name: u.name,
        avatar: u.avatar,
        total,
        completed,
        completionRate,
        streak,
        score,
        isFriend: (u.friends || []).map(String).includes(currentUserId),
        isMe: u._id.toString() === currentUserId,
      };
    });

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    // Assign rank
    leaderboard.forEach((entry, i) => {
      entry.rank = i + 1;
    });

    // Find current user rank
    const myEntry = leaderboard.find((e) => e.isMe);

    res.json({
      period,
      leaderboard: leaderboard.slice(0, 50),
      totalUsers: leaderboard.length,
      myRank: myEntry ? myEntry.rank : null,
      myScore: myEntry ? myEntry.score : 0,
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ msg: "Failed to generate leaderboard", err: err.message });
  }
};

// ═══════════════════════════════════════════
//  GET /api/analytics/compare/:userId — Compare with another user
// ═══════════════════════════════════════════
exports.compareWithUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const { period = "month" } = req.query;
    const since = getStartOf(period);

    const [currentUser, otherUser] = await Promise.all([
      User.findById(currentUserId).select("name avatar").lean(),
      User.findById(otherUserId).select("name avatar").lean(),
    ]);

    if (!otherUser) return res.status(404).json({ msg: "User not found" });

    // Generate stats for a user
    async function getUserStats(userId) {
      const tasks = await Task.find({
        user: userId,
        isDeleted: { $ne: true },
        date: { $gte: since },
      }).lean();

      const total = tasks.length;
      const completed = tasks.filter((t) => t.status === "Complete").length;
      const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

      // By type
      const byType = {};
      tasks.forEach((t) => {
        if (!byType[t.type]) byType[t.type] = { total: 0, completed: 0 };
        byType[t.type].total++;
        if (t.status === "Complete") byType[t.type].completed++;
      });

      // By priority
      const byPriority = {};
      tasks.forEach((t) => {
        if (!byPriority[t.priority]) byPriority[t.priority] = { total: 0, completed: 0 };
        byPriority[t.priority].total++;
        if (t.status === "Complete") byPriority[t.priority].completed++;
      });

      // Daily trend
      const dailyMap = {};
      tasks.forEach((t) => {
        const day = new Date(t.date).toISOString().split("T")[0];
        if (!dailyMap[day]) dailyMap[day] = { date: day, total: 0, completed: 0 };
        dailyMap[day].total++;
        if (t.status === "Complete") dailyMap[day].completed++;
      });

      // Streak
      const allTasks = await Task.find({ user: userId, isDeleted: { $ne: true } }).lean();
      const completedDays = new Set();
      allTasks
        .filter((t) => t.status === "Complete")
        .forEach((t) => completedDays.add(new Date(t.date).toISOString().split("T")[0]));
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (completedDays.has(d.toISOString().split("T")[0])) streak++;
        else break;
      }

      // Day of week
      const dayOfWeekMap = Array(7).fill(0);
      tasks
        .filter((t) => t.status === "Complete")
        .forEach((t) => dayOfWeekMap[new Date(t.date).getDay()]++);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const bestDayIndex = dayOfWeekMap.indexOf(Math.max(...dayOfWeekMap));

      const score =
        completed * 10 +
        streak * 5 +
        (completionRate >= 80 ? 50 : completionRate >= 50 ? 20 : 0);

      return {
        total,
        completed,
        completionRate,
        streak,
        score,
        byType,
        byPriority,
        bestDay: dayOfWeekMap[bestDayIndex] > 0 ? dayNames[bestDayIndex] : null,
        dailyTrend: Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)),
        dayOfWeekBreakdown: dayNames.map((name, i) => ({
          day: name,
          completed: dayOfWeekMap[i],
        })),
      };
    }

    const [myStats, theirStats] = await Promise.all([
      getUserStats(currentUserId),
      getUserStats(otherUserId),
    ]);

    res.json({
      period,
      me: { ...currentUser, ...myStats },
      them: { ...otherUser, ...theirStats },
    });
  } catch (err) {
    console.error("Compare error:", err);
    res.status(500).json({ msg: "Failed to compare users", err: err.message });
  }
};
