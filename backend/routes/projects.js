import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { telegramAuthMiddleware } from '../middleware/telegramAuth.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// Get all projects for the current user
router.get('/', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('GET /projects: User ID:', req.telegramUser.id);
    const projects = await Project.find({
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    }).populate('creator', 'username firstName lastName');
    console.log('GET /projects: Found projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('GET /projects: Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new project
router.post('/', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('POST /projects: Request body:', req.body);
    console.log('POST /projects: User:', req.telegramUser);
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      creator: req.telegramUser.id,
      shareToken: nanoid(10)
    });
    await project.save();
    console.log('POST /projects: Project created:', project);
    res.status(201).json(project);
  } catch (error) {
    console.error('POST /projects: Error:', error);
    res.status(400).json({ error: `Failed to create project: ${error.message}` });
  }
});

// Get a specific project
router.get('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('GET /projects/:id: Project ID:', req.params.id);
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    }).populate('creator', 'username firstName lastName');
    
    if (!project) {
      console.log('GET /projects/:id: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('GET /projects/:id: Found project:', project);
    res.json(project);
  } catch (error) {
    console.error('GET /projects/:id: Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a project
router.patch('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('PATCH /projects/:id: Project ID:', req.params.id);
    const project = await Project.findOne({
      _id: req.params.id,
      creator: req.telegramUser.id
    });
    
    if (!project) {
      console.log('PATCH /projects/:id: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    Object.assign(project, req.body);
    await project.save();
    console.log('PATCH /projects/:id: Project updated:', project);
    res.json(project);
  } catch (error) {
    console.error('PATCH /projects/:id: Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('DELETE /projects/:id: Project ID:', req.params.id);
    const project = await Project.findOne({
      _id: req.params.id,
      creator: req.telegramUser.id
    });
    
    if (!project) {
      console.log('DELETE /projects/:id: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    console.log('DELETE /projects/:id: Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE /projects/:id: Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get project by share token
router.get('/shared/:token', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('GET /shared/:token: Token:', req.params.token);
    const project = await Project.findOne({ shareToken: req.params.token });
    
    if (!project) {
      console.log('GET /shared/:token: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.members.includes(req.telegramUser.id)) {
      project.members.push(req.telegramUser.id);
      await project.save();
      console.log('GET /shared/:token: User added to members');
    }
    
    console.log('GET /shared/:token: Found project:', project);
    res.json(project);
  } catch (error) {
    console.error('GET /shared/:token: Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;