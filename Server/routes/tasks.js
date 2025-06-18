// /routes/tasks.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const taskController = require('../controllers/taskController');

// All routes below require authentication
router.use(requireAuth);

// Get all tasks (with optional filters)
router.get('/', taskController.getTasks);

// Add a new task
router.post('/', taskController.addTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Toggle complete/incomplete
router.patch('/:id/toggle', taskController.toggleStatus);

module.exports = router;
