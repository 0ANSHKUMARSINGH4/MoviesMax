const TMDB_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

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
    genres = item.genres
      .map(g => {
        if (typeof g === 'string') return { name: g };
        if (g && typeof g === 'object') return { id: g.id, name: g.name || (g.id ? TMDB_GENRES[g.id] : '') || '' };
        return null;
      })
      .filter(g => g && g.name);
  } else if (Array.isArray(item.genre_ids)) {
    genres = item.genre_ids
      .map(id => ({ id, name: TMDB_GENRES[id] || '' }))
      .filter(g => g.name);
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
