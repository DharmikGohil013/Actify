const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const taskController = require('../controllers/taskController');

router.use(requireAuth);

// CRUD
router.get('/', taskController.getTasks);
router.post('/', taskController.addTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Status + Restore
router.patch('/:id/toggle', taskController.toggleStatus);
router.patch('/:id/restore', taskController.restoreDeletedTask); // NEW

// Filters
router.get('/today', taskController.getTodayTasks); // NEW
router.get('/upcoming', taskController.getUpcomingTasks); // NEW
router.get('/tag/:tag', taskController.getTasksByTag); // NEW
router.get('/label/:label', taskController.getTasksByLabel); // NEW

// Sub-tasks
router.get('/:id/subtasks', taskController.getSubTasks); // NEW
router.post('/:id/subtasks', taskController.addSubTask); // NEW

module.exports = router;
