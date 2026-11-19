import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCategoryMovies, fetchMoviesByCategory } from "../../utils/movieApi";
import MovieCard from "./MovieCard";

const MovieRow = ({
  title,
  categoryKey,
  items,
  onMovieClick,
}) => {
  const [movies, setMovies] = useState(items || []);
  const [loading, setLoading] = useState(!items || items.length === 0);
  const rowRef = useRef(null);

  useEffect(() => {
    if (items && items.length > 0) {
      setMovies(items);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        let results = [];
        if (categoryKey) {
          results = await fetchCategoryMovies(categoryKey);
        } else {
          results = await fetchMoviesByCategory(title);
        }
        if (isMounted && results) {
          setMovies(results);
        }
      } catch (err) {
        console.error(`Error loading row ${title}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [items, categoryKey, title]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!loading && (!movies || movies.length === 0)) {
    return null;
  }

  return (
    <div className="relative group/row my-4 sm:my-6">
      {/* ROW TITLE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between">
        <h3 className="text-base sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
          {title}
        </h3>
      </div>

      {/* ROW CAROUSEL WRAPPER */}
      <div className="relative">
        {/* LEFT SCROLL CHEVRON */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white z-40 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>

        {/* SCROLLABLE TRACK */}
        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 py-2"
        >
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-md bg-zinc-800 animate-pulse"
                />
              ))
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onMovieClick={onMovieClick}
                />
              ))}
        </div>

        {/* RIGHT SCROLL CHEVRON */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white z-40 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
