import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import MovieModal from "../components/modal/MovieModal";
import { fetchCategoryMovies } from "../utils/movieApi";

const Webseries = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroSeries, setHeroSeries] = useState([]);

  useEffect(() => {
    fetchCategoryMovies("popular-tv")
      .then((items) => setHeroSeries(items))
      .catch((err) => console.error("Webseries hero error:", err));
  }, []);

  return (
    <div className="pb-24 min-h-screen bg-[#141414] text-white">
      {/* 1. CINEMATIC TV HERO */}
      <Hero heroItems={heroSeries} onPlay={setSelectedMovie} />

      {/* 2. NETFLIX TV SHOW ROWS */}
      <div className="-mt-12 sm:-mt-20 md:-mt-28 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 TV Shows Today"
          categoryKey="popular-tv"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Popular TV Shows"
          categoryKey="popular-tv"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Critically Acclaimed TV Shows"
          categoryKey="top-tv"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Korean Dramas & Asian Hits"
          categoryKey="kdrama"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & Fantasy Series"
          categoryKey="scifi"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Binge-Worthy Comedies"
          categoryKey="comedy"
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

export default Webseries;
