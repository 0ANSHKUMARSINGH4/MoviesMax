import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalState";
import MovieModal from "../components/modal/MovieModal";
import { Play, Plus, Check } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const { API_KEY, BASE_URL, watchlist, toggleWatchlist } = useContext(GlobalContext);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
            // Filter: Must have a poster and not be a person
            const filtered = res.data.results.filter(item => item.media_type !== "person" && item.poster_path);
            setMovies(filtered);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
      };
      fetchSearch();
    }
  }, [query, API_KEY, BASE_URL]);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-12">
      <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-8">
        Results for: <span className="text-blue-brand">{query}</span>
      </h1>

      {loading ? (
          <div className="text-center text-gray-500 mt-20">Searching...</div>
      ) : movies.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
              <h2 className="text-xl">No results found.</h2>
              <p>Try searching for a different movie or show.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {movies.map((movie, index) => {
               const inWatchlist = watchlist.find((item) => item.id === movie.id);

               return (
                <div
                    key={`${movie.id}-${index}`}
                    onClick={() => setSelectedMovie(movie)}
                    className="group relative cursor-pointer rounded-xl overflow-hidden
                    bg-white dark:bg-[#181818] shadow-sm dark:shadow-none
                    transition-all duration-300 hover:scale-105 hover:-translate-y-2
                    hover:shadow-xl hover:shadow-blue-900/20 dark:hover:shadow-blue-900/40
                    ring-1 ring-gray-200 dark:ring-white/5 hover:ring-blue-brand dark:hover:ring-blue-500/50"
                >
                    <div className="aspect-[2/3] w-full relative">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title || movie.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:contrast-110"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-900/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                             <div className="bg-blue-brand p-3 rounded-full text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 shadow-lg shadow-blue-500/50">
                                <Play fill="currentColor" size={20} />
                             </div>
                             <button
                                onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
                                className={`p-2.5 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 shadow-lg ${inWatchlist ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-blue-50 hover:text-blue-600'}`}
                            >
                                {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#181818]">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-brand transition-colors">
                            {movie.title || movie.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-500 border border-gray-300 dark:border-gray-700 px-1 rounded">HD</span>
                            <span className="text-[10px] text-gray-500 capitalize">{movie.media_type}</span>
                        </div>
                    </div>
                </div>
               );
            })}
          </div>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default Search;