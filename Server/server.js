// /server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Loads .env

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// TODO: Add your route imports here, e.g.
// const taskRoutes = require('./routes/tasks');
// app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
