import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
import MovieModal from "../components/modal/MovieModal";
import ErrorBoundary from "../components/common/ErrorBoundary";
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
    <div className="pb-24 min-h-screen bg-[#0B1120] text-white">
      {/* 1. CINEMATIC MOVIES HERO */}
      <Hero heroItems={heroMovies} onPlay={setSelectedMovie} />

      {/* 2. TOP 10 MOVIES */}
      <div className="-mt-12 sm:-mt-20 md:-mt-24 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 Movies Worldwide"
          categoryKey="top-movies"
          onMovieClick={setSelectedMovie}
        />

        {/* 3. BENTO DISCOVERY GRID */}
        <div className="py-4">
          <BentoDiscoveryGrid vertical="movies" onMovieClick={setSelectedMovie} />
        </div>

        {/* 4. POPULAR & ACTION */}
        <MovieRow
          title="Popular Blockbusters"
          categoryKey="popular-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Action & Adrenaline"
          categoryKey="action"
          onMovieClick={setSelectedMovie}
        />

        {/* 5. AESTHETIC CINEMA DIALOGUE */}
        <div className="py-4">
          <AestheticQuoteRoundup vertical="movies" />
        </div>

        {/* 6. SCI-FI & CLASSICS */}
        <MovieRow
          title="Sci-Fi & Cyberpunk Visions"
          categoryKey="scifi"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Rated All-Time Classics"
          categoryKey="top-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Comedy Hits & Feel-Good"
          categoryKey="comedy"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Horror & Suspense Thrillers"
          categoryKey="horror"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 7. CINEMA THEATRE MODAL */}
      {selectedMovie && (
        <ErrorBoundary onReset={() => setSelectedMovie(null)}>
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Movies;
