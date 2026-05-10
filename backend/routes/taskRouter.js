const express = require('express');
const {addTask, getTasks, updateTask, deleteTask} = require('../controllers/taskControllers');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// This line protects ALL routes below it
router.use(requireAuth);

// Get all tasks
router.get('/', getTasks);

// Add new task
router.post('/', addTask);

// Update task time/status
router.patch('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

module.exports = router;
