import { useEffect } from 'react';
import { useWatchlistStore } from '../store/watchlistStore';
import MovieList from '../components/movies/MovieList';
import { Film as FilmSlate } from 'lucide-react';
import { Link } from 'react-router-dom';

const WatchlistPage = () => {
  const { movies } = useWatchlistStore();
  
  // Set document title
  useEffect(() => {
    document.title = 'My Watchlist | MoviesMax';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Watchlist</h1>
      
      {movies.length > 0 ? (
        <MovieList
          title="Saved Movies"
          movies={movies}
          variant="horizontal"
        />
      ) : (
        <div className="bg-gray-50 dark:bg-dark-100 rounded-lg p-8 text-center">
          <FilmSlate className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding movies you want to watch later!
          </p>
          <Link to="/" className="btn-primary">
            Discover Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;