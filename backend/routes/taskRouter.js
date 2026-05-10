const express = require('express');
const {addTask, getTasks, updateTask, deleteTask} = require('../controllers/taskControllers');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// This line protects ALL routes below it
// router.use(requireAuth);

// Get all tasks
router.get('/', requireAuth, getTasks);

// Add new task
router.post('/', requireAuth, addTask);

// Update task time/status
router.patch('/:id', requireAuth, updateTask);

// Delete task
router.delete('/:id', requireAuth, deleteTask);

module.exports = router;
