import { useQuery } from '@tanstack/react-query';
import * as movieService from '../services/movieService';

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ['popularMovies'],
    queryFn: movieService.getPopularMovies,
  });
};

export const useNowPlayingMovies = () => {
  return useQuery({
    queryKey: ['nowPlayingMovies'],
    queryFn: movieService.getNowPlayingMovies,
  });
};

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: movieService.getTopRatedMovies,
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: movieService.getUpcomingMovies,
  });
};

export const useMovieDetails = (id: number) => {
  return useQuery({
    queryKey: ['movieDetails', id],
    queryFn: () => movieService.getMovieDetails(id),
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['searchMovies', query],
    queryFn: () => movieService.searchMovies(query),
    enabled: query.length > 2,
  });
};

export const useSimilarMovies = (id: number) => {
  return useQuery({
    queryKey: ['similarMovies', id],
    queryFn: () => movieService.getSimilarMovies(id),
    enabled: !!id,
  });
};

export const useMovieRecommendations = (id: number) => {
  return useQuery({
    queryKey: ['movieRecommendations', id],
    queryFn: () => movieService.getMovieRecommendations(id),
    enabled: !!id,
  });
};