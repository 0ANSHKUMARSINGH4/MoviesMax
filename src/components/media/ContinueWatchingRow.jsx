import { Play, X, Film } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { normalizeMedia } from "../../utils/mediaUtils";
import SmartImage from "./SmartImage";

const ContinueWatchingRow = ({ onMovieClick }) => {
  const { watchlist, toggleWatchlist } = useContext(GlobalContext);

  if (!watchlist || watchlist.length === 0) return null;

  return (
    <section className="py-6 px-4 md:px-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2 font-display">
              Continue Watching
              <span className="text-xs normal-case font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {watchlist.length} in Queue
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* 16:9 LANDSCAPE HORIZONTAL QUEUE */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 custom-scrollbar no-scrollbar scroll-smooth">
        {watchlist.map((raw, index) => {
          const item = normalizeMedia(raw);
          if (!item) return null;

          const mockProgress = ((item.title.length * 13) % 65) + 30; // Between 30% and 95%
          const mockEpisode = `S1:E${(index % 8) + 1}`;

          return (
            <motion.div
              key={item.id}
              onClick={() => onMovieClick && onMovieClick(item)}
              initial={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex-none w-64 sm:w-72 md:w-80 group cursor-pointer select-none rounded-2xl overflow-hidden bg-[#0f1118] border border-white/10 hover:border-emerald-500/50 transition-colors duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 will-change-transform"
            >
              {/* 16:9 Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden">
                <SmartImage
                  src={item.backdrop_path}
                  alt=""
                  title={item.title}
                  vertical="movies"
                  decorative
                  className="absolute inset-0 w-full h-full"
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Center Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 transform scale-90 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
                    <Play size={20} fill="white" className="translate-x-0.5" />
                  </div>
                </div>

                {/* Quick Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlist(item);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-gray-300 hover:text-white transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
                  title="Remove from queue"
                >
                  <X size={14} />
                </button>

                {/* NEON GREEN PROGRESS BAR */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981] transition-all duration-500"
                    style={{ width: `${mockProgress}%` }}
                  />
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <span className="font-semibold text-emerald-400">{mockEpisode}</span>
                    <span>•</span>
                    <span>{mockProgress}% watched</span>
                  </p>
                </div>

                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <Film size={14} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
