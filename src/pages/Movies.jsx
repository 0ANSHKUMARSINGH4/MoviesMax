import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import MovieModal from "../components/modal/MovieModal";
import { fetchCategoryMovies } from "../utils/movieApi";

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroMovies, setHeroMovies] = useState([]);

  useEffect(() => {
    fetchCategoryMovies("popular-movies")
      .then((items) => setHeroMovies(items))
      .catch((err) => console.error("Movies hero error:", err));
  }, []);

  return (
    <div className="pb-24 min-h-screen bg-[#141414] text-white">
      {/* 1. CINEMATIC MOVIES HERO */}
      <Hero heroItems={heroMovies} onPlay={setSelectedMovie} />

      {/* 2. NETFLIX MOVIE CAROUSELS */}
      <div className="-mt-12 sm:-mt-20 md:-mt-28 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 Movies Today"
          categoryKey="top-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Popular Movies"
          categoryKey="popular-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Action & Adrenaline"
          categoryKey="action"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & Cyberpunk"
          categoryKey="scifi"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Rated Classics"
          categoryKey="top-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Comedy Hits"
          categoryKey="comedy"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Horror & Chills"
          categoryKey="horror"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Romance & Feel-Good"
          categoryKey="romance"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 3. NETFLIX MODAL */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Movies;
