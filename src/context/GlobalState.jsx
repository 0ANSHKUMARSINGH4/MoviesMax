import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme State (Default to 'dark')
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const API_KEY = "a576f39b59bd078e23d15ab9eaa6e9ff";
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

  // 2. Load Data
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("moviesmax-watchlist");
    const savedFavorites = localStorage.getItem("moviesmax-favorites");
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    fetchTrending();
  }, []);

  // 3. Save Data
  useEffect(() => {
    localStorage.setItem("moviesmax-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("moviesmax-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchTrending = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
      setTrending(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

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