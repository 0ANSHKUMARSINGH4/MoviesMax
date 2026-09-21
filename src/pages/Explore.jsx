import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Compass } from "lucide-react";
import MovieModal from "../components/modal/MovieModal";
import MovieCard from "../components/media/MovieCard";
import { fetchMoviesByCategory } from "../utils/movieApi";
import { CATEGORY_CATALOG } from "../utils/movieData";

const Explore = () => {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("action");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const categories = [
    { id: "action", name: "Action", type: "catalog", key: "action thrillers" },
    { id: "blockbusters", name: "Blockbusters", type: "catalog", key: "trending blockbusters" },
    { id: "classics", name: "Top Rated Classics", type: "catalog", key: "top rated classics" },
    { id: "scifi", name: "Sci-Fi & Cyberpunk", type: "catalog", key: "sci-fi & cyberpunk" },
    { id: "series", name: "Prestige TV", type: "catalog", key: "western prestige tv" },
    { id: "kdrama", name: "K-Dramas", type: "catalog", key: "korean dramas (k-dramas)" },
    { id: "anime", name: "Anime Simulcasts", type: "jikan" },
    { id: "comedy", name: "Comedy Hits", type: "catalog", key: "comedy hits" },
  ];

  const fetchMovies = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const category = categories.find((c) => c.id === selectedCategory);
      let newResults = [];
      if (category.type === "jikan") {
        try {
          const res = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}`, { timeout: 3500 });
          if (res.data?.data && res.data.data.length > 0) {
            newResults = res.data.data.map((anime) => ({
              id: anime.mal_id,
              title: anime.title,
              poster_path: anime.images.jpg.large_image_url,
              backdrop_path: anime.images.jpg.large_image_url,
              vote_average: anime.score || 8.6,
              isJikan: true,
              category: "Anime",
              release_date: anime.aired?.from ? String(anime.aired.from).slice(0, 4) : "2024"
            }));
          }
        } catch {
          newResults = CATEGORY_CATALOG["currently airing simulcasts"];
        }
      } else {
        newResults = await fetchMoviesByCategory(category.key || category.name);
      }
      setMovies((prev) => (reset ? newResults : [...prev, ...newResults]));
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (page > 1) fetchMovies(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="min-h-screen pt-28 px-4 md:px-12 pb-24 bg-[#07080b] text-white">
      {/* STICKY CATEGORIES HEADER */}
      <div className="sticky top-20 z-30 bg-[#07080b]/95 backdrop-blur-2xl py-4 -mx-4 md:-mx-12 px-4 md:px-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-display">
              Explore Universe
            </h1>
            <p className="text-xs text-gray-400 font-medium">Instant catalog browsing across all verticals</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto custom-scrollbar no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* UNIFIED MOVIE GRID USING STANDARDIZED MOVIECARD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {movies.map((movie, index) => (
          <div key={`${movie.id || movie.title}-${index}`} className="flex justify-center">
            <MovieCard
              movie={movie}
              onMovieClick={setSelectedMovie}
              isAnime={selectedCategory === "anime" || movie.isJikan}
            />
          </div>
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      <div className="mt-16 flex justify-center">
        <button
          disabled={loading}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-white/10 hover:bg-white/20 border border-white/15 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
        >
          {loading ? <Loader2 size={18} className="animate-spin text-blue-500" /> : "Load More Titles"}
        </button>
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

export default Explore;
