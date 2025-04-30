import { Movie } from '../../types/movie';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieListProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  error?: Error | null;
  viewAllLink?: string;
  variant?: 'grid' | 'horizontal';
}

const MovieList = ({ 
  title, 
  movies, 
  loading = false, 
  error = null, 
  viewAllLink,
  variant = 'grid'
}: MovieListProps) => {
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card bg-gray-100 dark:bg-dark-100 animate-pulse">
              <div className="aspect-[2/3]"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-dark-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-dark-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
        <div className="bg-error-50 dark:bg-error-700/20 text-error-700 dark:text-error-200 p-4 rounded">
          Failed to load movies: {error.message}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
        <div className="bg-gray-100 dark:bg-dark-100 p-4 rounded text-center">
          No movies found.
        </div>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link 
            to={viewAllLink} 
            className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {variant === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="horizontal" />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieList;