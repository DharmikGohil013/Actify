const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const taskController = require('../controllers/taskController');

// Debug: make sure this logs a function
console.log('GET TASKS:', taskController.getTasks);

// Require auth for all task routes
router.use(requireAuth);

// Routes
router.get('/', taskController.getTasks);
router.post('/', taskController.addTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/toggle', taskController.toggleStatus);

module.exports = router;
