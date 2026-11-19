import { useEffect, useState, useRef, useContext } from "react";
import { Play, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { fetchCategoryMovies } from "../../utils/movieApi";
import { normalizeMedia } from "../../utils/mediaUtils";
import { addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";

const Top10Row = ({
  title = "Top 10 in Movies Today",
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
    <div className="relative group/top10 my-6 sm:my-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <h3 className="text-base sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
          {title}
        </h3>
      </div>

      {/* TRACK */}
      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white z-40 flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-opacity duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>

        <div
          ref={rowRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 py-3"
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-48 sm:w-56 aspect-[3/4] bg-zinc-800 rounded animate-pulse"
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
                    {/* GIANT NETFLIX 3D RANK NUMBER */}
                    <div className="relative -mr-5 sm:-mr-8 z-0 pointer-events-none select-none">
                      <span
                        className="font-black text-[95px] sm:text-[130px] md:text-[150px] leading-none tracking-tighter"
                        style={{
                          color: "#141414",
                          WebkitTextStroke: "4px #595959",
                          textShadow: "0 0 15px rgba(0,0,0,0.9)",
                        }}
                      >
                        {rank}
                      </span>
                    </div>

                    {/* MOVIE POSTER */}
                    <div className="relative aspect-[2/3] w-32 sm:w-40 md:w-44 rounded overflow-hidden bg-[#202020] shadow-xl border border-white/5 z-10 transition-transform duration-300 ease-out group-hover/card:scale-105 group-hover/card:shadow-2xl">
                      <img
                        src={item.poster_path || item.backdrop_path}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />

                      {/* TOP BADGE */}
                      <div className="absolute top-1.5 left-1.5 z-20">
                        <span className="text-[#E50914] font-black text-xs drop-shadow">N</span>
                      </div>

                      {/* HOVER OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20 flex flex-col justify-end p-2.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <button
                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                            title="Play"
                          >
                            <Play size={14} fill="black" className="translate-x-0.5" />
                          </button>
                          <button
                            onClick={(e) => handleWatchlist(e, item)}
                            className="w-8 h-8 rounded-full bg-black/60 border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            title={inList ? "In Watchlist" : "Add to List"}
                          >
                            {inList ? <Check size={14} className="text-[#46d369]" /> : <Plus size={14} />}
                          </button>
                        </div>
                        <p className="text-white text-xs font-bold truncate">{item.title}</p>
                        <p className="text-[#46d369] text-[10px] font-bold">Top {rank}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white z-40 flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-opacity duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default Top10Row;
