import React, { useEffect, useState, useRef, useContext } from "react";
import { Play, Plus, Check, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { fetchCategoryMovies } from "../../utils/movieApi";
import { normalizeMedia } from "../../utils/mediaUtils";
import { addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";

const Top10Row = ({
  title = "Top 10 Global Blockbusters",
  categoryKey = "top-10",
  items,
  onMovieClick,
}) => {
  const navigate = useNavigate();
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const [movies, setMovies] = useState(items || []);
  const [loading, setLoading] = useState(!items || items.length === 0);
  const rowRef = useRef(null);

  useEffect(() => {
    if (items && items.length > 0) {
      setMovies(items.slice(0, 10));
      setLoading(false);
      return;
    }

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const results = await fetchCategoryMovies(categoryKey);
        if (isMounted && results) {
          setMovies(results.slice(0, 10));
        }
      } catch (e) {
        console.error("Top10Row fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [items, categoryKey]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleWatchlist = async (e, item) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!defaultPlaylist || !item) return;
    const inWatchlist = isInWatchlist(item.id);
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
        });
      }
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (err) {
      console.error("Top 10 watchlist toggle error:", err);
    }
  };

  if (!loading && (!movies || movies.length === 0)) return null;

  return (
    <div className="relative group/top10 my-6 sm:my-10">
      {/* HEADER WITH BLUE GLOW PILL */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Trophy size={16} />
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {title}
          </h3>
        </div>
      </div>

      {/* TRACK */}
      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 w-12 bg-black/70 hover:bg-black/95 text-white z-40 flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-opacity duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={30} />
        </button>

        <div
          ref={rowRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-5 sm:px-8 lg:px-12 py-3"
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-48 sm:w-56 aspect-[3/4] bg-[#111827] rounded-2xl animate-pulse"
                />
              ))
            : movies.map((movie, idx) => {
                const item = normalizeMedia(movie);
                const rank = idx + 1;
                const inList = user && item?.id ? isInWatchlist(item.id) : false;

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => onMovieClick && onMovieClick(item)}
                    className="relative flex-none flex items-end cursor-pointer group/card select-none"
                  >
                    {/* ELECTRIC BLUE STROKE RANK NUMBER */}
                    <div className="relative -mr-5 sm:-mr-8 z-0 pointer-events-none select-none">
                      <span
                        className="font-black text-[95px] sm:text-[130px] md:text-[150px] leading-none tracking-tighter"
                        style={{
                          color: "#0B1120",
                          WebkitTextStroke: "4px rgba(96, 165, 250, 0.6)",
                          textShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* POSTER CARD */}
                    <div className="relative aspect-[2/3] w-32 sm:w-40 md:w-44 rounded-2xl overflow-hidden bg-[#111827] shadow-xl border border-white/10 z-10 transition-transform duration-200 ease-out group-hover/card:scale-105 group-hover/card:border-blue-500/60">
                      <img
                        src={item.poster_path || item.backdrop_path}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />

                      {/* TOP BADGE */}
                      <div className="absolute top-2 left-2 z-20">
                        <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-[10px] font-black text-white shadow-md shadow-blue-600/40">
                          #{rank}
                        </span>
                      </div>

                      {/* HOVER OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/95 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20 flex flex-col justify-end p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                            title="Play Trailer"
                          >
                            <Play size={14} fill="black" className="translate-x-0.5" />
                          </button>
                          <button
                            onClick={(e) => handleWatchlist(e, item)}
                            className="w-8 h-8 rounded-full bg-black/60 border border-white/40 text-white flex items-center justify-center hover:bg-blue-600/40 hover:border-blue-400 transition-all"
                            title={inList ? "In Watchlist" : "Add to List"}
                          >
                            {inList ? <Check size={14} className="text-blue-400" /> : <Plus size={14} />}
                          </button>
                        </div>
                        <p className="text-white text-xs font-bold truncate">{item.title}</p>
                        <p className="text-blue-400 text-[11px] font-bold">Top {rank} Worldwide</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 bottom-0 w-12 bg-black/70 hover:bg-black/95 text-white z-40 flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-opacity duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Top10Row);
