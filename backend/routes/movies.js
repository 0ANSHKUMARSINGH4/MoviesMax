const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '5208094dcf313d93dd5f1f3acd69cced';

// GET /api/movies/trending (public)
// IMPORTANT: static routes must come before /:tmdbId
router.get('/trending', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/trending/movie/week`, {
      params: { api_key: API_KEY },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/search?q=... (public)
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const { data } = await axios.get(`${TMDB_BASE}/search/multi`, {
      params: { query, api_key: API_KEY },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/discover?vertical=movies|series|anime (public)
router.get('/discover', async (req, res, next) => {
  try {
    const vertical = req.query.vertical || 'movies';
    let endpoint;
    let params = { api_key: API_KEY, sort_by: 'popularity.desc' };

    if (vertical === 'movies') {
      endpoint = `${TMDB_BASE}/discover/movie`;
    } else if (vertical === 'series') {
      endpoint = `${TMDB_BASE}/discover/tv`;
    } else if (vertical === 'anime') {
      endpoint = `${TMDB_BASE}/discover/tv`;
      params.with_genres = 16;
    } else {
      endpoint = `${TMDB_BASE}/discover/movie`;
    }

    const { data } = await axios.get(endpoint, { params });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/:tmdbId (public)
// MUST be defined AFTER the static routes above
router.get('/:tmdbId', async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    let data;

    try {
      const response = await axios.get(`${TMDB_BASE}/movie/${tmdbId}`, {
        params: { api_key: API_KEY, append_to_response: 'videos,credits' },
      });
      data = response.data;
    } catch (movieErr) {
      // Fallback to TV
      const response = await axios.get(`${TMDB_BASE}/tv/${tmdbId}`, {
        params: { api_key: API_KEY, append_to_response: 'videos,credits' },
      });
      data = response.data;
    }

    const trailerKey =
      (data.videos && data.videos.results
        ? data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
        : null
      )?.key || null;

    const cast = data.credits && data.credits.cast ? data.credits.cast.slice(0, 10) : [];

    res.json({ ...data, trailerKey, cast });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
