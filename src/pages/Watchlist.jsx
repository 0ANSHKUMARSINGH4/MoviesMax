import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Play, Bookmark, Film, Sparkles, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import MovieModal from "../components/modal/MovieModal";
import MovieCard from "../components/media/MovieCard";
import SmartImage from "../components/media/SmartImage";
import { normalizeMedia } from "../utils/mediaUtils";
import Section from "../components/layout/Section";
import { removeMovieFromPlaylist, fetchPlaylists } from "../utils/movieApi";

const Watchlist = () => {
  const { user, defaultPlaylist, setPlaylists } = useContext(GlobalContext);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  if (!user) {
    return (
      <div className="min-h-screen pt-28 bg-[#0B1120] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-6">🔐</div>
        <h2 className="text-section font-black text-white font-display mb-3">Sign in to see your Watchlist</h2>
        <p className="text-gray-400 text-sm mb-6">Create an account to save movies and build your personal library.</p>
        <Link
          to="/login"
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
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

  const handleRemove = async (tmdbId) => {
    try {
      await removeMovieFromPlaylist(defaultPlaylist._id, String(tmdbId));
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const upNextRaw = movies && movies.length > 0 ? movies[0] : null;
  const upNextItem = upNextRaw ? normalizeMedia(upNextRaw) : null;

  return (
    <div className="min-h-screen pt-28 pb-sp-6 bg-v-movies-base text-white">
      <Section as="div" className="space-y-sp-5">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-sp-2 border-b border-white/10 pb-sp-4">
          <div>
            <div className="flex items-center gap-sp-1 text-blue-500 text-meta font-bold uppercase tracking-wider mb-1">
              <Bookmark size={15} /> Personal Library
            </div>
            <h1 className="text-hero font-black tracking-tight text-white font-display">
              {defaultPlaylist?.name || "My Watchlist"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {movies.length} {movies.length === 1 ? "title" : "titles"} saved to your queue
            </p>
          </div>

          {/* STATUS FILTER TABS */}
          {movies.length > 0 && (
            <div className="flex items-center gap-sp-1 bg-white/5 p-1 rounded-full border border-white/10 self-start md:self-auto">
              {[
                { id: "all", label: "All Items" },
                { id: "watching", label: "Watching" },
                { id: "saved", label: "Plan to Watch" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-meta font-bold transition-all ${
                    statusFilter === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/40"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {movies.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-sp-3 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
              <Bookmark size={36} />
            </div>
            <h2 className="text-section font-black text-white font-display">Your Watchlist is Empty</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore trending blockbusters, anime, and series to curate your personal queue.
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-sp-1 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
            >
              Start Exploring <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* "WHAT'S NEXT" SPOTLIGHT CARD */}
            {upNextItem && statusFilter !== "saved" && (
              <div
                onClick={() => setSelectedMovie(upNextItem)}
                className="relative group cursor-pointer rounded-3xl overflow-hidden bg-v-movies-surface border border-v-movies-border p-sp-4 flex flex-col md:flex-row items-center gap-sp-4 shadow-2xl transition-all hover:border-blue-500/50"
              >
                {/* Poster Thumbnail */}
                <div className="w-full md:w-56 aspect-[2/3] md:aspect-video rounded-2xl overflow-hidden flex-shrink-0 relative shadow-xl">
                  <SmartImage
                    src={upNextItem.poster_path}
                    alt=""
                    title={upNextItem.title}
                    vertical="movies"
                    decorative
                    className="absolute inset-0 w-full h-full"
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} fill="black" className="translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-sp-2 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-sp-1 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-meta font-black uppercase tracking-wider">
                    <Sparkles size={12} /> Next Up in Queue
                  </div>
                  <h2 className="text-section font-black text-white font-display">
                    {upNextItem.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 max-w-2xl">
                    {upNextItem.overview}
                  </p>
                  <div className="flex items-center gap-sp-3 justify-center md:justify-start pt-sp-1">
                    <button className="flex items-center gap-sp-1 px-6 py-2.5 rounded-full bg-white text-black text-meta font-black hover:bg-gray-200 shadow-md">
                      <Play size={14} fill="black" /> Resume Playing
                    </button>
                    <span className="text-meta text-gray-500 font-semibold">
                      {upNextItem.release_date} • {upNextItem.runtime}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(upNextItem.id || upNextItem.tmdbId);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 ml-auto flex items-center gap-1 border border-red-500/20 bg-red-500/10 px-3 py-1.5 rounded-full"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* UNIFIED WATCHLIST GRID */}
            <div className="space-y-sp-3">
              <h3 className="text-card-title font-bold text-white uppercase tracking-wider flex items-center gap-sp-1">
                <Film size={18} className="text-blue-500" /> Saved Library ({movies.length})
              </h3>

              {/* Grid with uniform gap-sp-3 matching Explore page */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-sp-3">
                {movies.map((movie, index) => (
                  <div key={`${movie.id || movie.tmdbId}-${index}`} className="relative group/card-wrapper">
                    <MovieCard
                      movie={{
                        ...movie,
                        id: String(movie.tmdbId || movie.id),
                      }}
                      onMovieClick={() =>
                        setSelectedMovie({
                          ...movie,
                          id: String(movie.tmdbId || movie.id),
                        })
                      }
                      vertical="movies"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(movie.tmdbId || movie.id);
                      }}
                      className="absolute top-6 right-2 z-30 p-1.5 rounded-full bg-black/80 hover:bg-red-600 text-gray-300 hover:text-white transition-all opacity-0 group-hover/card-wrapper:opacity-100 shadow-lg border border-white/20"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Section>

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
