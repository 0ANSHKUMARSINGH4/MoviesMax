import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Bookmark, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import MovieModal from "../components/modal/MovieModal";
import MovieCard from "../components/media/MovieCard";
import { removeMovieFromPlaylist, fetchPlaylists } from "../utils/movieApi";

const Watchlist = () => {
  const { user, defaultPlaylist, setPlaylists } = useContext(GlobalContext);
  const [selectedMovie, setSelectedMovie] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen pt-28 bg-[#0B1120] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-3xl mb-6 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
          <Bookmark size={32} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-display">Sign in to see your Watchlist</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">Create an account or sign in to save movies, series, and anime to your personal library.</p>
        <Link
          to="/login"
          className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  const rawMovies = defaultPlaylist?.movies || [];
  const movies = rawMovies.map((m) => ({
    ...m,
    id: String(m.tmdbId || m.id),
  }));

  const handleRemove = async (e, tmdbId) => {
    e.stopPropagation();
    try {
      await removeMovieFromPlaylist(defaultPlaylist._id, String(tmdbId));
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (err) {
      console.error("Watchlist remove error:", err);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0B1120] text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-6">
        {/* HEADER */}
        <div className="border-b border-white/10 pb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Bookmark size={14} /> Personal Library
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
              My Watchlist
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {movies.length} {movies.length === 1 ? "title" : "titles"} saved to your queue
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {movies.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Bookmark size={30} />
            </div>
            <h2 className="text-xl font-bold text-white">Your watchlist is empty</h2>
            <p className="text-gray-400 text-sm">
              Explore trending blockbusters, anime, and series to curate your personal queue.
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
            >
              Explore Movies <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* RESPONSIVE CARD GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {movies.map((movie) => (
              <div key={movie.id} className="relative group/grid-card">
                <MovieCard
                  movie={movie}
                  onMovieClick={setSelectedMovie}
                />
                {/* QUICK REMOVE BUTTON */}
                <button
                  onClick={(e) => handleRemove(e, movie.id)}
                  className="absolute top-4 right-2 z-40 w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover/grid-card:opacity-100 transition-all shadow-md"
                  title="Remove from Watchlist"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* THEATRE MODAL */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Watchlist;
