import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/settings — Get user settings
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('settings username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      settings: user.settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/settings — Update user settings
router.put('/', async (req, res) => {
  try {
    const allowedFields = [
      'activeTheme', 'clockFormat', 'quoteCategory', 'alertSound',
      'focusDuration', 'breakDuration', 'longBreakDuration', 'musicUrl'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[`settings.${field}`] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid settings to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('settings username');

    res.json({
      username: user.username,
      settings: user.settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
