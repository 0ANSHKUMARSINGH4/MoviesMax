import { useContext } from "react";
import { Play, Plus, Check, ThumbsUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import { motionHover } from "../../utils/motion";
import { GlobalContext } from "../../context/GlobalState";
import { normalizeMedia } from "../../utils/mediaUtils";
import SmartImage from "./SmartImage";

const MovieCard = ({ movie, onMovieClick, isAnime = false, vertical = "movies" }) => {
  const { watchlist, toggleWatchlist, favorites, toggleFavorite } = useContext(GlobalContext);

  const item = normalizeMedia(movie);
  if (!item) return null;

  const inWatchlist = watchlist?.some((w) => String(w.id) === String(item.id));
  const isLiked = favorites?.some((f) => String(f.id) === String(item.id));

  // Compute match percentage
  const matchPercentage = Math.min(99, Math.max(82, Math.round(item.vote_average * 10) + 3));

  return (
    <div
      onClick={() => onMovieClick && onMovieClick(item)}
      className="relative flex-none w-36 sm:w-44 md:w-52 lg:w-56 cursor-pointer select-none py-4"
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={motionHover}
        className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-dark-card border border-white/5 shadow-card-elevated z-10 will-change-transform group/card"
      >
        {/* Cinematic Glow Behind Card on Hover */}
        <div 
          className="absolute inset-0 bg-blue-accent/30 blur-2xl z-0 rounded-2xl pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" 
        />

        {/* Poster Image — routed through SmartImage for shimmer + fallback */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <SmartImage
            src={item.poster_path}
            alt=""
            title={item.title}
            vertical={vertical}
            decorative
            className="w-full h-full"
            imgClassName="object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
        </div>

        {/* Ambient base vignette */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent z-10 pointer-events-none opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" 
        />
        {/* TEXT SCRIM */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)" }} />

        {/* TOP BADGES (Always visible) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
          {item.vote_average > 0 && (
            <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-meta font-bold text-yellow-400 flex items-center gap-1 shadow-md">
              <Star size={11} fill="currentColor" /> {item.vote_average.toFixed(1)}
            </div>
          )}

          {(isAnime || item.isJikan) && (
            <div className="px-2 py-0.5 rounded-md bg-crunchyroll-orange/90 text-white font-black text-meta uppercase tracking-wider shadow-md">
              SUB | DUB
            </div>
          )}
        </div>

        {/* CENTER HOVER PLAY BUTTON */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-20 opacity-0 scale-90 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-gray-200 transition-all">
            <Play size={20} fill="black" className="translate-x-0.5" />
          </div>
        </div>

        {/* HOVER QUICK ACTION BUTTONS (Top-Right on Hover) */}
        <div 
          className="absolute top-12 right-2.5 flex flex-col gap-2 z-30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-75"
        >
          {/* Watchlist Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(item);
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 opacity-0 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 duration-300 delay-100 ${
              inWatchlist
                ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/40"
                : "bg-black/70 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40"
            }`}
            title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
          </button>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 opacity-0 translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 duration-300 delay-150 ${
              isLiked
                ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/40"
                : "bg-black/70 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40"
            }`}
            title={isLiked ? "Favorited" : "Like"}
          >
            <ThumbsUp size={13} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* BOTTOM METADATA OVERLAY */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 space-y-1.5 z-20 pointer-events-none transform translate-y-1 group-hover/card:translate-y-0 transition-transform">
          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 drop-shadow-md">
            {item.title}
          </h4>

          {/* Streaming Info Row */}
          <div className="flex items-center gap-2 text-meta font-semibold text-gray-300">
            <span className="text-neon-green font-bold drop-shadow">{matchPercentage}%</span>
            <span className="opacity-50">•</span>
            <span>{item.release_date}</span>
            <span className="opacity-50">•</span>
            <span className="border border-white/20 px-1 rounded text-meta font-black text-white bg-white/10 backdrop-blur-sm">
              {item.isJikan ? "ANIME" : "4K"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieCard;
