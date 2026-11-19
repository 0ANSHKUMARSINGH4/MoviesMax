import { useState, useEffect } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import Top10Row from "../components/media/Top10Row";
import MovieModal from "../components/modal/MovieModal";
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
    <div className="pb-24 min-h-screen bg-[#141414] text-white">
      {/* 1. CINEMATIC BILLBOARD HERO */}
      <Hero heroItems={heroItems} onPlay={setSelectedMovie} />

      {/* 2. OVERLAPPING NETFLIX CAROUSEL ROWS */}
      <div className="-mt-12 sm:-mt-20 md:-mt-28 relative z-20 space-y-4">
        {/* TOP 10 TODAY */}
        <Top10Row
          title="Top 10 in Movies & TV Today"
          categoryKey="top-10"
          onMovieClick={setSelectedMovie}
        />

        {/* TRENDING NOW */}
        <MovieRow
          title="Trending Now"
          categoryKey="trending"
          onMovieClick={setSelectedMovie}
        />

        {/* POPULAR MOVIES */}
        <MovieRow
          title="Popular Movies"
          categoryKey="popular-movies"
          onMovieClick={setSelectedMovie}
        />

        {/* BINGE-WORTHY TV SHOWS */}
        <MovieRow
          title="Binge-Worthy TV Shows"
          categoryKey="popular-tv"
          onMovieClick={setSelectedMovie}
        />

        {/* TOP RATED ANIME */}
        <MovieRow
          title="Top Rated Anime"
          categoryKey="trending-anime"
          onMovieClick={setSelectedMovie}
        />

        {/* ACTION BLOCKBUSTERS */}
        <MovieRow
          title="Action & Adventure"
          categoryKey="action"
          onMovieClick={setSelectedMovie}
        />

        {/* SCI-FI & FANTASY */}
        <MovieRow
          title="Sci-Fi & Cyberpunk"
          categoryKey="scifi"
          onMovieClick={setSelectedMovie}
        />

        {/* K-DRAMAS */}
        <MovieRow
          title="Korean Dramas & International"
          categoryKey="kdrama"
          onMovieClick={setSelectedMovie}
        />

        {/* COMEDY HITS */}
        <MovieRow
          title="Comedy Hits"
          categoryKey="comedy"
          onMovieClick={setSelectedMovie}
        />

        {/* HORROR & THRILLERS */}
        <MovieRow
          title="Horror & Thrillers"
          categoryKey="horror"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* 3. NETFLIX MOVIE MODAL */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Home;
