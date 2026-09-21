import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { CATEGORY_CATALOG, TOP10_DATA } from "./movieData";

// Read API keys from Vite environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// Initialize Google Generative AI client if key is available
let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (e) {
    console.error("Error initializing Gemini API:", e);
  }
}

// Fallback lists of movies in case the Gemini API fails or limits are exceeded
const FALLBACK_MOVIES = {
  trending: ["Inception", "Interstellar", "The Dark Knight", "Avatar", "Gladiator"],
  action: ["The Dark Knight", "Mad Max: Fury Road", "John Wick", "Gladiator", "The Matrix", "Die Hard", "Terminator 2", "Mission Impossible Fallout"],
  comedy: ["The Hangover", "Superbad", "Step Brothers", "Dumb and Dumber", "Anchorman", "Free Guy", "Deadpool", "Game Night"],
  scifi: ["Interstellar", "Inception", "The Matrix", "Blade Runner 2049", "Arrival", "Dune", "Avatar", "Gravity"],
  horror: ["The Conjuring", "Hereditary", "Get Out", "A Quiet Place", "It", "The Shining", "The Ring", "Halloween"],
  top_rated: ["The Shawshank Redemption", "The Godfather", "The Dark Knight", "Pulp Fiction", "Forrest Gump", "Schindler's List", "Fight Club", "Inception"],
  romance: ["The Notebook", "La La Land", "Titanic", "About Time", "Before Sunrise", "Pride and Prejudice", "500 Days of Summer", "Crazy Rich Asians"]
};

// Helper function to query OMDb for a single movie's details
export async function fetchMovieDetailsFromOMDb(title) {
  if (!OMDB_API_KEY) {
    console.error("OMDb API Key is missing.");
    return null;
  }
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        t: title,
        apikey: OMDB_API_KEY,
        plot: "short"
      }
    });

    if (response.data && response.data.Response === "True") {
      const data = response.data;
      // Standardize the object to match TMDB model properties used in UI
      return {
        id: data.imdbID,
        title: data.Title,
        overview: data.Plot,
        poster_path: data.Poster !== "N/A" ? data.Poster : "/placeholder.png",
        backdrop_path: data.Poster !== "N/A" ? data.Poster : "/placeholder.png", // Fallback to poster
        vote_average: parseFloat(data.imdbRating) || 0.0,
        release_date: data.Released || data.Year,
        genre: data.Genre,
        director: data.Director,
        actors: data.Actors,
        runtime: data.Runtime,
        language: data.Language,
        isOMDb: true
      };
    }
    return null;
  } catch (error) {
    console.error(`Error resolving OMDb data for title "${title}":`, error);
    return null;
  }
}

// 1. Fetch Trending Movies (Instant verified high-speed fallback + optional dynamic enrichment)
export async function fetchTrendingMovies() {
  return TOP10_DATA.movies;
}

// 2. Fetch Category Movies (Instant 0ms lookup from verified catalog)
export async function fetchMoviesByCategory(categoryName) {
  if (!categoryName) return TOP10_DATA.movies;
  
  const normalized = categoryName.toLowerCase().trim();
  
  // Direct lookup
  if (CATEGORY_CATALOG[normalized]) {
    return CATEGORY_CATALOG[normalized];
  }
  
  // Partial / fuzzy match
  for (const [key, list] of Object.entries(CATEGORY_CATALOG)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return list;
    }
  }

  // Keywords detection
  if (normalized.includes("action")) return CATEGORY_CATALOG["action thrillers"];
  if (normalized.includes("sci-fi") || normalized.includes("cyberpunk") || normalized.includes("scifi")) return CATEGORY_CATALOG["sci-fi & cyberpunk"];
  if (normalized.includes("comedy")) return CATEGORY_CATALOG["comedy hits"];
  if (normalized.includes("korean") || normalized.includes("kdrama") || normalized.includes("k-drama")) return CATEGORY_CATALOG["korean dramas (k-dramas)"];
  if (normalized.includes("western") || normalized.includes("prestige")) return CATEGORY_CATALOG["western prestige tv"];
  if (normalized.includes("crime") || normalized.includes("mystery")) return CATEGORY_CATALOG["crime & mystery thrillers"];
  if (normalized.includes("top rated") || normalized.includes("classic")) return CATEGORY_CATALOG["top rated classics"];
  if (normalized.includes("blockbuster") || normalized.includes("trending")) return CATEGORY_CATALOG["trending blockbusters"];

  return CATEGORY_CATALOG["trending blockbusters"] || TOP10_DATA.movies;
}

// 3. Search Movies (Direct OMDb search query)
export async function searchMoviesFromOMDb(query) {
  if (!OMDB_API_KEY) {
    console.error("OMDb API Key is missing.");
    return [];
  }
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        s: query,
        apikey: OMDB_API_KEY,
        type: "movie"
      }
    });

    if (response.data && response.data.Response === "True") {
      // Map OMDb search items to standardized UI format
      return response.data.Search.map(movie => ({
        id: movie.imdbID,
        title: movie.Title,
        poster_path: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png",
        backdrop_path: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png",
        release_date: movie.Year,
        isOMDb: true
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error querying OMDb search for "${query}":`, error);
    return [];
  }
}

// 4. Fetch Detailed Movie Info (OMDb details + Gemini YouTube trailer lookup)
export async function fetchDetailedMovieInfo(title) {
  const movieDetails = await fetchMovieDetailsFromOMDb(title);
  if (!movieDetails) return null;

  let videoKey = null;
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Search your database and return the official YouTube trailer video ID for the movie "${title}" (${movieDetails.release_date}).
        Return ONLY the 11-character video ID string (e.g., d9MyW72ELq0) and absolutely nothing else. If you do not know the exact trailer ID, return "null".
      `;
      const result = await model.generateContent(prompt);
      const resText = result.response.text().trim();
      // Validate length to make sure it's a standard YouTube video ID
      if (resText && resText !== "null" && resText.length === 11) {
        videoKey = resText;
      }
    } catch (e) {
      console.warn("Failed to get trailer ID from Gemini:", e);
    }
  }

  const genresList = movieDetails.genre
    ? movieDetails.genre.split(", ").map((g, index) => ({ id: index, name: g }))
    : [];

  const castList = movieDetails.actors
    ? movieDetails.actors.split(", ").map((name, index) => ({
        id: index,
        name,
        character: "Starring",
        profile_path: null
      }))
    : [];

  return {
    details: {
      runtime: movieDetails.runtime,
      genres: genresList,
      overview: movieDetails.overview,
      release_date: movieDetails.release_date
    },
    videoKey,
    cast: castList,
    movieData: movieDetails
  };
}
