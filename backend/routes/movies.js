const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '5208094dcf313d93dd5f1f3acd69cced';

const serverCache = new Map();
const SERVER_CACHE_TTL = 15 * 60 * 1000; // 15 mins

function getCached(key) {
  const hit = serverCache.get(key);
  if (hit && Date.now() - hit.time < SERVER_CACHE_TTL) {
    return hit.data;
  }
  return null;
}

function setCached(key, data) {
  serverCache.set(key, { data, time: Date.now() });
}

function sendCachedJson(res, data) {
  res.set('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400');
  res.json(data);
}

function normalizeItem(item) {
  return {
    ...item,
    id: String(item.id),
    title: item.title || item.name || 'Untitled',
    original_title: item.original_title || item.original_name || item.title || item.name || '',
    release_date: item.release_date || item.first_air_date || '',
    vote_average: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.0,
    media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie'),
  };
}

// GET /api/movies/trending (public)
router.get('/trending', async (req, res, next) => {
  try {
    const cached = getCached('trending');
    if (cached) return sendCachedJson(res, cached);

    const { data } = await axios.get(`${TMDB_BASE}/trending/all/week`, {
      params: { api_key: API_KEY },
      timeout: 6000,
    });
    const results = (data.results || []).map(normalizeItem);
    const payload = { ...data, results };
    setCached('trending', payload);
    sendCachedJson(res, payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/category/:key (public) - Dedicated Netflix rows
router.get('/category/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const cacheKey = `category:${key}`;
    const cached = getCached(cacheKey);
    if (cached) return sendCachedJson(res, cached);

    let endpoint = `${TMDB_BASE}/discover/movie`;
    let params = { api_key: API_KEY, sort_by: 'popularity.desc' };

    switch (key) {
      case 'trending':
        endpoint = `${TMDB_BASE}/trending/all/week`;
        params = { api_key: API_KEY };
        break;
      case 'top-10':
        endpoint = `${TMDB_BASE}/trending/all/day`;
        params = { api_key: API_KEY };
        break;
      case 'popular-movies':
        endpoint = `${TMDB_BASE}/movie/popular`;
        break;
      case 'top-movies':
        endpoint = `${TMDB_BASE}/movie/top_rated`;
        break;
      case 'action':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 28;
        break;
      case 'scifi':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 878;
        break;
      case 'comedy':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 35;
        break;
      case 'horror':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 27;
        break;
      case 'thriller':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 53;
        break;
      case 'romance':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 10749;
        break;
      case 'popular-tv':
      case 'trending-tv':
        endpoint = `${TMDB_BASE}/tv/popular`;
        break;
      case 'top-tv':
        endpoint = `${TMDB_BASE}/tv/top_rated`;
        break;
      case 'kdrama':
        endpoint = `${TMDB_BASE}/discover/tv`;
        params.with_original_language = 'ko';
        break;
      case 'trending-anime':
        endpoint = `${TMDB_BASE}/discover/tv`;
        params.with_genres = 16;
        params.with_original_language = 'ja';
        params.sort_by = 'popularity.desc';
        break;
      case 'top-anime':
        endpoint = `${TMDB_BASE}/discover/tv`;
        params.with_genres = 16;
        params.with_original_language = 'ja';
        params.sort_by = 'vote_average.desc';
        params['vote_count.gte'] = 250;
        break;
      case 'anime-movies':
        endpoint = `${TMDB_BASE}/discover/movie`;
        params.with_genres = 16;
        params.with_original_language = 'ja';
        break;
      default:
        endpoint = `${TMDB_BASE}/discover/movie`;
    }

    const { data } = await axios.get(endpoint, { params, timeout: 6000 });
    const results = (data.results || []).map(normalizeItem);
    const payload = { ...data, results };
    setCached(cacheKey, payload);
    sendCachedJson(res, payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/search?q=... (public)
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) return res.json({ results: [] });
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return sendCachedJson(res, cached);

    const { data } = await axios.get(`${TMDB_BASE}/search/multi`, {
      params: { query, api_key: API_KEY },
      timeout: 6000,
    });
    const results = (data.results || []).filter(i => i.backdrop_path || i.poster_path).map(normalizeItem);
    const payload = { ...data, results };
    setCached(cacheKey, payload);
    sendCachedJson(res, payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/discover?vertical=movies|series|anime (public)
router.get('/discover', async (req, res, next) => {
  try {
    const vertical = req.query.vertical || 'movies';
    const cacheKey = `discover:${vertical}`;
    const cached = getCached(cacheKey);
    if (cached) return sendCachedJson(res, cached);

    let endpoint;
    let params = { api_key: API_KEY, sort_by: 'popularity.desc' };

    if (vertical === 'movies') {
      endpoint = `${TMDB_BASE}/discover/movie`;
    } else if (vertical === 'series') {
      endpoint = `${TMDB_BASE}/discover/tv`;
    } else if (vertical === 'anime') {
      endpoint = `${TMDB_BASE}/discover/tv`;
      params.with_genres = 16;
      params.with_original_language = 'ja';
    } else {
      endpoint = `${TMDB_BASE}/discover/movie`;
    }

    const { data } = await axios.get(endpoint, { params, timeout: 6000 });
    const results = (data.results || []).map(normalizeItem);
    const payload = { ...data, results };
    setCached(cacheKey, payload);
    sendCachedJson(res, payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/:tmdbId (public)
router.get('/:tmdbId', async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    const cacheKey = `movie:${tmdbId}`;
    const cached = getCached(cacheKey);
    if (cached) return sendCachedJson(res, cached);

    let data;

    try {
      const response = await axios.get(`${TMDB_BASE}/movie/${tmdbId}`, {
        params: { api_key: API_KEY, append_to_response: 'videos,credits,similar' },
        timeout: 6000,
      });
      data = response.data;
    } catch (movieErr) {
      // Fallback to TV show
      const response = await axios.get(`${TMDB_BASE}/tv/${tmdbId}`, {
        params: { api_key: API_KEY, append_to_response: 'videos,credits,similar' },
        timeout: 6000,
      });
      data = response.data;
    }

    const trailerKey =
      (data.videos && data.videos.results
        ? (data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
           data.videos.results.find(v => v.site === 'YouTube'))
        : null
      )?.key || null;

    const cast = data.credits && data.credits.cast
      ? data.credits.cast.slice(0, 10).map(c => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
        }))
      : [];

    const director = data.credits && data.credits.crew
      ? (data.credits.crew.find(c => c.job === 'Director')?.name || data.created_by?.[0]?.name || '')
      : (data.created_by?.[0]?.name || '');

    const similar = data.similar && data.similar.results
      ? data.similar.results.slice(0, 6).map(normalizeItem)
      : [];

    const payload = {
      ...normalizeItem(data),
      trailerKey,
      cast,
      director,
      similar,
    };
    setCached(cacheKey, payload);
    sendCachedJson(res, payload);
  } catch (err) {
    next(err);
  }
});
      cast,
      director,
      similar,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
