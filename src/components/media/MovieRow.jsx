import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalState";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import { Plus, Check, Play } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const MovieRow = ({ title, endpoint, isJikan = false, onMovieClick }) => {
  const { API_KEY, BASE_URL, watchlist, toggleWatchlist } = useContext(GlobalContext);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let results = [];
        if (isJikan) {
            // Fetch from Jikan API (Anime)
            const res = await axios.get(`https://api.jikan.moe/v4${endpoint}`);
            results = res.data.data.map(anime => ({
                id: anime.mal_id,
                title: anime.title,
                poster_path: anime.images.jpg.large_image_url,
                vote_average: anime.score,
                isJikan: true
            }));
        } else {
            // Fetch from TMDB API (Movies)
            const res = await axios.get(`${BASE_URL}${endpoint}`, {
                params: { api_key: API_KEY },
            });
            results = res.data.results;
        }
        setMovies(results);
      } catch (error) {
        console.error("Error fetching row:", title);
      }
    };
    fetchMovies();
  }, [endpoint, API_KEY, BASE_URL, title, isJikan]);

  return (
    <div className="py-4 px-8 md:px-12 space-y-4">
      {/* Row Title - Blue Hover Effect */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer inline-block pl-1 border-l-4 border-transparent hover:border-blue-600">
        {title}
      </h2>

      <Swiper
        modules={[Navigation, Mousewheel]}
        mousewheel={true}
        navigation={true}
        spaceBetween={20}
        slidesPerView={2.5}
        breakpoints={{
          640: { slidesPerView: 3.5 },
          768: { slidesPerView: 4.5 },
          1024: { slidesPerView: 5.5 },
          1280: { slidesPerView: 6.5 },
        }}
        className="w-full h-full !pb-8 !px-1"
      >
        {movies.map((movie) => {
          const inWatchlist = watchlist.find((item) => item.id === movie.id);

          return (
            <SwiperSlide key={movie.id}>
              {/* CARD CONTAINER - Blue Theme & Light/Dark Mode */}
              <div
                onClick={() => onMovieClick && onMovieClick(movie)}
                className="group relative cursor-pointer rounded-xl overflow-hidden
                bg-white dark:bg-[#181818] shadow-sm dark:shadow-none
                transition-all duration-300 hover:scale-105 hover:-translate-y-2
                hover:shadow-xl hover:shadow-blue-900/20 dark:hover:shadow-blue-900/40
                ring-1 ring-gray-200 dark:ring-white/5 hover:ring-blue-600 dark:hover:ring-blue-500/50"
              >
                {/* Image Aspect Ratio Container */}
                <div className="aspect-[2/3] w-full relative">
                    <img
                      src={movie.isJikan ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:contrast-110"
                    />

                    {/* DARK OVERLAY (Only visible on hover) */}
                    <div className="absolute inset-0 bg-blue-900/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">

                        {/* Play Button - Blue */}
                        <div className="bg-blue-600 p-3 rounded-full text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 shadow-lg shadow-blue-500/50">
                            <Play fill="currentColor" size={20} />
                        </div>

                        {/* Watchlist Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWatchlist(movie);
                            }}
                            className={`p-2.5 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 shadow-lg ${inWatchlist ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-blue-50 hover:text-blue-600'}`}
                        >
                            {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                        </button>
                    </div>
                </div>

                {/* Text Content */}
                <div className="p-3 bg-white dark:bg-[#181818]">
                   <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                     {movie.title}
                   </h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500 border border-gray-300 dark:border-gray-700 px-1 rounded">HD</span>
                      <span className="text-[10px] text-gray-500">{movie.isJikan ? 'Anime' : 'Movie'}</span>
                   </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MovieRow;