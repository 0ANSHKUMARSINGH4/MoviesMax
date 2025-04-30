import { Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-dark-100 py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MoviesMax</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover your next favorite movie with our advanced recommendation system.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/watchlist"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                >
                  Watchlist
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              MoviesMax uses The Movie Database (TMDB) API for movie data and content-based
              recommendation algorithms.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} MoviesMax. All rights reserved. Made with{' '}
            <Heart className="h-4 w-4 inline-block text-red-500" /> by MoviesMax Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;