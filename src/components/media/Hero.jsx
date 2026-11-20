import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { Play, Info, Plus, Check, Volume2, VolumeX, Sparkles, Star } from "lucide-react";
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
      <div className="relative h-[78vh] sm:h-[85vh] w-full bg-[#0B1120] animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const normalizedItems = rawList.slice(0, 6).map((item) => normalizeMedia(item));
  const activeItem = normalizedItems[activeIndex] || normalizedItems[0];
  const activeInWatchlist = user && activeItem?.id ? isInWatchlist(activeItem.id) : false;
  const matchScore = Math.min(99, Math.max(80, Math.round((activeItem?.vote_average || 8.0) * 10 + 4)));

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
    <div className="relative h-[80vh] sm:h-[86vh] md:h-[90vh] w-full text-white overflow-hidden select-none bg-[#0B1120]">
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
                className="w-full h-full object-cover object-[center_20%] opacity-85 transition-transform duration-1000 ease-out"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* BLUE & NAVY AMBIENT GRADIENT MASKS */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/60 to-transparent w-full md:w-3/5" />
              <div className="absolute inset-x-0 bottom-0 h-56 sm:h-72 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/75 to-transparent" />
              <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#0B1120]/90 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 2. FOREGROUND HERO CONTENT */}
      <div className="absolute bottom-16 sm:bottom-24 left-0 w-full z-20 pointer-events-none">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl sm:max-w-2xl space-y-3 sm:space-y-4 pointer-events-auto">
            {/* KICKER & METRICS */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/25 border border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                {activeItem?.category || "🔥 Featured"}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/10 text-gray-200 backdrop-blur-md">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span>{Number(activeItem?.vote_average || 8.2).toFixed(1)} Rating</span>
              </span>
              <span className="text-xs text-blue-300 font-semibold hidden sm:inline">
                STREAM IN 4K ULTRA HD
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              {activeItem?.title}
            </h1>

            {/* METADATA ROW */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 font-semibold flex-wrap">
              <span className="text-blue-400 font-bold">{matchScore}% Match</span>
              <span className="text-gray-500">•</span>
              <span>{activeItem?.release_date ? activeItem.release_date.slice(0, 4) : "2025"}</span>
              <span className="border border-white/20 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">16+</span>
              <span className="border border-blue-500/40 bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded text-[11px]">4K ULTRA HD</span>
              {activeItem?.runtime && <span>{activeItem.runtime}</span>}
            </div>

            {/* SYNOPSIS */}
            <p className="text-sm sm:text-base text-gray-300 line-clamp-3 leading-relaxed drop-shadow font-normal max-w-xl">
              {activeItem?.overview}
            </p>

            {/* BLUE & WHITE ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlay && onPlay(activeItem)}
                className="flex items-center gap-2.5 bg-white hover:bg-gray-200 text-black px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Play size={18} fill="black" /> Play Trailer
              </button>

              <button
                onClick={() => handleWatchlistToggle(activeItem)}
                className={`flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base border transition-all active:scale-95 ${
                  activeInWatchlist
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/40"
                    : "bg-blue-600/20 hover:bg-blue-600/35 text-white border-blue-500/40 backdrop-blur-md"
                }`}
              >
                {activeInWatchlist ? (
                  <>
                    <Check size={18} className="text-blue-300" /> In Watchlist
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Add to Watchlist
                  </>
                )}
              </button>

              <button
                onClick={() => onPlay && onPlay(activeItem)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all active:scale-95"
                title="Details & Dossier"
              >
                <Info size={18} />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AUDIO CONTROLS */}
      <div className="absolute bottom-24 right-6 sm:right-12 hidden sm:flex items-center gap-3 z-30">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-white/25 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="border-l-2 border-blue-500/60 pl-3 py-1 text-xs font-bold text-blue-300 bg-black/30 backdrop-blur-md px-3 rounded-r">
          4K
        </div>
      </div>
    </div>
  );
};

export default Hero;
