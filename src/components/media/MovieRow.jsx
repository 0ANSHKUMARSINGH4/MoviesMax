import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMoviesByCategory } from "../../utils/movieApi";
import { CATEGORY_CATALOG } from "../../utils/movieData";
import MovieCard from "./MovieCard";
import Section from "../layout/Section";

const MovieRow = ({
  title,
  endpoint,
  isJikan = false,
  vertical = "movies",
  items,
  onMovieClick,
}) => {
  const [movies, setMovies] = useState(items || []);
  const rowRef = useRef(null);

  useEffect(() => {
    if (items && items.length > 0) {
      setMovies(items);
      return;
    }

    let isMounted = true;
    const fetchMovies = async () => {
      try {
        let results = [];
        if (isJikan && endpoint) {
          try {
            const res = await axios.get(`https://api.jikan.moe/v4${endpoint}`, { timeout: 3500 });
            if (res.data?.data && res.data.data.length > 0) {
              results = res.data.data.map((anime) => ({
                id: anime.mal_id,
                title: anime.title,
                poster_path: anime.images.jpg.large_image_url,
                backdrop_path: anime.images.jpg.large_image_url,
                vote_average: anime.score || 8.6,
                isJikan: true,
                category: "Anime",
                release_date: anime.aired?.from ? String(anime.aired.from).slice(0, 4) : "2024"
              }));
            }
          } catch (e) {
            results = CATEGORY_CATALOG["currently airing simulcasts"];
          }
        } else {
          results = await fetchMoviesByCategory(title);
        }

        if (isMounted) {
          if (results && results.length > 0) {
            setMovies(results);
          } else {
            setMovies(CATEGORY_CATALOG["trending blockbusters"]);
          }
        }
      } catch {
        if (isMounted) {
          setMovies(CATEGORY_CATALOG["trending blockbusters"]);
        }
      }
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, [endpoint, title, isJikan, items]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const accentColor = {
    movies: "bg-blue-600 shadow-[0_0_10px_#2563eb]",
    series: "bg-purple-600 shadow-[0_0_10px_#9333ea]",
    anime: "bg-orange-600 shadow-[0_0_10px_#ea580c]",
    sports: "bg-emerald-600 shadow-[0_0_10px_#10b981]",
    esports: "bg-pink-600 shadow-[0_0_10px_#ec4899]",
  }[vertical] || (isJikan ? "bg-orange-600 shadow-[0_0_10px_#ea580c]" : "bg-blue-600 shadow-[0_0_10px_#2563eb]");

  return (
    <Section as="section" className="relative py-sp-4 group/row select-none">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-sp-3">
        <div className="flex items-center gap-sp-1">
          <div className={`w-1 h-5 rounded-full ${accentColor}`} />
          <h2 className="text-section font-display flex items-center gap-sp-1">
            {title}
            {isJikan && (
              <span className="text-meta font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                Simulcast
              </span>
            )}
          </h2>
        </div>

        <span className="text-meta text-gray-400 hover:text-white font-semibold cursor-pointer transition-colors hidden sm:inline">
          Explore All →
        </span>
      </div>

      {/* FULL-HEIGHT EDGE CAROUSEL HANDLES */}
      <button
        onClick={() => handleScroll("left")}
        className="hidden md:flex absolute left-0 top-14 bottom-8 w-10 z-30 bg-black/80 hover:bg-black/95 backdrop-blur-md border-r border-white/10 text-white items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:scale-105 active:scale-95"
        title="Scroll Left"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={() => handleScroll("right")}
        className="hidden md:flex absolute right-0 top-14 bottom-8 w-10 z-30 bg-black/80 hover:bg-black/95 backdrop-blur-md border-l border-white/10 text-white items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all hover:scale-105 active:scale-95"
        title="Scroll Right"
      >
        <ChevronRight size={28} />
      </button>

      {/* HORIZONTAL CAROUSEL CONTAINER */}
      <div
        ref={rowRef}
        className="flex gap-sp-3 overflow-x-auto pb-sp-2 pt-1 custom-scrollbar no-scrollbar scroll-smooth"
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id || movie.title}-${index}`}
            movie={movie}
            onMovieClick={onMovieClick}
            isAnime={isJikan}
            vertical={vertical}
          />
        ))}
      </div>
    </Section>
  );
};

export default MovieRow;