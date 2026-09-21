/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { fetchTrendingMovies } from "../utils/movieApi";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("moviesmax-watchlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("moviesmax-favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme State (Default to 'dark')
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  // 1. Handle Theme Changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  async function fetchTrending() {
    try {
      const results = await fetchTrendingMovies();
      setTrending(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  }

  // 2. Load Data
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrending();
  }, []);

  // 3. Save Data
  useEffect(() => {
    localStorage.setItem("moviesmax-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("moviesmax-favorites", JSON.stringify(favorites));
  }, [favorites]);



  const toggleWatchlist = (movie) => {
    const exists = watchlist.find((item) => item.id === movie.id);
    if (exists) {
      setWatchlist(watchlist.filter((item) => item.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const toggleFavorite = (movie) => {
    const exists = favorites.find((item) => item.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((item) => item.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <GlobalContext.Provider value={{
      watchlist,
      favorites,
      trending,
      loading,
      theme,        // Export theme
      toggleTheme,  // Export toggle function
      toggleWatchlist,
      toggleFavorite,
      API_KEY,
      BASE_URL
    }}>
      {children}
    </GlobalContext.Provider>
  );
};