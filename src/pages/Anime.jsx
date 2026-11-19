import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import MovieModal from "../components/modal/MovieModal";
import { fetchCategoryMovies } from "../utils/movieApi";

const Anime = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroAnime, setHeroAnime] = useState([]);

  useEffect(() => {
    fetchCategoryMovies("trending-anime")
      .then((items) => setHeroAnime(items))
      .catch((err) => console.error("Anime hero error:", err));
  }, []);

  return (
    <div className="pb-24 min-h-screen bg-[#141414] text-white">
      {/* 1. CINEMATIC ANIME HERO */}
      <Hero heroItems={heroAnime} onPlay={setSelectedMovie} />

      {/* 2. NETFLIX ANIME ROWS */}
      <div className="-mt-12 sm:-mt-20 md:-mt-28 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 Anime Today"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Trending Anime"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Rated Anime Classics"
          categoryKey="top-anime"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Anime Movies & Features"
          categoryKey="anime-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Action & Shonen"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 3. MODAL */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Anime;
