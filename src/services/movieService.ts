import axios from 'axios';
import { Movie, MoviesResponse, MovieDetailsResponse } from '../types/movie';

// TMDB API configuration
const API_KEY = 'a576f39b59bd078e23d15ab9eaa6e9ff';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image+Available';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Helper function to generate Netflix URL
export const getNetflixUrl = (movieTitle: string): string => {
  const formattedTitle = movieTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  return `https://www.netflix.com/search?q=${formattedTitle}`;
};

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Movie API functions
export const getPopularMovies = async (): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>('/movie/popular');
  return response.data.results;
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>('/movie/now_playing');
  return response.data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>('/movie/top_rated');
  return response.data.results;
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>('/movie/upcoming');
  return response.data.results;
};

export const getMovieDetails = async (id: number): Promise<MovieDetailsResponse> => {
  const response = await api.get<MovieDetailsResponse>(`/movie/${id}`, {
    params: {
      append_to_response: 'credits,similar',
    },
  });
  return response.data;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>('/search/movie', {
    params: {
      query,
    },
  });
  return response.data.results;
};

export const getMovieRecommendations = async (id: number): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>(`/movie/${id}/recommendations`);
  return response.data.results;
};

export const getSimilarMovies = async (id: number): Promise<Movie[]> => {
  const response = await api.get<MoviesResponse>(`/movie/${id}/similar`);
  return response.data.results;
};