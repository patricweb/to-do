import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { telegramAuthMiddleware } from '../middleware/telegramAuth.js';

const router = express.Router();

// Get all tasks for a project
router.get('/projects/:projectId/tasks', telegramAuthMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const tasks = await Task.find({ project: project._id })
      .populate('createdBy', 'username firstName lastName')
      .populate('completedBy', 'username firstName lastName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/projects/:projectId/tasks', telegramAuthMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const task = new Task({
      ...req.body,
      project: project._id,
      createdBy: req.telegramUser.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a task
router.patch('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    });
    
    if (!project) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }
    
    // If task is being marked as completed, set completedBy
    if (req.body.completed !== undefined && req.body.completed !== task.completed) {
      req.body.completedBy = req.body.completed ? req.telegramUser.id : null;
    }
    
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const project = await Project.findOne({
      _id: task.project,
      creator: req.telegramUser.id
    });
    
    if (!project) {
      return res.status(403).json({ error: 'Only project creator can delete tasks' });
    }
    
    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 