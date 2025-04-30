import { Movie, MovieDetailsResponse, Cast, Crew } from '../../types/movie';
import { getImageUrl, getNetflixUrl } from '../../services/movieService';
import { Clock, Calendar, Film, Users, PlayCircle, Eye, EyeOff, Award } from 'lucide-react';
import { useWatchlistStore } from '../../store/watchlistStore';
import RatingStars from '../ui/RatingStars';

interface MovieDetailsProps {
  movie: MovieDetailsResponse;
}

const MovieDetails = ({ movie }: MovieDetailsProps) => {
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getDirector = (crew: Crew[]) => {
    return crew.find(person => person.job === 'Director');
  };
  
  const director = movie.credits ? getDirector(movie.credits.crew) : null;
  const mainCast = movie.credits ? movie.credits.cast.slice(0, 5) : [];

  return (
    <div>
      {/* Backdrop and basic info section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--color-background))] via-transparent to-transparent z-10"></div>
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-64 md:h-96 object-cover"
        />
        
        <div className="container mx-auto px-4 relative -mt-32 z-20">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="rounded-lg shadow-lg w-full max-w-xs mx-auto md:mx-0"
              />
            </div>
            
            {/* Info */}
            <div className="md:w-2/3 lg:w-3/4 pt-16 md:pt-32">
              <div className="bg-white/80 dark:bg-dark-100/80 p-6 rounded-lg backdrop-blur-md shadow-lg">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                
                {movie.tagline && (
                  <p className="text-gray-600 dark:text-gray-400 italic mb-4">{movie.tagline}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <RatingStars rating={movie.vote_average} size="medium" />
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{movie.release_date?.substring(0, 4) || 'Unknown'}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
                  <a
                    href={getNetflixUrl(movie.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" /> Watch Now
                  </a>
                  <button
                    onClick={handleWatchlistToggle}
                    className={`btn ${inWatchlist ? 'btn-secondary' : 'btn-outline'}`}
                  >
                    {inWatchlist ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" /> Remove from Watchlist
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" /> Add to Watchlist
                      </>
                    )}
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{movie.overview}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {director && (
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center">
                        <Award className="h-4 w-4 mr-2" /> Director
                      </h3>
                      <p>{director.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center">
                      <Film className="h-4 w-4 mr-2" /> Status
                    </h3>
                    <p>{movie.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cast Section */}
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Users className="h-5 w-5 mr-2" /> Cast
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mainCast.map(person => (
            <div key={person.id} className="bg-white dark:bg-dark-100 rounded-lg overflow-hidden shadow-md">
              <img
                src={getImageUrl(person.profile_path)}
                alt={person.name}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{person.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{person.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;