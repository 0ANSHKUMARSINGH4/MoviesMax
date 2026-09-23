import { useContext } from "react";
import { Play, Plus, Check, ThumbsUp, Star } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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

  // Framer Motion Variants
  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  const imageVariants = {
    rest: { scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.08, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const overlayVariants = {
    rest: { opacity: 0.8 },
    hover: { opacity: 0.95 }
  };

  const buttonVariants = {
    rest: { opacity: 0, scale: 0.8 },
    hover: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 15 } }
  };

  const actionGroupVariants = {
    rest: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    hover: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const actionItemVariants = {
    rest: { opacity: 0, x: 10, scale: 0.8 },
    hover: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  return (
    <div
      onClick={() => onMovieClick && onMovieClick(item)}
      className="relative flex-none w-36 sm:w-44 md:w-52 lg:w-56 cursor-pointer select-none py-4"
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={cardVariants}
        className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-dark-card border border-white/5 shadow-card-elevated z-10 will-change-transform"
      >
        {/* Cinematic Glow Behind Card on Hover */}
        <motion.div 
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          className="absolute inset-0 bg-blue-accent/30 blur-2xl z-0 rounded-2xl pointer-events-none will-change-opacity" 
        />

        {/* Poster Image — routed through SmartImage for shimmer + fallback */}
        <motion.div variants={imageVariants} className="absolute inset-0 z-10">
          <SmartImage
            src={item.poster_path}
            alt=""
            title={item.title}
            vertical={vertical}
            decorative
            className="w-full h-full"
            imgClassName="object-cover"
          />
        </motion.div>

        {/* Ambient base vignette */}
        <motion.div 
          variants={overlayVariants}
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent z-10 pointer-events-none" 
        />

        {/* TOP BADGES (Always visible) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
          {item.vote_average > 0 && (
            <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-bold text-yellow-400 flex items-center gap-1 shadow-md">
              <Star size={11} fill="currentColor" /> {item.vote_average.toFixed(1)}
            </div>
          )}

          {(isAnime || item.isJikan) && (
            <div className="px-2 py-0.5 rounded-md bg-crunchyroll-orange/90 text-white font-black text-[9px] uppercase tracking-wider shadow-md">
              SUB | DUB
            </div>
          )}
        </div>

        {/* CENTER HOVER PLAY BUTTON */}
        <motion.div 
          variants={buttonVariants}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-gray-200 transition-all">
            <Play size={20} fill="black" className="translate-x-0.5" />
          </div>
        </motion.div>

        {/* HOVER QUICK ACTION BUTTONS (Top-Right on Hover) */}
        <motion.div 
          variants={actionGroupVariants}
          className="absolute top-12 right-2.5 flex flex-col gap-2 z-30"
        >
          {/* Watchlist Toggle */}
          <motion.button
            variants={actionItemVariants}
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(item);
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
              inWatchlist
                ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/40"
                : "bg-black/70 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40"
            }`}
            title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
          </motion.button>

          {/* Like Button */}
          <motion.button
            variants={actionItemVariants}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
              isLiked
                ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-600/40"
                : "bg-black/70 border-white/20 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40"
            }`}
            title={isLiked ? "Favorited" : "Like"}
          >
            <ThumbsUp size={13} fill={isLiked ? "currentColor" : "none"} />
          </motion.button>
        </motion.div>

        {/* BOTTOM METADATA OVERLAY */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 space-y-1.5 z-20 pointer-events-none transform translate-y-1 group-hover/card:translate-y-0 transition-transform">
          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow-md">
            {item.title}
          </h4>

          {/* Streaming Info Row */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-gray-300">
            <span className="text-neon-green font-bold drop-shadow">{matchPercentage}%</span>
            <span className="opacity-50">•</span>
            <span>{item.release_date}</span>
            <span className="opacity-50">•</span>
            <span className="border border-white/20 px-1 rounded text-[9px] font-black text-white bg-white/10 backdrop-blur-sm">
              {item.isJikan ? "ANIME" : "4K"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieCard;
