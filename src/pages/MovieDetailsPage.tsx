import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieDetails from '../components/movies/MovieDetails';
import MovieList from '../components/movies/MovieList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useMovieDetails, useSimilarMovies, useMovieRecommendations } from '../hooks/useMovies';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = id ? parseInt(id, 10) : 0;

  const { 
    data: movie, 
    isLoading, 
    error 
  } = useMovieDetails(movieId);

  const {
    data: recommendations,
    isLoading: isLoadingRecommendations
  } = useMovieRecommendations(movieId);
  
  // Set document title based on movie data
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} | MoviesMax`;
    } else {
      document.title = 'Movie Details | MoviesMax';
    }
  }, [movie]);

  // Handle invalid movie ID
  useEffect(() => {
    if (!isLoading && error) {
      navigate('/not-found', { replace: true });
    }
  }, [isLoading, error, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!movie) {
    return null; // We'll redirect in the useEffect
  }

  return (
    <div>
      <MovieDetails movie={movie} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Recommended Movies */}
        {recommendations && recommendations.length > 0 && (
          <MovieList
            title="You May Also Like"
            movies={recommendations}
            loading={isLoadingRecommendations}
          />
        )}
        
        {/* Similar Movies from the movie details */}
        {movie.similar && movie.similar.results.length > 0 && (
          <MovieList
            title="Similar Movies"
            movies={movie.similar.results}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;