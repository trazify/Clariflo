import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (global.isMockDB) {
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      global.mockUsers = global.mockUsers || [];
      const existingUser = global.mockUsers.find(u => u.username === username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      const mockId = Math.random().toString(36).substring(2, 11);
      const newUser = {
        _id: mockId,
        username: username.toLowerCase(),
        password: password,
        settings: {
          activeTheme: 'aurora-mesh',
          clockFormat: '12h',
          quoteCategory: 'all',
          alertSound: 'chime',
          focusDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          musicUrl: ''
        }
      };
      global.mockUsers.push(newUser);
      const token = jwt.sign({ userId: mockId }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.status(201).json({
        token,
        user: {
          id: mockId,
          username: newUser.username,
          settings: newUser.settings
        }
      });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (global.isMockDB) {
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      global.mockUsers = global.mockUsers || [];
      const user = global.mockUsers.find(u => u.username === username.toLowerCase());
      if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          settings: user.settings
        }
      });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
