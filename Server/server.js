require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // NEW: Secure headers
const rateLimit = require('express-rate-limit'); // NEW: Prevent brute force
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const startNotificationCron = require('./middlewares/notificationCron');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Support form-data
app.set('trust proxy', 1); // For real IPs behind proxies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
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

// Error Handler
app.use(errorHandler);

// Start Cron
startNotificationCron();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
