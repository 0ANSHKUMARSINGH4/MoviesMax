import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
import PlaylistRecordDeck from "../components/media/PlaylistRecordDeck";
import MovieModal from "../components/modal/MovieModal";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { fetchTrendingMovies } from "../utils/movieApi";

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    fetchTrendingMovies()
      .then((items) => setHeroItems(items))
      .catch((err) => console.error("Home trending error:", err));
  }, []);

  return (
    <div className="pb-24 min-h-screen bg-[#0B1120] text-white">
      {/* 1. CINEMATIC BLUE & WHITE BILLBOARD HERO */}
      <Hero heroItems={heroItems} onPlay={setSelectedMovie} />

      {/* 2. TOP 10 WORLDWIDE BLOCKBUSTERS */}
      <div className="-mt-12 sm:-mt-20 md:-mt-24 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 Global Blockbusters"
          categoryKey="top-10"
          onMovieClick={setSelectedMovie}
        />

        {/* 3. TRENDING NOW */}
        <MovieRow
          title="Trending Blockbusters"
          categoryKey="trending"
          onMovieClick={setSelectedMovie}
        />

        {/* 4. INTERACTIVE 3D PLAYLIST RECORD DECK (Vinyl Record Carousel) */}
        <PlaylistRecordDeck onPlay={setSelectedMovie} />

        {/* 5. CINEMATIC BENTO DISCOVERY GRID (Unique MoviesMax Editorial) */}
        <div className="py-4">
          <BentoDiscoveryGrid vertical="movies" onMovieClick={setSelectedMovie} />
        </div>

        {/* 5. POPULAR MOVIES & PRESTIGE SERIES */}
        <MovieRow
          title="Popular Hollywood & World Cinema"
          categoryKey="popular-movies"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Binge-Worthy TV Series"
          categoryKey="popular-tv"
          onMovieClick={setSelectedMovie}
        />

        {/* 6. AESTHETIC DIALOGUE ROUNDUP (Unique Words That Resonate) */}
        <div className="py-4">
          <AestheticQuoteRoundup vertical="movies" />
        </div>

        {/* 7. ANIME MASTERPIECES */}
        <MovieRow
          title="Top Anime Masterpieces"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />

        {/* 8. ACTION & SCI-FI */}
        <MovieRow
          title="Action & High Adrenaline"
          categoryKey="action"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & Cyberpunk"
          categoryKey="scifi"
          onMovieClick={setSelectedMovie}
        />

        {/* 9. KOREAN DRAMAS & ASIAN CINEMA */}
        <MovieRow
          title="Korean Dramas & Asian Cinema"
          categoryKey="kdrama"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 10. POLISHED CINEMA THEATRE MODAL */}
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

export default Home;
