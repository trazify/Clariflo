import express from 'express';
import Stat from '../models/Stat.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/stats — Get all stat entries for the user
router.get('/', async (req, res) => {
  try {
    const stats = await Stat.find({ userId: req.userId }).sort({ date: -1 }).limit(30);
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/stats/session — Record a completed focus session
router.post('/session', async (req, res) => {
  try {
    const { minutes } = req.body;
    const todayStr = new Date().toLocaleDateString();

    // Upsert: create or update today's stat
    const stat = await Stat.findOneAndUpdate(
      { userId: req.userId, date: todayStr },
      {
        $inc: { sessions: 1, focusMinutes: minutes || 0 },
        $setOnInsert: { userId: req.userId, date: todayStr }
      },
      { upsert: true, new: true }
    );

    res.json(stat);
  } catch (error) {
    console.error('Record session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/stats/task-completed — Increment tasks completed for today
router.post('/task-completed', async (req, res) => {
  try {
    const todayStr = new Date().toLocaleDateString();

    const stat = await Stat.findOneAndUpdate(
      { userId: req.userId, date: todayStr },
      {
        $inc: { tasksCompleted: 1 },
        $setOnInsert: { userId: req.userId, date: todayStr }
      },
      { upsert: true, new: true }
    );

    res.json(stat);
  } catch (error) {
    console.error('Task completed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
