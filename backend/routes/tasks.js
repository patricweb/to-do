import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { telegramAuthMiddleware } from '../middleware/telegramAuth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all tasks for a project
router.get('/projects/:projectId/tasks', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('GET /projects/:projectId/tasks: Project ID:', req.params.projectId);
    console.log('GET /projects/:projectId/tasks: User ID:', req.telegramUser.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
      console.log('GET /projects/:projectId/tasks: Invalid project ID');
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    });
    
    if (!project) {
      console.log('GET /projects/:projectId/tasks: Project not found');
      const projectExists = await Project.findById(req.params.projectId);
      console.log('GET /projects/:projectId/tasks: Project exists?', !!projectExists);
      if (projectExists) {
        console.log('GET /projects/:projectId/tasks: Creator:', projectExists.creator);
        console.log('GET /projects/:projectId/tasks: Members:', projectExists.members);
      }
      return res.status(404).json({ error: 'Project not found or access denied' });
    }
    
    const tasks = await Task.find({ project: project._id })
      .populate('createdBy', 'username firstName lastName')
      .populate('completedBy', 'username firstName lastName');
    console.log('GET /projects/:projectId/tasks: Found tasks:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('GET /projects/:projectId/tasks: Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/projects/:projectId/tasks', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('POST /projects/:projectId/tasks: Project ID:', req.params.projectId);
    console.log('POST /projects/:projectId/tasks: Request body:', req.body);
    console.log('POST /projects/:projectId/tasks: User ID:', req.telegramUser.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
      console.log('POST /projects/:projectId/tasks: Invalid project ID');
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    });
    
    if (!project) {
      console.log('POST /projects/:projectId/tasks: Project not found');
      return res.status(404).json({ error: 'Project not found or access denied' });
    }
    
    const task = new Task({
      ...req.body,
      project: project._id,
      createdBy: req.telegramUser.id
    });
    await task.save();
    console.log('POST /projects/:projectId/tasks: Task created:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('POST /projects/:projectId/tasks: Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a task
router.patch('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('PATCH /tasks/:id: Task ID:', req.params.id);
    console.log('PATCH /tasks/:id: User ID:', req.telegramUser.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('PATCH /tasks/:id: Invalid task ID');
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      console.log('PATCH /tasks/:id: Task not found');
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
      console.log('PATCH /tasks/:id: Not authorized');
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }
    
    if (req.body.completed !== undefined && req.body.completed !== task.completed) {
      req.body.completedBy = req.body.completed ? req.telegramUser.id : null;
    }
    
    Object.assign(task, req.body);
    await task.save();
    console.log('PATCH /tasks/:id: Task updated:', task);
    res.json(task);
  } catch (error) {
    console.error('PATCH /tasks/:id: Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('DELETE /tasks/:id: Task ID:', req.params.id);
    console.log('DELETE /tasks/:id: User ID:', req.telegramUser.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('DELETE /tasks/:id: Invalid task ID');
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      console.log('DELETE /tasks/:id: Task not found');
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const project = await Project.findOne({
      _id: task.project,
      creator: req.telegramUser.id
    });
    
    if (!project) {
      console.log('DELETE /tasks/:id: Not authorized');
      return res.status(403).json({ error: 'Only project creator can delete tasks' });
    }
    
    await task.deleteOne();
    console.log('DELETE /tasks/:id: Task deleted successfully');
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DELETE /tasks/:id: Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;