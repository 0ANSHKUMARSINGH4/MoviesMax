import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { Play, Plus, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const Hero = ({ onPlay }) => {
  const { trending, loading, watchlist, toggleWatchlist } = useContext(GlobalContext);

  if (loading || trending.length === 0) return <div className="h-[80vh] bg-gray-200 dark:bg-dark-main animate-pulse"></div>;

  const heroMovies = trending.slice(0, 5);

  return (
    <div className="relative h-[85vh] w-full text-white group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        navigation={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {heroMovies.map((movie) => {
           const inWatchlist = watchlist.find(item => item.id === movie.id);
           return (
             <SwiperSlide key={movie.id}>
                <div className="absolute inset-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradients - Adjusted for Light/Dark Mode */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent dark:from-dark-main dark:via-dark-main/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent dark:from-dark-main dark:via-dark-main/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-32 z-10">
                  <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-xl animate-in slide-in-from-bottom-10 duration-700 text-white">
                      {movie.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 line-clamp-3 max-w-2xl drop-shadow-md animate-in slide-in-from-bottom-10 duration-1000 delay-100">
                      {movie.overview}
                    </p>

                    <div className="flex items-center gap-4 pt-4 animate-in slide-in-from-bottom-10 duration-1000 delay-200">
                      {/* BLUE THEME BUTTON */}
                      <button
                        onClick={() => onPlay(movie)}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60"
                      >
                        <Play fill="currentColor" size={20} /> Play Now
                      </button>

                      <button
                        onClick={() => toggleWatchlist(movie)}
                        className={`flex items-center gap-3 backdrop-blur-md border px-8 py-4 rounded-xl font-bold transition-colors ${
                          inWatchlist
                            ? "bg-green-600/90 border-green-500 text-white shadow-lg shadow-green-900/20"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        }`}
                      >
                        {inWatchlist ? <Check size={24} /> : <Plus size={24} />}
                        {inWatchlist ? "Added" : "Watchlist"}
                      </button>
                    </div>
                  </div>
                </div>
             </SwiperSlide>
           )
        })}
      </Swiper>
    </div>
  );
};

export default Hero;