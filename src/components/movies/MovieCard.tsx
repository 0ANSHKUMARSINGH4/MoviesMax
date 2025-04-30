import { Link } from 'react-router-dom';
import { Eye, EyeOff, PlayCircle, Info } from 'lucide-react';
import { Movie } from '../../types/movie';
import { getImageUrl, getNetflixUrl } from '../../services/movieService';
import { useWatchlistStore } from '../../store/watchlistStore';
import RatingStars from '../ui/RatingStars';

interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'horizontal';
}

const MovieCard = ({ movie, variant = 'default' }: MovieCardProps) => {
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  };

  // Get image URL or fallback
  const imageUrl = getImageUrl(movie.poster_path);

  if (variant === 'horizontal') {
    return (
      <div className="card flex bg-white dark:bg-dark-100 movie-card-zoom h-32 sm:h-40 md:h-48">
        <Link to={`/movie/${movie.id}`} className="flex flex-grow">
          <div className="w-24 sm:w-32 h-full flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1">{movie.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {movie.release_date?.substring(0, 4) || 'Unknown'}
              </p>
              <p className="text-xs sm:text-sm line-clamp-2 text-gray-500 dark:text-gray-400 mb-2">
                {movie.overview || 'No overview available.'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <RatingStars rating={movie.vote_average} size="small" />
              <div className="flex space-x-2">
                <button
                  onClick={handleWatchlistToggle}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 transition"
                  aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {inWatchlist ? (
                    <EyeOff className="h-4 w-4 text-primary-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-white dark:bg-dark-100 movie-card-zoom">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <RatingStars rating={movie.vote_average} size="small" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {movie.release_date?.substring(0, 4) || 'Unknown'}
          </p>
          <div className="flex justify-between items-center">
            <a
              href={getNetflixUrl(movie.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent text-xs py-1 px-2 flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <PlayCircle className="h-3 w-3" /> Watch Now
            </a>
            <div className="flex items-center space-x-2">
              <Link 
                to={`/movie/${movie.id}`}
                className="btn-accent text-xs py-1 px-2 flex items-center gap-1"
              >
                <Info className="h-3 w-3" /> Details
              </Link>
              <button
                onClick={handleWatchlistToggle}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 transition"
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {inWatchlist ? (
                  <EyeOff className="h-4 w-4 text-primary-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;