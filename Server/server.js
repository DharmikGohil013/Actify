// /server/server.js

require('dotenv').config(); // Load .env first
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const startNotificationCron = require('./middlewares/notificationCron');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send('Actify API is running!');
});

// API endpoint routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/calendar', require('./routes/calendar'));

// Error Handler (should be last)
app.use(errorHandler);

// Start cron jobs for reminders/notifications
startNotificationCron();

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
