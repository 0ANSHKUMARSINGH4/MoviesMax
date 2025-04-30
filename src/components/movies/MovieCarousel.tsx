import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types/movie';
import { getImageUrl, getNetflixUrl } from '../../services/movieService';
import { Link } from 'react-router-dom';
import RatingStars from '../ui/RatingStars';

interface MovieCarouselProps {
  movies: Movie[];
}

const MovieCarousel = ({ movies }: MovieCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalMovies = movies.length;

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalMovies - 1 : prevIndex - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === totalMovies - 1 ? 0 : prevIndex + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    // Auto-advance every 6 seconds
    timerRef.current = setInterval(goToNext, 6000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [totalMovies]);

  if (!movies || movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentIndex];
  
  // Movie-specific images
  const imageMap: Record<string, string> = {
    'The Matrix Resurrections': 'https://www.whatisthematrix.com/assetsNew/images/banner_img.jpg',
    'No Time to Die': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTsPYqjVVRUdBtOzVGFWnBOReQHefIwc80jAoQi7LxQtXfhapBUbfwmF_AE0eyHw1hqf0&usqp=CAU',
  };
  
  const heroImage = imageMap[currentMovie.title] || getImageUrl(currentMovie.backdrop_path, 'original');

  return (
    <div className="relative h-64 sm:h-80 md:h-96 lg:h-128 overflow-hidden">
      {/* Image and gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
      <img
        src={heroImage}
        alt={currentMovie.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-lg">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
              {currentMovie.title}
            </h1>
            <div className="mb-3 sm:mb-6">
              <RatingStars rating={currentMovie.vote_average} size="medium" />
            </div>
            <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-3">
              {currentMovie.overview}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href={getNetflixUrl(currentMovie.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Watch Now
              </a>
              <Link to={`/movie/${currentMovie.id}`} className="btn-outline bg-black/40 text-white border-white hover:bg-white/20">
                More Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
        aria-label="Previous movie"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
        aria-label="Next movie"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;