export function getMediaImageUrl(path, size = 'w500') {
  if (!path || path === 'N/A') return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}

export function normalizeMedia(item) {
  if (!item) return null;

  const rawPoster = item.poster_path || item.poster || '';
  const rawBackdrop = item.backdrop_path || item.backdrop || rawPoster;

  const rawRating = item.vote_average || item.score || item.rating || null;
  const rating = rawRating !== null ? parseFloat(rawRating) : null;

  let genres = [];
  if (Array.isArray(item.genres)) {
    genres = item.genres.map(g => typeof g === 'string' ? { name: g } : g);
  } else if (Array.isArray(item.genre_ids)) {
    genres = item.genre_ids.map(id => ({ id, name: '' }));
  }

  const isTV = !!(item.first_air_date || item.name);

  return {
    ...item,
    id: String(item.id || item.tmdbId || Math.random()),
    title: item.title || item.name || 'Untitled',
    original_title: item.original_title || item.original_name || item.title || item.name || '',
    poster_path: getMediaImageUrl(rawPoster, 'w500'),
    backdrop_path: getMediaImageUrl(rawBackdrop, 'original'),
    vote_average: rating !== null && !isNaN(rating) ? rating : null,
    release_date: item.release_date || item.first_air_date || '',
    overview: item.overview || item.synopsis || item.description || '',
    genres,
    runtime: item.runtime ? `${item.runtime} min` : (item.episode_run_time?.[0] ? `${item.episode_run_time[0]} min/ep` : ''),
    category: isTV ? 'TV Show' : 'Movie',
    director: item.director || '',
    trailerKey: item.trailerKey || null,
    cast: item.cast || [],
    isJikan: false,
  };
}
