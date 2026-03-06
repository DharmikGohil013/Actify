require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const startNotificationCron = require('./middlewares/notificationCron');
const startDailyReminderCron = require('./middlewares/dailyReminderCron');
const extra = require('./routes/extra');
const app = express();

// DB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Actify API is running!');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/extra', require('./routes/extra'));


// Catch unknown routes
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handling
app.use(errorHandler);

// Cron Jobs
startNotificationCron();
startDailyReminderCron();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
