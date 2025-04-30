import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { telegramAuthMiddleware } from '../middleware/telegramAuth.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// Get all projects for the current user
router.get('/', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('User ID:', req.telegramUser.id);
    console.log('Finding projects...');
    
    const projects = await Project.find({
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    }).populate('creator', 'username firstName lastName');
    
    console.log('Found projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Error in GET /projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new project
router.post('/', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      creator: req.telegramUser.id,
      shareToken: nanoid(10)
    });
    await project.save();
    console.log('Project created:', project);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error in POST /projects:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get a specific project
router.get('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('Getting project with ID:', req.params.id);
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { creator: req.telegramUser.id },
        { members: req.telegramUser.id }
      ]
    }).populate('creator', 'username firstName lastName');
    
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Found project:', project);
    res.json(project);
  } catch (error) {
    console.error('Error in GET /projects/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a project
router.patch('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('Updating project with ID:', req.params.id);
    const project = await Project.findOne({
      _id: req.params.id,
      creator: req.telegramUser.id
    });
    
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    Object.assign(project, req.body);
    await project.save();
    console.log('Project updated:', project);
    res.json(project);
  } catch (error) {
    console.error('Error in PATCH /projects/:id:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', telegramAuthMiddleware, async (req, res) => {
  try {
    console.log('Deleting project with ID:', req.params.id);
    const project = await Project.findOne({
      _id: req.params.id,
      creator: req.telegramUser.id
    });
    
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: project._id });
    await project.remove();
    console.log('Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /projects/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get project by share token
router.get('/shared/:token', telegramAuthMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({ shareToken: req.params.token });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Add user to project members if not already a member
    if (!project.members.includes(req.telegramUser.id)) {
      project.members.push(req.telegramUser.id);
      await project.save();
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 