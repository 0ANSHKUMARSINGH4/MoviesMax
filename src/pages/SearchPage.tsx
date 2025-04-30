import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import MovieList from '../components/movies/MovieList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSearchMovies, usePopularMovies, useTopRatedMovies, useUpcomingMovies } from '../hooks/useMovies';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialCategory = queryParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // Set document title
  useEffect(() => {
    document.title = searchQuery 
      ? `Search: ${searchQuery} | MoviesMax` 
      : 'Search Movies | MoviesMax';
  }, [searchQuery]);
  
  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);
  
  // Update URL with search query
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (activeCategory) params.set('category', activeCategory);
    
    const newSearch = params.toString();
    if (location.search !== `?${newSearch}`) {
      const newUrl = newSearch ? `?${newSearch}` : '';
      window.history.replaceState({}, '', `${location.pathname}${newUrl}`);
    }
  }, [debouncedQuery, activeCategory, location.pathname, location.search]);
  
  // Search results query
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError
  } = useSearchMovies(debouncedQuery);
  
  // Category queries
  const { data: popularMovies, isLoading: isPopularLoading } = usePopularMovies();
  const { data: topRatedMovies, isLoading: isTopRatedLoading } = useTopRatedMovies();
  const { data: upcomingMovies, isLoading: isUpcomingLoading } = useUpcomingMovies();
  
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'popular': return 'Popular Movies';
      case 'top_rated': return 'Top Rated Movies';
      case 'upcoming': return 'Upcoming Movies';
      default: return '';
    }
  };
  
  const getCategoryMovies = () => {
    switch (activeCategory) {
      case 'popular': return popularMovies;
      case 'top_rated': return topRatedMovies;
      case 'upcoming': return upcomingMovies;
      default: return [];
    }
  };
  
  const isLoadingCategory = isPopularLoading || isTopRatedLoading || isUpcomingLoading;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveCategory(''); // Clear category when searching
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Search Movies</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full py-3 px-4 pl-10 rounded-lg bg-gray-100 dark:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>
      
      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveCategory('popular');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'popular'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-200 text-gray-800 dark:text-gray-200'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => {
              setActiveCategory('top_rated');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'top_rated'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-200 text-gray-800 dark:text-gray-200'
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => {
              setActiveCategory('upcoming');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-200 text-gray-800 dark:text-gray-200'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>
      
      {/* Results */}
      {debouncedQuery && !activeCategory ? (
        <MovieList
          title={`Search Results for "${debouncedQuery}"`}
          movies={searchResults || []}
          loading={isSearchLoading}
          error={searchError}
        />
      ) : activeCategory ? (
        <MovieList
          title={getCategoryTitle()}
          movies={getCategoryMovies() || []}
          loading={isLoadingCategory}
        />
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Search for movies or select a category to explore
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;