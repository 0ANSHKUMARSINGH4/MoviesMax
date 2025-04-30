import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  // Set document title
  useEffect(() => {
    document.title = 'Page Not Found | MoviesMax';
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-16 w-16 text-warning-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;