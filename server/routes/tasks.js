import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/tasks — Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks — Create a new task
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Task text is required' });
    }

    // Get current max order
    const maxOrderTask = await Task.findOne({ userId: req.userId }).sort({ order: -1 });
    const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = await Task.create({
      userId: req.userId,
      text: text.trim(),
      order
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id — Update a task (toggle done, edit text)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.text !== undefined) task.text = req.body.text;
    if (req.body.done !== undefined) task.done = req.body.done;
    if (req.body.order !== undefined) task.order = req.body.order;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/reorder — Bulk update task order
router.put('/reorder/bulk', async (req, res) => {
  try {
    const { tasks } = req.body; // [{ id, order }]

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks array is required' });
    }

    const operations = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id, userId: req.userId },
        update: { order: t.order }
      }
    }));

    await Task.bulkWrite(operations);
    res.json({ message: 'Tasks reordered' });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
