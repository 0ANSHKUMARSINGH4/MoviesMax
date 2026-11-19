import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { Play, Info, Plus, Check, Volume2, VolumeX, Sparkles, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "./SmartImage";
import { normalizeMedia } from "../../utils/mediaUtils";
import { addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";
import { VERTICAL_THEMES, motionRevealContainer, motionRevealChild } from "../../utils/motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Hero = ({ vertical = "movies", heroItems, items, onPlay }) => {
  const navigate = useNavigate();
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const rawList = heroItems && heroItems.length > 0 ? heroItems : items;

  // If heroItems is undefined or empty: show a dark loading skeleton
  if (!rawList || rawList.length === 0) {
    return (
      <div className="relative h-[85vh] sm:h-[90vh] md:h-[92vh] w-full text-white overflow-hidden select-none bg-black animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const normalizedItems = rawList.map((item) => normalizeMedia(item));
  const theme = VERTICAL_THEMES[vertical] || VERTICAL_THEMES.movies;
  const activeItem = normalizedItems[activeIndex] || normalizedItems[0];
  const activeInWatchlist = user && activeItem?.id ? isInWatchlist(activeItem.id) : false;
  const activeRating = activeItem?.vote_average || 8.5;

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
    <div className="relative h-[85vh] sm:h-[90vh] md:h-[92vh] w-full text-white overflow-hidden select-none bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1400}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        pagination={{
          clickable: true,
          bulletActiveClass: `swiper-pagination-bullet-active ${theme.activeBullet} !w-9 !rounded-full transition-all duration-300`,
          bulletClass: "swiper-pagination-bullet !bg-white/40 !w-2.5 !h-1.5 !rounded-full transition-all duration-300",
        }}
        className="h-full w-full"
      >
        {normalizedItems.map((item, index) => {
          return (
            <SwiperSlide key={item.id || index} className="relative h-full w-full group/hero">
              {/* 1. CINEMATIC BACKDROP IMAGE WITH KEN BURNS EFFECT */}
              <div className="absolute inset-0 overflow-hidden">
                <SmartImage
                  src={item.backdrop_path}
                  alt=""
                  title={item.title}
                  vertical={vertical}
                  decorative
                  className="absolute inset-0 w-full h-full"
                  imgClassName="animate-kenburns object-cover object-center"
                />

                {/* MULTI-DIRECTIONAL AMBIENT GRADIENTS */}
                <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${theme.ambientMask} to-transparent`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent w-full md:w-3/4" />
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/85 to-transparent" />
                {/* TEXT SCRIM */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)" }} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 2. HERO CONTENT PANEL */}
      <div className="absolute bottom-16 sm:bottom-24 left-0 w-full container-mx z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            variants={motionRevealContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-2xl sm:max-w-3xl space-y-4 md:space-y-5 pointer-events-auto"
          >
            {/* Category Kicker & Sentiment Analysis Pill */}
            <motion.div
              variants={motionRevealChild}
              className="flex items-center gap-2.5 flex-wrap"
            >
              <span className={`px-3 py-1 rounded-full text-meta uppercase ${theme.tagBg} text-white shadow-lg`}>
                {activeItem?.category || "🔥 Featured"}
              </span>

              {activeItem?.vote_average && (
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-meta border backdrop-blur-md ${theme.badgeColor}`}>
                  <Sparkles size={12} />
                  <span>{Number(activeItem.vote_average).toFixed(1)} Rating</span>
                  <span className="opacity-60">•</span>
                  <span>Popular</span>
                </span>
              )}

              <span className="text-meta text-gray-300 hidden sm:inline">
                STREAM IN ULTRA HD 4K
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={motionRevealChild}
              className="text-hero text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
            >
              {activeItem?.title}
            </motion.h1>

            {/* Metadata Row */}
            <motion.div
              variants={motionRevealChild}
              className="flex items-center gap-3 text-meta text-gray-200 flex-wrap"
            >
              <span className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" /> {Number(activeRating).toFixed(1)}
              </span>
              <span className="text-gray-500">•</span>
              <span className="border border-white/30 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded">16+</span>
              <span>{activeItem?.release_date ? activeItem.release_date.slice(0, 4) : "2025"}</span>
              <span className="border border-white/30 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded">4K ULTRA HD</span>
              {activeItem?.runtime && (
                <span className="text-gray-300">{activeItem.runtime}</span>
              )}
              {activeItem?.director && (
                <span className="text-gray-400 hidden sm:inline">Dir: {activeItem.director}</span>
              )}
            </motion.div>

            {/* Synopsis */}
            <motion.p
              variants={motionRevealChild}
              className="text-sm sm:text-base md:text-lg text-gray-300 line-clamp-3 leading-relaxed drop-shadow-md max-w-2xl font-medium"
            >
              {activeItem?.overview}
            </motion.p>

            {/* SIGNATURE ACTION BUTTONS */}
            <motion.div
              variants={motionRevealChild}
              className="flex items-center gap-3 sm:gap-4 pt-4 flex-wrap"
            >
              {/* Primary Play Button */}
              <button
                onClick={() => onPlay && onPlay(activeItem)}
                className="flex items-center gap-2.5 bg-white hover:bg-gray-200 text-black px-7 sm:px-9 py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <Play size={20} fill="black" /> Play Trailer
              </button>

              {/* Secondary Info Button */}
              <button
                onClick={() => onPlay && onPlay(activeItem)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 hover:border-white/40"
              >
                <Info size={20} /> Details &amp; Reviews
              </button>

              {/* Watchlist Toggle */}
              <button
                onClick={() => handleWatchlistToggle(activeItem)}
                className={`p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md transition-all active:scale-95 ${
                  activeInWatchlist
                    ? `${theme.btnBg} text-white shadow-lg border-transparent`
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
                title={activeInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {activeInWatchlist ? <Check size={20} /> : <Plus size={20} />}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM-RIGHT AUDIO CONTROLS */}
      <div className="absolute bottom-24 right-6 sm:right-12 hidden sm:flex items-center gap-3 z-30 transition-opacity duration-500">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-white/25 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="border-l-2 border-white/60 pl-3 py-1 text-meta text-white/90 bg-black/30 backdrop-blur-md px-3 rounded-r">
          4K
        </div>
      </div>
    </div>
  );
};

export default Hero;
