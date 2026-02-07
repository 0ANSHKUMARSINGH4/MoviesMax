import { useState } from "react";
import Hero from "../components/media/Hero";
import MovieRow from "../components/media/MovieRow";
import MovieModal from "../components/modal/MovieModal";

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="pb-20 relative min-h-screen">

      {/* HERO SECTION */}
      <Hero onPlay={setSelectedMovie} />

      {/* MOVIE ROWS WRAPPER
          - Changed margin to '-mt-10' (was likely -20 or more) to reduce overlap.
          - In mobile (default), it's -mt-6, on md screens it's -mt-10.
          - This keeps a slight, clean overlap for style without covering text.
      */}
      <div className="-mt-6 md:-mt-10 relative z-20 space-y-12
        bg-gradient-to-t from-gray-50 via-gray-50 dark:from-dark-main dark:via-dark-main to-transparent
        pt-12 px-4 transition-colors duration-300"
      >
        <MovieRow
          title="Trending Now"
          endpoint="/trending/movie/week"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Rated Movies"
          endpoint="/movie/top_rated"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Top Anime (MyAnimeList)"
          endpoint="/top/anime"
          isJikan={true}
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Action Thrillers"
          endpoint="/discover/movie?with_genres=28"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Comedy Hits"
          endpoint="/discover/movie?with_genres=35"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Sci-Fi & Fantasy"
          endpoint="/discover/movie?with_genres=878"
          onMovieClick={setSelectedMovie}
        />

        <MovieRow
          title="Horror Specials"
          endpoint="/discover/movie?with_genres=27"
          onMovieClick={setSelectedMovie}
        />
      </div>

      {/* GLOBAL MODAL */}
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