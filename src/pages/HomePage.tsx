import { useEffect } from 'react';
import MovieCarousel from '../components/movies/MovieCarousel';
import MovieList from '../components/movies/MovieList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  usePopularMovies, 
  useNowPlayingMovies, 
  useTopRatedMovies,
  useUpcomingMovies 
} from '../hooks/useMovies';

const HomePage = () => {
  // Fetch different movie categories
  const { 
    data: popularMovies, 
    isLoading: isLoadingPopular,
    error: popularError
  } = usePopularMovies();
  
  const {
    data: nowPlayingMovies,
    isLoading: isLoadingNowPlaying,
    error: nowPlayingError
  } = useNowPlayingMovies();
  
  const {
    data: topRatedMovies,
    isLoading: isLoadingTopRated,
    error: topRatedError
  } = useTopRatedMovies();
  
  const {
    data: upcomingMovies,
    isLoading: isLoadingUpcoming,
    error: upcomingError
  } = useUpcomingMovies();

  // Set document title
  useEffect(() => {
    document.title = 'MoviesMax - Find Your Perfect Movie';
  }, []);

  // If all data is loading, show full-page loading spinner
  if (isLoadingPopular && isLoadingNowPlaying && isLoadingTopRated && isLoadingUpcoming) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div>
      {/* Hero Carousel */}
      {nowPlayingMovies && nowPlayingMovies.length > 0 && (
        <MovieCarousel movies={nowPlayingMovies.slice(0, 5)} />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Popular Movies */}
        <MovieList
          title="Popular Movies"
          movies={popularMovies || []}
          loading={isLoadingPopular}
          error={popularError}
          viewAllLink="/search?category=popular"
        />

        {/* Top Rated Movies */}
        <MovieList
          title="Top Rated Movies"
          movies={topRatedMovies || []}
          loading={isLoadingTopRated}
          error={topRatedError}
          viewAllLink="/search?category=top_rated"
        />

        {/* Upcoming Movies */}
        <MovieList
          title="Upcoming Movies"
          movies={upcomingMovies || []}
          loading={isLoadingUpcoming}
          error={upcomingError}
          viewAllLink="/search?category=upcoming"
        />
      </div>
    </div>
  );
};

export default HomePage;