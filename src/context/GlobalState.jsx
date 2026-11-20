/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchMe, fetchPlaylists } from '../utils/movieApi';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('moviesmax-token'));
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(async (u) => {
        if (u) {
          setUser(u);
          const lists = await fetchPlaylists();
          setPlaylists(lists || []);
        } else {
          localStorage.removeItem('moviesmax-token');
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('moviesmax-token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (tokenStr, userData) => {
    localStorage.setItem('moviesmax-token', tokenStr);
    setToken(tokenStr);
    setUser(userData);
    const lists = await fetchPlaylists();
    setPlaylists(lists || []);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('moviesmax-token');
    setToken(null);
    setUser(null);
    setPlaylists([]);
  }, []);

  const defaultPlaylist = playlists.find((p) => p.isDefault) || playlists[0] || null;

  const isInWatchlist = useCallback(
    (tmdbId) => {
      if (!defaultPlaylist || !Array.isArray(defaultPlaylist.movies)) return false;
      return defaultPlaylist.movies.some((m) => String(m.tmdbId) === String(tmdbId));
    },
    [defaultPlaylist]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      playlists,
      defaultPlaylist,
      login,
      logout,
      isInWatchlist,
      setPlaylists,
    }),
    [user, token, loading, playlists, defaultPlaylist, login, logout, isInWatchlist]
  );

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
