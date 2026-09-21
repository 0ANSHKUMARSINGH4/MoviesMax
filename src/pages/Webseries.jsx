import { useState } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import ContinueWatchingRow from "../components/media/ContinueWatchingRow";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
import NewsCarousel from "../components/media/NewsCarousel";
import MovieModal from "../components/modal/MovieModal";

const Webseries = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="pb-24 relative min-h-screen bg-v-series-base text-gray-200">
      {/* 1. CINEMATIC TV SHOWS HERO */}
      <Hero vertical="series" onPlay={setSelectedMovie} />

      {/* 2. CONTINUE WATCHING QUEUE */}
      <div className="-mt-8 md:-mt-12 relative z-20">
        <ContinueWatchingRow onMovieClick={setSelectedMovie} />
      </div>

      {/* 3. TOP 10 TV SHOWS (Sentiment Analysis Powered) */}
      <div className="relative z-20 py-sp-5">
        <Top10Row
          vertical="series"
          title="Top 10 TV Series All Time (Sentiment Analysis & Verified Ratings)"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 4. PINTEREST & FIGMA BENTO DISCOVERY GRID */}
      <div className="relative z-20">
        <BentoDiscoveryGrid vertical="series" onMovieClick={setSelectedMovie} />
      </div>

      {/* 5. LATEST SERIES NEWS */}
      <div className="relative z-20 py-sp-5 bg-gradient-to-b from-v-series-base to-v-series-surface">
        <NewsCarousel vertical="webseries" accentColor="purple" />
      </div>

      {/* 6. AESTHETIC SERIES DIALOGUE */}
      <div className="relative z-20">
        <AestheticQuoteRoundup vertical="series" />
      </div>

      {/* 7. VERIFIED SERIES CATEGORY ROWS */}
      <div className="relative z-20 space-y-sp-4 pt-sp-4 container-mx bg-gradient-to-b from-v-series-surface to-v-series-base">
        <MovieRow
          title="Western Prestige TV"
          vertical="series"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Korean Dramas (K-Dramas)"
          vertical="series"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & Fantasy Epics"
          vertical="series"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Crime & Mystery Thrillers"
          vertical="series"
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

export default Webseries;
