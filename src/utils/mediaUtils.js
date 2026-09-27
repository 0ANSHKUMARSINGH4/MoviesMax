/**
 * Standardizes media items from TMDB, OMDb, Jikan, curated decks, and Watchlists
 * into a single unified schema so card hovers and modal pop-ups are 100% consistent.
 */

export function getMediaImageUrl(path, size = "w500") {
  if (!path || path === "N/A" || path === "/placeholder.png") {
    return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}

export function normalizeMedia(item) {
  if (!item) return null;

  const rawPoster =
    item.poster_path ||
    item.poster ||
    item.Poster ||
    (item.images?.jpg?.large_image_url) ||
    "";

  const rawBackdrop =
    item.backdrop_path ||
    item.backdrop ||
    rawPoster;

  const rawRating = item.vote_average || item.score || item.imdbRating || item.rating || 8.4;
  const rating = parseFloat(rawRating);

  const releaseYear = String(
    item.release_date || item.first_air_date || item.Year || item.year || "2024"
  ).slice(0, 4);

  // Normalize genres array
  let genres = [];
  if (Array.isArray(item.genres)) {
    genres = item.genres.map((g) => (typeof g === "string" ? { name: g } : g));
  } else if (typeof item.genre === "string") {
    genres = item.genre.split(", ").map((g) => ({ name: g }));
  } else if (typeof item.Genre === "string") {
    genres = item.Genre.split(", ").map((g) => ({ name: g }));
  } else {
    genres = [{ name: "Drama" }, { name: "Sci-Fi" }];
  }

  return {
    ...item,
    id: String(item.id || item.imdbID || item.mal_id || item.title || Math.random()),
    title: item.title || item.name || item.Title || "Featured Title",
    original_title: item.original_title || item.title_japanese || item.title || item.name || "",
    poster_path: getMediaImageUrl(rawPoster, "w500"),
    backdrop_path: getMediaImageUrl(rawBackdrop, "original"),
    vote_average: isNaN(rating) ? null : rating,
    release_date: item.release_date || item.first_air_date || item.Year || item.year || "",
    overview:
      item.overview ||
      item.synopsis ||
      item.Plot ||
      item.description ||
      "",
    genres,
    runtime: item.runtime || item.Runtime || item.meta || "",
    isJikan: !!(item.isJikan || item.mal_id),
    category:
      item.category ||
      (item.isJikan ? "Anime" : item.first_air_date || item.seasons ? "TV Show" : "Movie"),
    director: item.director || item.Director || "",
    country: item.country || item.Country || item.Language || "",
  };
}
