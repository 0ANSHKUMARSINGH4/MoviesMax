import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'medium', fullScreen = false }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-200/80 backdrop-blur-sm z-50">
        <Loader2 className={`${sizeMap[size]} animate-spin text-primary-600`} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary-600`} />
    </div>
  );
};

export default LoadingSpinner;