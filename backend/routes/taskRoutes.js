import express from 'express';
import Task from '../models/Task.js';
import { validateInitData } from '../utils/validateInitData.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    const { initData, projectId, title, priority, dueDate } = req.body;
    const parsedData = validateInitData(initData, process.env.BOT_TOKEN);
    if (!parsedData)
        return res.status(401).json({ error: 'Invalid initData' });

    const task = new Task({ projectId, title, priority, dueDate });
    await task.save();

    res.json({ success: true });
});

router.post('/', async (req, res) => {
    const { initData, projectId } = req.body;
    const parsedData = validateInitData(initData, process.env.BOT_TOKEN);
    if (!parsedData)
        return res.status(401).json({ error: 'Invalid initData' });

    const tasks = await Task.find({ projectId });
    res.json({ tasks });
});

router.patch('/:id/complete', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ error: 'Task not found' });

        task.completed = !task.completed;
        await task.save();

        res.json({ task });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;