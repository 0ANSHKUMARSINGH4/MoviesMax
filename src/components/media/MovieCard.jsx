import { useContext } from "react";
import { Play, Plus, Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { normalizeMedia } from "../../utils/mediaUtils";
import { addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";

const MovieCard = ({ movie, onMovieClick }) => {
  const navigate = useNavigate();
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);

  const item = normalizeMedia(movie);
  if (!item) return null;

  const inWatchlist = user && item.id ? isInWatchlist(item.id) : false;
  const matchScore = Math.min(99, Math.max(80, Math.round((item.vote_average || 8.0) * 10) + 4));

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!defaultPlaylist || !item) return;
    try {
      if (inWatchlist) {
        await removeMovieFromPlaylist(defaultPlaylist._id, String(item.id));
      } else {
        await addMovieToPlaylist(defaultPlaylist._id, {
          tmdbId: String(item.id),
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
          vote_average: item.vote_average,
          release_date: item.release_date,
          genres: item.genres,
          runtime: item.runtime || null,
        });
      }
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (err) {
      console.error("Watchlist toggle error:", err);
    }
  };

  return (
    <div
      onClick={() => onMovieClick && onMovieClick(item)}
      className="relative flex-none w-36 sm:w-44 md:w-52 lg:w-56 cursor-pointer select-none group/card py-2"
    >
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#111827] border border-white/10 shadow-lg transition-all duration-300 ease-out group-hover/card:scale-105 group-hover/card:shadow-[0_0_25px_rgba(59,130,246,0.35)] group-hover/card:border-blue-500/60 z-10 group-hover/card:z-30">
        {/* POSTER IMAGE */}
        <img
          src={item.poster_path || item.backdrop_path}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />

        {/* BOTTOM GRADIENT MASK */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/30 to-transparent opacity-70 group-hover/card:opacity-90 transition-opacity duration-300" />

        {/* TOP BRAND BADGES */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-20">
          <span className="px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-black text-blue-400 backdrop-blur-md border border-blue-500/30">
            {item.category === "TV Show" ? "SERIES" : "4K"}
          </span>

          {item.vote_average > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-yellow-400 flex items-center gap-1 shadow-md">
              <Star size={10} fill="currentColor" /> {Number(item.vote_average).toFixed(1)}
            </span>
          )}
        </div>

        {/* HOVER PLAY BUTTON (CENTER) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20">
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover/card:scale-100 transition-transform duration-200 hover:scale-110 hover:bg-blue-50">
            <Play size={18} fill="black" className="translate-x-0.5" />
          </div>
        </div>

        {/* HOVER ACTIONS (TOP RIGHT) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-30">
          <button
            onClick={handleWatchlistToggle}
            className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
              inWatchlist
                ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/40"
                : "bg-black/70 border-white/30 text-white hover:bg-blue-600/30 hover:border-blue-400"
            }`}
            title={inWatchlist ? "Remove from List" : "Add to Watchlist"}
          >
            {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
          </button>
        </div>

        {/* BOTTOM TITLE & STREAMING METADATA */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 z-20 pointer-events-none">
          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow-md">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-300 mt-1">
            <span className="text-blue-400 font-bold drop-shadow">{matchScore}% Match</span>
            <span className="opacity-40">•</span>
            <span>{item.release_date ? item.release_date.slice(0, 4) : "2025"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
