const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { telegramAuthMiddleware } = require('../middleware/telegramAuth');

router.get('/', telegramAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({ userId });
    console.log('Projects: Found projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Projects: Error fetching projects:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', telegramAuthMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;
    const project = new Project({ title, description, userId, shareToken: require('nanoid').nanoid(10) });
    await project.save();
    console.log('Projects: Created project:', project);
    res.status(201).json(project);
  } catch (error) {
    console.error('Projects: Error creating project:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/shared/:token', telegramAuthMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const project = await Project.findOne({ shareToken: token });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.log('Projects: Found shared project:', project);
    res.json(project);
  } catch (error) {
    console.error('Projects: Error fetching shared project:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;