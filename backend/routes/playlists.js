const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');

// GET /api/playlists (protected)
router.get('/', auth, async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id }).sort({ isDefault: -1, createdAt: 1 });
    res.json({ playlists });
  } catch (err) {
    next(err);
  }
});

// POST /api/playlists (protected)
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const playlist = await Playlist.create({
      userId: req.user.id,
      name,
      description: description || '',
    });
    res.status(201).json({ playlist });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/playlists/:id (protected)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (playlist.isDefault) {
      return res.status(400).json({ message: 'Cannot delete your default watchlist' });
    }
    await playlist.deleteOne();
    res.status(200).json({ message: 'Playlist deleted' });
  } catch (err) {
    next(err);
  }
});

// POST /api/playlists/:id/movies (protected)
router.post('/:id/movies', auth, async (req, res, next) => {
  try {
    const { tmdbId, title, poster_path, backdrop_path, overview, vote_average, release_date, genres, runtime } = req.body;

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const alreadyExists = playlist.movies.some(m => m.tmdbId === String(tmdbId));
    if (alreadyExists) {
      return res.status(409).json({ message: 'Movie already in playlist' });
    }

    playlist.movies.push({
      tmdbId: String(tmdbId),
      title,
      poster_path,
      backdrop_path,
      overview,
      vote_average,
      release_date,
      genres,
      runtime,
    });
    await playlist.save();

    res.status(201).json({ playlist });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/playlists/:id/movies/:tmdbId (protected)
router.delete('/:id/movies/:tmdbId', auth, async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    playlist.movies = playlist.movies.filter(m => m.tmdbId !== req.params.tmdbId);
    await playlist.save();

    res.status(200).json({ message: 'Movie removed from playlist', playlist });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
