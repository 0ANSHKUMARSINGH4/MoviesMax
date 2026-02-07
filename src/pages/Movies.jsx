import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "../context/GlobalState";
import { Play, Plus, Check, Loader2 } from "lucide-react";
import MovieModal from "../components/modal/MovieModal";

const Movies = () => {
  const { API_KEY, BASE_URL, watchlist, toggleWatchlist } = useContext(GlobalContext);
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("28");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const categories = [
    { id: "28", name: "Action", type: "tmdb" },
    { id: "anime", name: "Anime", type: "jikan" },
    { id: "35", name: "Comedy", type: "tmdb" },
    { id: "27", name: "Horror", type: "tmdb" },
    { id: "10749", name: "Romance", type: "tmdb" },
    { id: "878", name: "Sci-Fi", type: "tmdb" },
    { id: "18", name: "Drama", type: "tmdb" },
  ];

  const fetchMovies = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const category = categories.find((c) => c.id === selectedCategory);
      let newResults = [];
      if (category.type === "jikan") {
        const res = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}`);
        newResults = res.data.data.map((anime) => ({
          id: anime.mal_id,
          title: anime.title,
          poster_path: anime.images.jpg.large_image_url,
          vote_average: anime.score,
          isJikan: true,
        }));
      } else {
        const res = await axios.get(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedCategory}&page=${page}`
        );
        newResults = res.data.results;
      }
      setMovies((prev) => (reset ? newResults : [...prev, ...newResults]));
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(1); fetchMovies(true); }, [selectedCategory]);
  useEffect(() => { if (page > 1) fetchMovies(false); }, [page]);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-12">

      {/* STICKY HEADER (Blue Theme) */}
      <div className="sticky top-20 z-30 bg-white/90 dark:bg-dark-main/90 backdrop-blur-xl py-4 -mx-4 md:-mx-12 px-4 md:px-12 border-b border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row justify-between items-center gap-4 mb-8 transition-all">
        <h1 className="text-3xl font-bold dark:text-white text-gray-900 hidden md:block">Explore</h1>
        <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              // CHANGED: Red -> Blue buttons
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? "bg-blue-brand text-white border-blue-brand shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-brand dark:hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* MOVIE GRID WITH PREMIUM CARDS (Blue Theme) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
        {movies.map((movie, index) => {
          const inWatchlist = watchlist.find((item) => item.id === movie.id);
          return (
            // COPIED & MODIFIED CARD STRUCTURE FROM MovieRow.jsx
            <div
                key={`${movie.id}-${index}`}
                onClick={() => setSelectedMovie(movie)}
                // CHANGED: Updated hover ring and shadow colors to blue
                className="group relative cursor-pointer rounded-xl overflow-hidden
                bg-white dark:bg-[#181818] shadow-sm dark:shadow-none
                transition-all duration-300 hover:scale-105 hover:-translate-y-2
                hover:shadow-xl hover:shadow-blue-900/20 dark:hover:shadow-blue-900/40
                ring-1 ring-gray-200 dark:ring-white/5 hover:ring-blue-brand dark:hover:ring-blue-500/50"
              >
                <div className="aspect-[2/3] w-full relative">
                    <img
                      src={movie.isJikan ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:contrast-110"
                    />
                    <div className="absolute inset-0 bg-blue-900/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                        {/* CHANGED: Play button is now Blue */}
                        <div className="bg-blue-brand p-3 rounded-full text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 shadow-lg shadow-blue-500/50">
                            <Play fill="currentColor" size={20} />
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
                            // CHANGED: Watchlist button green/white (looks good with blue)
                            className={`p-2.5 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 shadow-lg ${inWatchlist ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-blue-50 hover:text-blue-600'}`}
                        >
                            {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                        </button>
                    </div>
                </div>
                <div className="p-3 bg-white dark:bg-[#181818]">
                   {/* CHANGED: Hover text color to blue */}
                   <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-brand transition-colors">
                     {movie.title}
                   </h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500 border border-gray-300 dark:border-gray-700 px-1 rounded">HD</span>
                      <span className="text-[10px] text-gray-500">{movie.isJikan ? 'Anime' : 'Movie'}</span>
                   </div>
                </div>
              </div>
          );
        })}
      </div>

      {/* LOAD MORE BUTTON (Blue Theme) */}
      <div className="mt-16 flex justify-center">
         <button
           disabled={loading}
           onClick={() => setPage(prev => prev + 1)}
           // CHANGED: Blue button style
           className="bg-blue-600 hover:bg-blue-700 dark:bg-[#1A1A1A] dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/20"
         >
           {loading ? <Loader2 className="animate-spin" /> : "Load More"}
         </button>
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default Movies;