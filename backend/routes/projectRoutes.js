import express from 'express';
import Project from '../models/Project.js';
import { validateInitData } from '../utils/validateInitData.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/create', async (req, res) => {
    const { initdata, name } = req.body;
    const parsedData = validateInitData(initdata, process.env.BOT_TOKEN);
    if (!parsedData)
        return res.status(401).json({ error: 'Invalid initData' });

    const project = new Project({
        userId: parsedData.user.id,
        name,
        accessToken: crypto.randomBytes(8).toString('hex'),
    });
    await project.save();

    res.json({ project });
});

router.post('/token/:token', async (req, res) => {
    const project = await Project.findOne({ shareToken: req.params.token });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
});

router.post('/', async (req, res) => {
    const { initData } = req.body;
    const parsedData = validateInitData(initData, process.env.BOT_TOKEN);
    if (!parsedData)
        return res.status(401).json({ error: 'Invalid initData' });

    const projects = await Project.find({ userId: parsedData.user.id });
    res.json({ projects });
});

router.post('/share/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const shareToken = crypto.randomBytes(16).toString('hex');
        project.shareToken = shareToken;
        await project.save();

        res.json({ shareToken });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;