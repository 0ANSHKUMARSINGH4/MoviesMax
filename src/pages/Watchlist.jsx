import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Play, Bookmark, Film, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MovieModal from "../components/modal/MovieModal";
import MovieCard from "../components/media/MovieCard";
import SmartImage from "../components/media/SmartImage";
import { normalizeMedia } from "../utils/mediaUtils";
import Section from "../components/layout/Section";

const Watchlist = () => {
  const { watchlist } = useContext(GlobalContext);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const upNextRaw = watchlist && watchlist.length > 0 ? watchlist[0] : null;
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
              My Watchlist
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved to your queue
            </p>
          </div>

          {/* STATUS FILTER TABS */}
          {watchlist.length > 0 && (
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
        {watchlist.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-sp-3 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
              <Bookmark size={36} />
            </div>
            <h2 className="text-section font-black text-white font-display">Your Watchlist is Empty</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore trending blockbusters, anime, and series to curate your personal queue.
            </p>
            <Link
              to="/explore"
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
                {/* Poster Thumbnail — via SmartImage */}
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
                  </div>
                </div>
              </div>
            )}

            {/* UNIFIED WATCHLIST GRID */}
            <div className="space-y-sp-3">
              <h3 className="text-card-title font-bold text-white uppercase tracking-wider flex items-center gap-sp-1">
                <Film size={18} className="text-blue-500" /> Saved Library ({watchlist.length})
              </h3>

              {/* Grid with uniform gap-sp-3 matching Explore page */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-sp-3">
                {watchlist.map((movie, index) => (
                  <MovieCard
                    key={`${movie.id}-${index}`}
                    movie={movie}
                    onMovieClick={setSelectedMovie}
                    vertical="movies"
                  />
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