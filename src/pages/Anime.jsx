import { useState } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import NewsCarousel from "../components/media/NewsCarousel";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
import MovieModal from "../components/modal/MovieModal";

const Anime = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="pb-24 relative min-h-screen bg-v-anime-base text-gray-200">
      {/* 1. CINEMATIC ANIME HERO */}
      <Hero vertical="anime" onPlay={setSelectedMovie} />

      {/* 2. TOP 10 ANIME WITH SENTIMENT ANALYSIS */}
      <div className="-mt-8 sm:-mt-12 md:-mt-16 relative z-20">
        <Top10Row
          vertical="anime"
          title="Top 10 Anime All Time (Sentiment Analysis & MyAnimeList)"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 3. PINTEREST & FIGMA BENTO DISCOVERY GRID */}
      <div className="relative z-20">
        <BentoDiscoveryGrid vertical="anime" onMovieClick={setSelectedMovie} />
      </div>

      {/* 4. LATEST ANIME NEWS */}
      <div className="relative z-20 py-sp-5 bg-gradient-to-b from-v-anime-base to-v-anime-surface">
        <NewsCarousel vertical="anime" accentColor="orange" />
      </div>

      {/* 5. AESTHETIC ANIME QUOTES */}
      <div className="relative z-20">
        <AestheticQuoteRoundup vertical="anime" />
      </div>

      {/* 6. CRUNCHYROLL & MYANIMELIST SECTIONS */}
      <div className="relative z-20 space-y-sp-4 pt-sp-4 container-mx bg-gradient-to-b from-v-anime-surface to-v-anime-base">
        <MovieRow
          title="Top Rated Classics (Crunchyroll)"
          endpoint="/top/anime"
          isJikan={true}
          vertical="anime"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Currently Airing Simulcasts"
          endpoint="/seasons/now"
          isJikan={true}
          vertical="anime"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Anime Movies & Features"
          endpoint="/top/anime?type=movie"
          isJikan={true}
          vertical="anime"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 7. CINEMATIC MEDIA DOSSIER MODAL */}
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
