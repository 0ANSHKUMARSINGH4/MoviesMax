import { BENTO_DATA } from "../../utils/movieData";
import { Sparkles, Play, Disc, ArrowUpRight, Award, Flame } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SmartImage from "./SmartImage";
import Section from "../layout/Section";

const BentoDiscoveryGrid = ({ vertical = "movies", onMovieClick }) => {
  const data = BENTO_DATA[vertical] || BENTO_DATA.movies;

  const verticalTheme = {
    movies: {
      accent: "text-blue-400",
      borderGlow: "hover:border-blue-500/50 hover:shadow-blue-600/20",
      pillBg: "bg-blue-600/20 text-blue-400 border-blue-500/30",
      gradient: "from-blue-600/20 to-indigo-900/30"
    },
    series: {
      accent: "text-purple-400",
      borderGlow: "hover:border-purple-500/50 hover:shadow-purple-600/20",
      pillBg: "bg-purple-600/20 text-purple-400 border-purple-500/30",
      gradient: "from-purple-600/20 to-violet-900/30"
    },
    anime: {
      accent: "text-orange-400",
      borderGlow: "hover:border-orange-500/50 hover:shadow-orange-600/20",
      pillBg: "bg-orange-600/20 text-orange-400 border-orange-500/30",
      gradient: "from-orange-600/20 to-amber-900/30"
    },
    sports: {
      accent: "text-emerald-400",
      borderGlow: "hover:border-emerald-500/50 hover:shadow-emerald-600/20",
      pillBg: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
      gradient: "from-emerald-600/20 to-teal-900/30"
    },
    esports: {
      accent: "text-pink-400",
      borderGlow: "hover:border-pink-500/50 hover:shadow-pink-600/20",
      pillBg: "bg-pink-600/20 text-pink-400 border-pink-500/30",
      gradient: "from-pink-600/20 to-fuchsia-900/30"
    }
  }[vertical] || {
    accent: "text-blue-400",
    borderGlow: "hover:border-blue-500/50 hover:shadow-blue-600/20",
    pillBg: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    gradient: "from-blue-600/20 to-indigo-900/30"
  };

  return (
    <Section as="section" className="py-sp-5 select-none">
      {/* SECTION HEADER (FIGMA STYLE MINIMALIST KICKER) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-sp-3 gap-sp-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${verticalTheme.pillBg}`}>
              <Sparkles size={11} className="inline mr-1" /> Pinterest & Figma Editorial
            </span>
            <span className="text-xs text-gray-400 font-semibold">Curated Moodboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-display tracking-tight">
            Spotlights & Cultural Resonance
          </h2>
        </div>
        <div className="text-xs font-semibold text-gray-400">
          Hand-picked craftsmanship, scores & sentiment
        </div>
      </div>

      {/* ASYMMETRICAL 4-TILE BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[240px]">
        {/* TILE 1: HERO SPOTLIGHT (2 Columns, 2 Rows on Desktop) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden bg-[#0c0d14] border border-white/10 ${verticalTheme.borderGlow} transition-all duration-500 group cursor-pointer shadow-2xl flex flex-col justify-end p-6 sm:p-8`}
          onClick={() => onMovieClick && onMovieClick({ title: data.spotlight.title, backdrop_path: data.spotlight.image, overview: data.spotlight.description })}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <SmartImage
              src={data.spotlight.image}
              alt=""
              title={data.spotlight.title}
              vertical={vertical}
              decorative
              className="absolute inset-0 w-full h-full"
              imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090e] via-[#08090e]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090e]/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-3 max-w-lg">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${verticalTheme.pillBg} border backdrop-blur-md`}>
                <Flame size={12} className="inline mr-1" /> {data.spotlight.tag}
              </span>
              <span className="text-xs font-semibold text-gray-300 backdrop-blur-sm px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10">
                {data.spotlight.stats}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight leading-tight">
              {data.spotlight.title}
            </h3>

            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed font-medium">
              {data.spotlight.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl transition-all">
                <Play size={13} fill="currentColor" /> Preview Trailer <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </motion.div>

        {/* TILE 2: TALL FEATURE POSTER CARD (1 Column, 2 Rows) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative md:col-span-1 md:row-span-2 rounded-3xl overflow-hidden bg-[#0c0d14] border border-white/10 ${verticalTheme.borderGlow} transition-all duration-500 group cursor-pointer shadow-xl flex flex-col justify-end p-5`}
          onClick={() => onMovieClick && onMovieClick({ title: data.tallFeature.title, poster_path: data.tallFeature.image, overview: data.tallFeature.subtitle })}
        >
          <div className="absolute inset-0">
            <SmartImage
              src={data.tallFeature.image}
              alt=""
              title={data.tallFeature.title}
              vertical={vertical}
              decorative
              className="absolute inset-0 w-full h-full"
              imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1">
              <Award size={13} /> {data.tallFeature.tag}
            </span>
            <h4 className="text-xl font-black text-white font-display">
              {data.tallFeature.title}
            </h4>
            <p className="text-xs text-gray-300 line-clamp-2 font-medium">
              {data.tallFeature.subtitle}
            </p>
            <div className="pt-2 text-xs font-bold text-yellow-400">
              Score: {data.tallFeature.rating}
            </div>
          </div>
        </motion.div>

        {/* TILE 3: SENTIMENT ANALYSIS AUDIENCE CARD (1 Column, 1 Row) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${data.sentimentCard.gradient} border border-white/15 ${verticalTheme.borderGlow} transition-all duration-500 p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl group`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Sparkles size={12} className={verticalTheme.accent} /> Sentiment Metric
            </span>
            <span className="text-2xl font-black text-white tracking-tight drop-shadow font-display">
              {data.sentimentCard.score}
            </span>
          </div>

          <div>
            <h4 className="text-base font-black text-white font-display leading-tight mb-1">
              {data.sentimentCard.title}
            </h4>
            <p className="text-[11px] text-gray-300 font-medium line-clamp-2 leading-relaxed">
              {data.sentimentCard.statDetail}
            </p>
          </div>
        </motion.div>

        {/* TILE 4: VINYL OST / AUDIO CARD (1 Column, 1 Row) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-3xl overflow-hidden bg-[#0c0d14] border border-white/10 ${verticalTheme.borderGlow} transition-all duration-500 p-5 flex flex-col justify-between shadow-xl group`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Disc size={13} className={verticalTheme.accent} /> {data.soundtrackCard.label}
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/15 flex-shrink-0 group-hover:rotate-6 transition-transform">
              <SmartImage
                src={data.soundtrackCard.image}
                alt=""
                title={data.soundtrackCard.track}
                vertical={vertical}
                decorative
                className="w-full h-full"
                imgClassName="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h5 className="text-sm font-bold text-white truncate group-hover:text-gray-200">
                {data.soundtrackCard.track}
              </h5>
              <p className="text-xs text-gray-400 truncate">
                {data.soundtrackCard.composer}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default BentoDiscoveryGrid;
