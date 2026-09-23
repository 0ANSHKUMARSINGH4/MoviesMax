import { useRef, useContext } from "react";
import { Play, Plus, Check, ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { GlobalContext } from "../../context/GlobalState";
import { TOP10_DATA } from "../../utils/movieData";
import SmartImage from "./SmartImage";
import Section from "../layout/Section";

const Top10Row = ({
  vertical = "movies",
  title,
  items,
  onMovieClick
}) => {
  const { watchlist, toggleWatchlist } = useContext(GlobalContext);
  const rowRef = useRef(null);

  const fallbackList = TOP10_DATA[vertical] || TOP10_DATA.movies;
  const top10List = items && items.length >= 5 ? items.slice(0, 10) : fallbackList;

  const verticalTheme = {
    movies: {
      accent: "bg-blue-600 shadow-[0_0_10px_#2563eb]",
      numeralStroke: "rgba(96, 165, 250, 0.45)",
      shadow: "rgba(37, 99, 235, 0.35)",
      pill: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    series: {
      accent: "bg-purple-600 shadow-[0_0_10px_#9333ea]",
      numeralStroke: "rgba(192, 132, 252, 0.45)",
      shadow: "rgba(147, 51, 234, 0.35)",
      pill: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    anime: {
      accent: "bg-orange-600 shadow-[0_0_10px_#ea580c]",
      numeralStroke: "rgba(251, 146, 60, 0.45)",
      shadow: "rgba(234, 88, 12, 0.35)",
      pill: "text-orange-400 bg-orange-500/10 border-orange-500/20"
    }
  }[vertical] || {
    accent: "bg-blue-600 shadow-[0_0_10px_#2563eb]",
    numeralStroke: "rgba(96, 165, 250, 0.45)",
    shadow: "rgba(37, 99, 235, 0.35)",
    pill: "text-blue-400 bg-blue-500/10 border-blue-500/20"
  };

  const displayTitle =
    title ||
    `Top 10 All Time (Sentiment Analysis & Verified Ratings)`;

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section as="section" className="relative py-sp-4 group/top10 select-none">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-sp-3 gap-sp-1">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-6 rounded-full ${verticalTheme.accent}`} />
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display uppercase flex items-center gap-2">
              {displayTitle}
            </h2>
            <p className="text-xs text-gray-400 font-medium hidden sm:block">
              Ranked through multi-source sentiment scraping: IMDb, Rotten Tomatoes, and community consensus
            </p>
          </div>
        </div>

        <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${verticalTheme.pill}`}>
          <Sparkles size={12} className="inline mr-1" /> Sentiment Verified
        </span>
      </div>

      {/* FULL-HEIGHT EDGE HANDLES */}
      <button
        onClick={() => handleScroll("left")}
        className="hidden md:flex absolute left-2 md:left-4 top-16 bottom-8 w-12 z-30 bg-black/80 hover:bg-black/95 backdrop-blur-md border-r border-white/10 text-white items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-all hover:scale-105 active:scale-95"
        title="Scroll Left"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={() => handleScroll("right")}
        className="hidden md:flex absolute right-2 md:right-4 top-16 bottom-8 w-12 z-30 bg-black/80 hover:bg-black/95 backdrop-blur-md border-l border-white/10 text-white items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-all hover:scale-105 active:scale-95"
        title="Scroll Right"
      >
        <ChevronRight size={28} />
      </button>

      {/* HORIZONTAL CAROUSEL WITH OVERLAPPING GIANT OUTLINE NUMBERS */}
      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 custom-scrollbar no-scrollbar scroll-smooth"
      >
        {top10List.map((item, index) => {
          const rank = index + 1;
          const inWatchlist = watchlist?.some((w) => String(w.id) === String(item.id));
          const rating = item.vote_average || 8.8;

          return (
            <div
              key={`${item.id}-${rank}`}
              className="relative flex-none flex items-end group/item cursor-pointer select-none py-2"
              onClick={() => onMovieClick && onMovieClick(item)}
            >
              {/* GIANT OUTLINE NUMERAL */}
              <div className="relative -mr-6 sm:-mr-8 md:-mr-10 z-0 pointer-events-none">
                <span
                  className="font-black text-7xl sm:text-8xl md:text-9xl text-transparent tracking-tighter"
                  style={{
                    WebkitTextStroke: `2px ${verticalTheme.numeralStroke}`,
                    textShadow: `0 0 30px ${verticalTheme.shadow}`,
                    lineHeight: "0.85",
                  }}
                >
                  {rank}
                </span>
              </div>

              {/* POSTER CARD (Overlaps the number) */}
              <motion.div
                initial={{ scale: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative z-10 w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden bg-[#0c0d14] border border-white/10 group-hover/item:border-white/30 shadow-2xl will-change-transform"
              >
                <SmartImage
                  src={item.poster_path}
                  alt=""
                  title={item.title}
                  vertical={vertical}
                  decorative
                  className="absolute inset-0 w-full h-full"
                  imgClassName="object-cover transition-transform duration-500 group-hover/item:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover/item:opacity-95 transition-opacity" />

                {/* Rating & Sentiment Badge */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20">
                  <div className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-bold text-yellow-400 flex items-center gap-1 shadow-sm">
                    <Star size={11} fill="currentColor" /> {Number(rating).toFixed(1)}
                  </div>

                  {item.sentiment?.score && (
                    <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black tracking-wider shadow-sm backdrop-blur-md">
                      {item.sentiment.score}
                    </div>
                  )}
                </div>

                {/* Bottom Metadata & Hover Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 space-y-1 z-20">
                  <div className="flex items-center gap-2 mb-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMovieClick && onMovieClick(item);
                      }}
                      className="p-2 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg transition-transform active:scale-95"
                      title="Play Trailer"
                    >
                      <Play size={13} fill="black" className="translate-x-0.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(item);
                      }}
                      className={`p-2 rounded-full border transition-transform active:scale-95 ${
                        inWatchlist
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-black/60 border-white/20 text-white hover:bg-white/20"
                      }`}
                      title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                      {inWatchlist ? <Check size={13} /> : <Plus size={13} />}
                    </button>
                  </div>

                  <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                    <span>{item.release_date?.slice(0, 4)}</span>
                    <span className="text-emerald-400 font-bold">{item.sentiment?.label || "Acclaimed"}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default Top10Row;
