const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { authenticate } = require('./telegramAuth');

router.get('/', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'];
  console.log('Projects: Received initData from header:', initData);

  const userId = await authenticate(initData);
  if (!userId) {
    console.error('Projects: Authentication failed');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const projects = await Project.find({ userId });
    console.log('Projects: Found projects:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Projects: Error fetching projects:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Остальные роуты (createProject, etc.) аналогично обновлены
router.post('/', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'];
  console.log('Projects: Received initData for create:', initData);

  const userId = await authenticate(initData);
  if (!userId) {
    console.error('Projects: Authentication failed for create');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, description } = req.body;
    const project = new Project({ title, description, userId, shareToken: require('nanoid').nanoid(10) });
    await project.save();
    console.log('Projects: Created project:', project);
    res.status(201).json(project);
  } catch (error) {
    console.error('Projects: Error creating project:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;