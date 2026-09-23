import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { Play, Info, Plus, Check, Volume2, VolumeX, Sparkles, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HERO_DATA } from "../../utils/movieData";
import SmartImage from "./SmartImage";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Hero = ({ vertical = "movies", items, onPlay }) => {
  const { watchlist, toggleWatchlist } = useContext(GlobalContext);
  const [isMuted, setIsMuted] = useState(true);

  // Use vertical-specific heroes from movieData or provided items
  const heroItems =
    items && items.length > 0
      ? items
      : HERO_DATA[vertical] || HERO_DATA.movies;

  const verticalTheme = {
    movies: {
      accent: "bg-blue-600 shadow-blue-600/50 text-blue-400",
      tagBg: "bg-blue-600",
      btnBg: "bg-blue-600 hover:bg-blue-500",
      ambientMask: "from-[#07080b] via-[#07080b]/70",
      activeBullet: "!bg-blue-500",
      badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10"
    },
    series: {
      accent: "bg-purple-600 shadow-purple-600/50 text-purple-400",
      tagBg: "bg-purple-600",
      btnBg: "bg-purple-600 hover:bg-purple-500",
      ambientMask: "from-[#090510] via-[#090510]/70",
      activeBullet: "!bg-purple-500",
      badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10"
    },
    anime: {
      accent: "bg-orange-600 shadow-orange-600/50 text-orange-400",
      tagBg: "bg-orange-600",
      btnBg: "bg-orange-600 hover:bg-orange-500",
      ambientMask: "from-[#0c0505] via-[#0c0505]/70",
      activeBullet: "!bg-orange-500",
      badgeColor: "text-orange-400 border-orange-500/30 bg-orange-500/10"
    },
    sports: {
      accent: "bg-emerald-600 shadow-emerald-600/50 text-emerald-400",
      tagBg: "bg-emerald-600",
      btnBg: "bg-emerald-600 hover:bg-emerald-500",
      ambientMask: "from-[#040d07] via-[#040d07]/70",
      activeBullet: "!bg-emerald-500",
      badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    },
    esports: {
      accent: "bg-pink-600 shadow-pink-600/50 text-pink-400",
      tagBg: "bg-pink-600",
      btnBg: "bg-pink-600 hover:bg-pink-500",
      ambientMask: "from-[#07050d] via-[#07050d]/70",
      activeBullet: "!bg-pink-500",
      badgeColor: "text-pink-400 border-pink-500/30 bg-pink-500/10"
    }
  }[vertical] || {
    accent: "bg-blue-600 shadow-blue-600/50 text-blue-400",
    tagBg: "bg-blue-600",
    btnBg: "bg-blue-600 hover:bg-blue-500",
    ambientMask: "from-[#07080b] via-[#07080b]/70",
    activeBullet: "!bg-blue-500",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10"
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
        pagination={{
          clickable: true,
          bulletActiveClass: `swiper-pagination-bullet-active ${verticalTheme.activeBullet} !w-9 !rounded-full transition-all duration-300`,
          bulletClass: "swiper-pagination-bullet !bg-white/40 !w-2.5 !h-1.5 !rounded-full transition-all duration-300"
        }}
        className="h-full w-full"
      >
        {heroItems.map((item, index) => {
          const inWatchlist = watchlist?.some((w) => String(w.id) === String(item.id));
          const rating = item.vote_average || 8.8;

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

                {/* MULTI-DIRECTIONAL AMBIENT GRADIENTS (Zero harsh cutoffs) */}
                <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${verticalTheme.ambientMask} to-transparent`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent w-full md:w-3/4" />
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/85 to-transparent" />
              </div>

              {/* 2. HERO CONTENT PANEL — container-mx keeps left edge on the design grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
                  }
                }}
                className="absolute bottom-16 sm:bottom-24 left-0 w-full container-mx z-20"
              >
                <div className="max-w-2xl sm:max-w-3xl space-y-4 md:space-y-5">
                  {/* Category Kicker & Sentiment Analysis Pill */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-center gap-2.5 flex-wrap"
                  >
                    <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${verticalTheme.tagBg} text-white shadow-lg`}>
                      {item.tag || "🔥 Featured"}
                    </span>

                    {item.sentiment && (
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border backdrop-blur-md ${verticalTheme.badgeColor}`}>
                        <Sparkles size={12} />
                        <span>{item.sentiment.score} Sentiment</span>
                        <span className="opacity-60">•</span>
                        <span>{item.sentiment.label}</span>
                      </span>
                    )}

                    <span className="text-xs text-gray-300 font-semibold tracking-wide hidden sm:inline">
                      STREAM IN ULTRA HD 4K
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white font-display drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
                  >
                    {item.title}
                  </motion.h1>

                  {/* Metadata Row */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-center gap-3 text-xs sm:text-sm font-bold text-gray-200 flex-wrap"
                  >
                    <span className="flex items-center gap-1 text-yellow-400 font-black">
                      <Star size={14} fill="currentColor" /> {Number(rating).toFixed(1)}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="border border-white/30 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold">16+</span>
                    <span>{item.release_date ? item.release_date.slice(0, 4) : "2024"}</span>
                    <span className="border border-white/30 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-black">4K ULTRA HD</span>
                    {item.runtime && (
                      <span className="text-gray-300">{item.runtime}</span>
                    )}
                    {item.director && (
                      <span className="text-gray-400 hidden sm:inline">Dir: {item.director}</span>
                    )}
                  </motion.div>

                  {/* Synopsis */}
                  <motion.p
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    className="text-sm sm:text-base md:text-lg text-gray-300 line-clamp-3 leading-relaxed drop-shadow-md max-w-2xl font-medium"
                  >
                    {item.overview}
                  </motion.p>

                  {/* SIGNATURE ACTION BUTTONS */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-center gap-3 sm:gap-4 pt-4 flex-wrap"
                  >
                    {/* Primary Play Button */}
                    <button
                      onClick={() => onPlay && onPlay(item)}
                      className="flex items-center gap-2.5 bg-white hover:bg-gray-200 text-black px-7 sm:px-9 py-3 sm:py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-2xl transition-all hover:scale-105 active:scale-95"
                    >
                      <Play size={20} fill="black" /> Play Trailer
                    </button>

                    {/* Secondary Info Button */}
                    <button
                      onClick={() => onPlay && onPlay(item)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 hover:border-white/40"
                    >
                      <Info size={20} /> Details & Reviews
                    </button>

                    {/* Watchlist Toggle */}
                    <button
                      onClick={() => toggleWatchlist(item)}
                      className={`p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md transition-all active:scale-95 ${
                        inWatchlist
                          ? `${verticalTheme.btnBg} text-white shadow-lg`
                          : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                      }`}
                      title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                      {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                    </button>
                  </motion.div>
                </div>
              </motion.div>

              {/* 3. BOTTOM-RIGHT AUDIO CONTROLS */}
              <div className="absolute bottom-24 right-6 sm:right-12 hidden sm:flex items-center gap-3 z-20 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full border border-white/25 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="border-l-2 border-white/60 pl-3 py-1 text-xs font-black uppercase tracking-widest text-white/90 bg-black/30 backdrop-blur-md px-3 rounded-r">
                  4K
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Hero;