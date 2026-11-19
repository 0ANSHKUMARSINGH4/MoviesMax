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
      <div className="min-h-screen pt-28 bg-[#141414] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 text-[#E50914] flex items-center justify-center text-3xl mb-6 shadow-xl">
          <Bookmark size={32} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Sign in to see your List</h2>
        <p className="text-zinc-400 text-sm mb-6 max-w-sm">Create an account or sign in to save movies, series, and anime to your personal library.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm transition-colors shadow-lg"
        >
          Sign In
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
    <div className="min-h-screen pt-28 pb-24 bg-[#141414] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* HEADER */}
        <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              My List
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              {movies.length} {movies.length === 1 ? "title" : "titles"} saved to your library
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {movies.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center">
              <Bookmark size={30} />
            </div>
            <h2 className="text-xl font-bold text-white">Your list is empty</h2>
            <p className="text-zinc-400 text-sm">
              Explore movies, series, and anime to build your queue.
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm transition-colors shadow-lg"
            >
              Explore Movies <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* NETFLIX GRID */
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
                  className="absolute top-4 right-2 z-40 w-7 h-7 rounded-full bg-black/80 hover:bg-[#E50914] text-white flex items-center justify-center opacity-0 group-hover/grid-card:opacity-100 transition-all shadow-md"
                  title="Remove from My List"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
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
