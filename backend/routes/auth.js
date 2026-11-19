const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 3, max: 30 }).withMessage('Name must be 3-30 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const user = new User({ name, email, password });
      await user.save();

      // Create default watchlist
      await Playlist.create({
        userId: user._id,
        name: 'My Watchlist',
        isDefault: true,
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me (protected)
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
