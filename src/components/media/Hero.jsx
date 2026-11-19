import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { Play, Info, Plus, Check, Volume2, VolumeX } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { normalizeMedia } from "../../utils/mediaUtils";
import { addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";

import "swiper/css";
import "swiper/css/effect-fade";

const Hero = ({ heroItems, items, onPlay }) => {
  const navigate = useNavigate();
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const rawList = heroItems && heroItems.length > 0 ? heroItems : items;

  if (!rawList || rawList.length === 0) {
    return (
      <div className="relative h-[75vh] sm:h-[85vh] w-full bg-[#141414] animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-[#E50914] animate-spin" />
      </div>
    );
  }

  const normalizedItems = rawList.slice(0, 6).map((item) => normalizeMedia(item));
  const activeItem = normalizedItems[activeIndex] || normalizedItems[0];
  const activeInWatchlist = user && activeItem?.id ? isInWatchlist(activeItem.id) : false;
  const matchScore = Math.min(99, Math.max(78, Math.round((activeItem?.vote_average || 8.0) * 10 + 8)));

  const handleWatchlistToggle = async (item) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!defaultPlaylist || !item) return;
    try {
      if (activeInWatchlist) {
        await removeMovieFromPlaylist(defaultPlaylist._id, String(item.id));
      } else {
        await addMovieToPlaylist(defaultPlaylist._id, {
          tmdbId: String(item.id),
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
          vote_average: item.vote_average,
          release_date: item.release_date,
          genres: item.genres,
          runtime: item.runtime || null,
        });
      }
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (e) {
      console.error("Hero watchlist error:", e);
    }
  };

  return (
    <div className="relative h-[78vh] sm:h-[85vh] md:h-[88vh] w-full text-white overflow-hidden select-none bg-[#141414]">
      {/* 1. CINEMATIC SWIPER BILLBOARD */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        slidesPerView={1}
        autoplay={{ delay: 8500, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {normalizedItems.map((item, index) => (
          <SwiperSlide key={item.id || index} className="relative h-full w-full">
            <div className="absolute inset-0">
              <img
                src={item.backdrop_path || item.poster_path}
                alt={item.title}
                className="w-full h-full object-cover object-[center_20%] opacity-90 transition-transform duration-1000 ease-out"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* NETFLIX SIGNATURE GRADIENTS */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent w-full md:w-3/5" />
              <div className="absolute inset-x-0 bottom-0 h-48 sm:h-64 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 2. BILLBOARD FOREGROUND CONTENT */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 w-full z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl sm:max-w-2xl space-y-3 sm:space-y-4 pointer-events-auto">
            {/* NETFLIX SERIES / FILM BADGE */}
            <div className="flex items-center gap-2">
              <span className="text-[#E50914] font-black text-xl tracking-tighter">N</span>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                {activeItem?.category === "TV Show" ? "SERIES" : "FILM"}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-md">
              {activeItem?.title}
            </h1>

            {/* METADATA ROW */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-semibold flex-wrap">
              <span className="text-[#46d369] font-bold">{matchScore}% Match</span>
              <span>{activeItem?.release_date ? activeItem.release_date.slice(0, 4) : "2024"}</span>
              <span className="border border-zinc-600 bg-zinc-900/60 px-1.5 py-0.5 rounded text-[11px]">16+</span>
              <span className="border border-zinc-600 bg-zinc-900/60 px-1.5 py-0.5 rounded text-[11px]">4K ULTRA HD</span>
              {activeItem?.runtime && <span>{activeItem.runtime}</span>}
            </div>

            {/* SYNOPSIS */}
            <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow font-normal max-w-xl">
              {activeItem?.overview}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlay && onPlay(activeItem)}
                className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded font-bold text-sm sm:text-base transition-colors duration-200 shadow-lg"
              >
                <Play size={18} fill="black" /> Play Trailer
              </button>

              <button
                onClick={() => handleWatchlistToggle(activeItem)}
                className="flex items-center gap-2 bg-zinc-600/70 hover:bg-zinc-600/90 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded font-semibold text-sm sm:text-base backdrop-blur-md transition-colors duration-200"
              >
                {activeInWatchlist ? (
                  <>
                    <Check size={18} className="text-[#46d369]" /> In List
                  </>
                ) : (
                  <>
                    <Plus size={18} /> My List
                  </>
                )}
              </button>

              <button
                onClick={() => onPlay && onPlay(activeItem)}
                className="flex items-center gap-2 bg-zinc-600/70 hover:bg-zinc-600/90 text-white p-2.5 sm:px-5 sm:py-3 rounded font-semibold text-sm sm:text-base backdrop-blur-md transition-colors duration-200"
                title="More Info"
              >
                <Info size={18} />
                <span className="hidden sm:inline">More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT AUDIO MUTE BUTTON */}
      <div className="absolute bottom-20 right-4 sm:right-12 hidden sm:flex items-center gap-3 z-30">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-9 h-9 rounded-full border border-zinc-500/60 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-110"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <span className="border-l-2 border-zinc-400 pl-2 text-xs font-bold text-zinc-300">
          UHD
        </span>
      </div>
    </div>
  );
};

export default Hero;
