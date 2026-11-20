import { useContext } from "react";
import { Play, Plus, Check } from "lucide-react";
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
  const matchScore = Math.min(99, Math.max(82, Math.round((item.vote_average || 8.0) * 10) + 4));

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
      <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-[#202020] border border-white/5 shadow-lg transition-transform duration-300 ease-out group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:border-zinc-700 z-10 group-hover/card:z-30">
        {/* POSTER IMAGE */}
        <img
          src={item.poster_path || item.backdrop_path}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-opacity duration-300 group-hover/card:opacity-90"
        />

        {/* BOTTOM GRADIENT MASK */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity duration-300" />

        {/* TOP NETFLIX BADGES */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-20">
          <span className="text-[#E50914] font-black text-sm drop-shadow">N</span>
          <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-bold text-zinc-300 backdrop-blur-sm border border-white/10">
            {item.category === "TV Show" ? "SERIES" : "HD"}
          </span>
        </div>

        {/* HOVER PLAY BUTTON (CENTER) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20">
          <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover/card:scale-100 transition-transform duration-200 hover:scale-110">
            <Play size={18} fill="black" className="translate-x-0.5" />
          </div>
        </div>

        {/* HOVER ACTIONS (TOP RIGHT) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-30">
          <button
            onClick={handleWatchlistToggle}
            className={`w-7 h-7 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
              inWatchlist
                ? "bg-[#E50914] border-[#E50914] text-white"
                : "bg-black/70 border-white/30 text-white hover:bg-white/20"
            }`}
            title={inWatchlist ? "Remove from List" : "Add to My List"}
          >
            {inWatchlist ? <Check size={13} /> : <Plus size={13} />}
          </button>
        </div>

        {/* BOTTOM TITLE & STREAMING METADATA */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-20 pointer-events-none">
          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow">
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300 mt-1">
            <span className="text-[#46d369] font-bold">{matchScore}% Match</span>
            <span className="opacity-40">•</span>
            <span>{item.release_date ? item.release_date.slice(0, 4) : "2024"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
