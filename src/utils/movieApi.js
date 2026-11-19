const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getToken() {
  return localStorage.getItem('moviesmax-token');
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchTrendingMovies() {
  try {
    const res = await fetch(`${BASE}/movies/trending`);
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error('fetchTrendingMovies error:', e);
    return [];
  }
}

export async function fetchMoviesByVertical(vertical) {
  try {
    const res = await fetch(`${BASE}/movies/discover?vertical=${vertical}`);
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error('fetchMoviesByVertical error:', e);
    return [];
  }
}

export async function fetchMoviesByCategory(categoryName) {
  try {
    const cat = (categoryName || '').toLowerCase();
    const vertical = cat.includes('anime')
      ? 'anime'
      : cat.includes('series') || cat.includes('tv') || cat.includes('drama')
      ? 'series'
      : 'movies';
    const res = await fetch(`${BASE}/movies/discover?vertical=${vertical}`);
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error('fetchMoviesByCategory error:', e);
    return [];
  }
}

export async function searchMovies(query) {
  try {
    const res = await fetch(`${BASE}/movies/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error('searchMovies error:', e);
    return [];
  }
}

export async function fetchMovieDetails(tmdbId) {
  try {
    const res = await fetch(`${BASE}/movies/${tmdbId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('fetchMovieDetails error:', e);
    return null;
  }
}

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function fetchMe() {
  try {
    const res = await fetch(`${BASE}/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (e) {
    return null;
  }
}

export async function fetchPlaylists() {
  try {
    const res = await fetch(`${BASE}/playlists`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.playlists || [];
  } catch (e) {
    return [];
  }
}

export async function createPlaylist({ name, description }) {
  const res = await fetch(`${BASE}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ name, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create playlist');
  return data.playlist;
}

export async function deletePlaylist(playlistId) {
  const res = await fetch(`${BASE}/playlists/${playlistId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.message);
  }
}

export async function addMovieToPlaylist(playlistId, movieData) {
  const res = await fetch(`${BASE}/playlists/${playlistId}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(movieData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add movie');
  return data.playlist;
}

export async function removeMovieFromPlaylist(playlistId, tmdbId) {
  const res = await fetch(`${BASE}/playlists/${playlistId}/movies/${tmdbId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.message);
  }
}


