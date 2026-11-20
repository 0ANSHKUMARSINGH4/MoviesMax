import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieModal from "../components/modal/MovieModal";
import MovieCard from "../components/media/MovieCard";
import { searchMovies } from "../utils/movieApi";
import { Search as SearchIcon, Loader2 } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchSearch = async () => {
        setLoading(true);
        try {
          const results = await searchMovies(query);
          setMovies(results || []);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSearch();
    } else {
      setMovies([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen pt-28 px-5 sm:px-8 md:px-12 pb-24 bg-[#0B1120] text-white">
      {/* SEARCH RESULTS TITLE */}
      <div className="border-b border-white/10 pb-5 mb-6 max-w-[1440px] mx-auto">
        <h1 className="text-xl sm:text-3xl font-black text-white font-display">
          {query ? (
            <>Search Results for: <span className="text-blue-400">"{query}"</span></>
          ) : (
            <span className="flex items-center gap-2"><SearchIcon size={26} className="text-blue-400" /> Search Titles</span>
          )}
        </h1>
        {query && (
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Found {movies.length} {movies.length === 1 ? "title" : "titles"} across TMDB global cinema databases
          </p>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <p className="text-gray-400 font-semibold text-sm">Searching titles...</p>
          </div>
        ) : !query ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.15)]">
              <SearchIcon size={28} />
            </div>
            <h2 className="text-xl font-bold text-white">Find your next favorite title</h2>
            <p className="text-gray-400 text-sm">
              Search by title, genre, or keyword using the top navigation bar.
            </p>
          </div>
        ) : movies.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center">
              <SearchIcon size={28} />
            </div>
            <h2 className="text-xl font-bold text-white">No results found for "{query}"</h2>
            <p className="text-gray-400 text-sm">
              Suggestions: check spelling, try different keywords, or search for a popular title.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onMovieClick={setSelectedMovie}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Search;
