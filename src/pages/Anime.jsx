import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import AestheticQuoteRoundup from "../components/media/AestheticQuoteRoundup";
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
    <div className="pb-24 min-h-screen bg-[#1A0A0A] text-white">
      {/* 1. CINEMATIC ANIME HERO */}
      <Hero heroItems={heroAnime} onPlay={setSelectedMovie} />

      {/* 2. TOP 10 ANIME */}
      <div className="-mt-12 sm:-mt-20 md:-mt-24 relative z-20 space-y-4">
        <Top10Row
          title="Top 10 Anime Worldwide"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />

        {/* 3. BENTO DISCOVERY GRID (ANIME) */}
        <div className="py-4">
          <BentoDiscoveryGrid vertical="anime" onMovieClick={setSelectedMovie} />
        </div>

        {/* 4. TRENDING ANIME SIMULCASTS */}
        <MovieRow
          title="Trending Anime Simulcasts"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />

        {/* 5. AESTHETIC ANIME DIALOGUE */}
        <div className="py-4">
          <AestheticQuoteRoundup vertical="anime" />
        </div>

        {/* 6. TOP RATED ANIME & FEATURES */}
        <MovieRow
          title="Top Rated Anime Classics"
          categoryKey="top-anime"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Anime Theatrical Movies & Features"
          categoryKey="anime-movies"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 7. CINEMA THEATRE MODAL */}
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
