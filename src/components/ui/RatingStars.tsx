import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showScore?: boolean;
}

const RatingStars = ({ 
  rating, 
  maxRating = 10, 
  size = 'medium',
  showScore = true
}: RatingStarsProps) => {
  const normalizedRating = (rating / maxRating) * 5;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  
  const sizeClass = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5',
  };

  // Generate an array of 5 indices
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < fullStars) return 'full';
    if (i === fullStars && hasHalfStar) return 'half';
    return 'empty';
  });

  return (
    <div className="flex items-center">
      <div className="flex">
        {stars.map((type, i) => (
          <span key={i}>
            {type === 'full' && (
              <Star className={`${sizeClass[size]} text-yellow-400 fill-yellow-400`} />
            )}
            {type === 'half' && (
              <Star className={`${sizeClass[size]} text-yellow-400 fill-yellow-400`} strokeDasharray="36" strokeDashoffset="18" />
            )}
            {type === 'empty' && (
              <Star className={`${sizeClass[size]} text-gray-300 dark:text-gray-600`} />
            )}
          </span>
        ))}
      </div>
      {showScore && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;