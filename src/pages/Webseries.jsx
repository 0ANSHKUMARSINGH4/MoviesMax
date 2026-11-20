import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
import MovieModal from "../components/modal/MovieModal";
import ErrorBoundary from "../components/common/ErrorBoundary";
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
    <div className="pb-24 min-h-screen bg-[#110B20] text-white">
      {/* 1. CINEMATIC TV HERO */}
      <Hero heroItems={heroSeries} onPlay={setSelectedMovie} />

      {/* 2. TOP 10 SHOWS */}
      <div className="-mt-12 sm:-mt-20 md:-mt-24 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 TV Series Worldwide"
          categoryKey="popular-tv"
          onMovieClick={setSelectedMovie}
        />

        {/* 3. BENTO DISCOVERY GRID */}
        <div className="py-4">
          <BentoDiscoveryGrid vertical="series" onMovieClick={setSelectedMovie} />
        </div>

        {/* 4. POPULAR TV & CRITICALLY ACCLAIMED */}
        <MovieRow
          title="Popular Binge-Worthy TV"
          categoryKey="popular-tv"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Critically Acclaimed Dramas"
          categoryKey="top-tv"
          onMovieClick={setSelectedMovie}
        />

        {/* 5. AESTHETIC SERIES DIALOGUE */}
        <div className="py-4">
          <AestheticQuoteRoundup vertical="series" />
        </div>

        {/* 6. KOREAN DRAMAS & SCI-FI */}
        <MovieRow
          title="Korean Dramas & Asian Hits"
          categoryKey="kdrama"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & High Fantasy TV"
          categoryKey="scifi"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Binge-Worthy Comedies"
          categoryKey="comedy"
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

export default Webseries;
