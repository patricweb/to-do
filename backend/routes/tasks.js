const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { telegramAuthMiddleware } = require('../middleware/telegramAuth');

router.post('/:projectId/tasks', telegramAuthMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, priority = 'medium', dueDate } = req.body;
    const userId = req.userId;

    const task = new Task({ projectId, title, priority, dueDate, userId });
    await task.save();
    console.log('Tasks: Created task:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Tasks: Error creating task:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:projectId/tasks', telegramAuthMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const tasks = await Task.find({ projectId, userId });
    console.log('Tasks: Found tasks:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Tasks: Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:taskId', telegramAuthMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;
    const userId = req.userId;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { completed },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('Tasks: Updated task:', task);
    res.json(task);
  } catch (error) {
    console.error('Tasks: Error updating task:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;