const Task = require('../models/taskModel');

// @desc    Get all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find({ user_id: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

// @desc    Add new task
// @route   POST /api/tasks
const addTask = async (req, res) => {
  try {
    // This line is what talks to MongoDB
    const task = await Task.create({
      user_id: req.user._id, // This is how we associate the task with the user
      name: req.body.name,
      completedTime: req.body.completedTime || 0,
      completed: req.body.completed || false,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// @desc    Update task
// @route   PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id }, // Ensure the task belongs to the authenticated user
      { completedTime: req.body.completedTime, completed: req.body.completed },
      { returnDocument: 'after' }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id // Ensure the task belongs to the authenticated user
  });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.status(200).json({ message: "Task deleted" });
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
