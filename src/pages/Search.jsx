import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieModal from "../components/modal/MovieModal";
import MovieCard from "../components/media/MovieCard";
import { searchMoviesFromOMDb } from "../utils/movieApi";
import { Search as SearchIcon, Film, Loader2 } from "lucide-react";

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
          const results = await searchMoviesFromOMDb(query);
          setMovies(results || []);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSearch();
    }
  }, [query]);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 md:px-12 pb-24 bg-[#07080b] text-white">
      {/* SEARCH RESULTS TITLE */}
      <div className="border-b border-white/10 pb-6 mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
          Search Results for: <span className="text-blue-500">"{query}"</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Showing {movies.length} matched titles across global cinema databases
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <p className="text-gray-400 font-semibold text-sm">Searching global streaming databases...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
              <Film size={28} />
            </div>
            <h2 className="text-2xl font-black text-white">No titles found</h2>
            <p className="text-gray-400 text-sm">
              We couldn't find any media matching "{query}". Try checking for typos or searching by popular actor, director, or genre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="flex justify-center">
                <MovieCard
                  movie={movie}
                  onMovieClick={setSelectedMovie}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STANDARDIZED MEDIA DOSSIER MODAL */}
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