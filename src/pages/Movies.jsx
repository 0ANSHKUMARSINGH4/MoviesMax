import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import ContinueWatchingRow from "../components/media/ContinueWatchingRow";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
import NewsCarousel from "../components/media/NewsCarousel";
import MovieModal from "../components/modal/MovieModal";
import { fetchTrendingMovies, fetchMoviesByVertical } from "../utils/movieApi";

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroMovies, setHeroMovies] = useState([]);
  const [movieRows, setMovieRows] = useState([]);

  useEffect(() => {
    fetchTrendingMovies().then(setHeroMovies).catch(console.error);
    fetchMoviesByVertical("movies").then(setMovieRows).catch(console.error);
  }, []);

  const moviesList = Array.isArray(movieRows) ? movieRows : [];

  return (
    <div className="pb-24 relative min-h-screen bg-v-movies-base text-gray-200 transition-colors duration-300">
      {/* 1. CINEMATIC MOVIES HERO */}
      <Hero vertical="movies" heroItems={heroMovies} onPlay={setSelectedMovie} />

      {/* 2. CONTINUE WATCHING / ACTIVE QUEUE */}
      <div className="-mt-8 md:-mt-12 relative z-20">
        <ContinueWatchingRow onMovieClick={setSelectedMovie} />
      </div>

      {/* 3. FLIXSTREAM TOP 10 MOVIES (Sentiment Analysis Powered) */}
      <div className="relative z-20 py-sp-5">
        <Top10Row
          vertical="movies"
          title="Top 10 Movies All Time (Sentiment Analysis & Verified Ratings)"
          items={moviesList.length >= 5 ? moviesList.slice(0, 10) : undefined}
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 4. PINTEREST & FIGMA BENTO DISCOVERY GRID */}
      <div className="relative z-20">
        <BentoDiscoveryGrid vertical="movies" onMovieClick={setSelectedMovie} />
      </div>

      {/* 5. LATEST MOVIE UPDATES & CASTINGS */}
      <div className="relative z-20 py-sp-5 bg-gradient-to-b from-v-movies-base to-v-movies-surface">
        <NewsCarousel vertical="movies" accentColor="blue" />
      </div>

      {/* 6. AESTHETIC CINEMATIC QUOTES */}
      <div className="relative z-20">
        <AestheticQuoteRoundup vertical="movies" />
      </div>

      {/* 7. CURATED MOVIE CATEGORIES */}
      <div className="relative z-20 space-y-sp-4 container-mx">
        <MovieRow
          title="Trending Blockbusters"
          vertical="movies"
          items={moviesList.length >= 4 ? moviesList.slice(0, 8) : undefined}
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Rated Classics"
          vertical="movies"
          items={moviesList.length >= 8 ? moviesList.slice(4, 12) : undefined}
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Action Thrillers"
          vertical="movies"
          items={moviesList.length >= 12 ? moviesList.slice(8, 16) : undefined}
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & Cyberpunk"
          vertical="movies"
          items={moviesList.length >= 16 ? moviesList.slice(12, 20) : undefined}
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Comedy Hits"
          vertical="movies"
          items={moviesList.length >= 6 ? moviesList.slice(2, 10) : undefined}
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 8. CINEMATIC MEDIA DOSSIER MODAL */}
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
