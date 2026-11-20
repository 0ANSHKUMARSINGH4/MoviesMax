import React, { useState } from "react";
import { Quote, Sparkles, Pause, Play } from "lucide-react";
import { VERTICAL_QUOTES } from "../../utils/movieData";
import { getMediaImageUrl } from "../../utils/mediaUtils";
import Section from "../layout/Section";

const AestheticQuoteRoundup = ({ vertical = "movies" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const quotes = VERTICAL_QUOTES[vertical] || VERTICAL_QUOTES.movies;

  // Duplicate quotes array for a seamless infinite loop
  const infiniteQuotes = [...quotes, ...quotes];

  return (
    <Section as="section" className="relative py-8 sm:py-12 select-none overflow-hidden bg-[#0B1120]">
      {/* 1. SECTION HEADER (BLUE & WHITE THEME) */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 space-y-3 relative z-20 px-4">
        {/* Electric Blue Header Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-600/15 text-xs font-bold uppercase tracking-widest text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span>Iconic Dialogue & Cultural Resonance</span>
        </div>

        {/* Section Heading in Crisp White & Electric Blue */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2 flex-wrap">
          Words That Resonate Through{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-white">
            Cinema
          </span>
        </h2>

        {/* Motion Indicator Hint */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-300/90">
          {isHovered ? (
            <>
              <Pause size={12} className="text-blue-400" />
              <span>Paused on hover • Move away to resume</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span>Auto-sliding • Hover over any card to pause</span>
            </>
          )}
        </div>
      </div>

      {/* 2. CONTINUOUS SLIDING CAROUSEL VIEWPORT */}
      <div
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left & Right Cinematic Edge Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-40 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-40 bg-gradient-to-l from-[#0B1120] via-[#0B1120]/80 to-transparent z-20 pointer-events-none" />

        {/* INFINITE SLIDING MARQUEE TRACK */}
        <div className="animate-quote-slider flex gap-5 sm:gap-7 items-center">
          {infiniteQuotes.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative flex-none w-[310px] sm:w-[380px] md:w-[440px] aspect-[4/5] rounded-[2rem] overflow-hidden group/quote bg-[#0e1628] border border-blue-500/20 hover:border-blue-400 shadow-xl hover:shadow-[0_0_35px_rgba(59,130,246,0.35)] transition-all duration-300 cursor-pointer transform-gpu hover:scale-[1.02]"
            >
              {/* High-Resolution Background Parallax Image */}
              <div className="absolute inset-0">
                <img
                  src={getMediaImageUrl(item.image, "w780")}
                  alt={item.movie}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-40 group-hover/quote:opacity-60 transition-opacity duration-500 group-hover/quote:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Blue & Navy Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/75 to-transparent opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/70 via-transparent to-transparent" />

              {/* Card Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10 z-10">
                {/* Top Bar with Blue Quote Icon & Movie Tag */}
                <div className="flex items-center justify-between">
                  <div className="text-blue-400/50 group-hover/quote:text-blue-400 transition-colors">
                    <Quote size={40} strokeWidth={1.5} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600/20 border border-blue-500/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    {item.movie}
                  </span>
                </div>

                {/* Bottom Quote Text and Character Dossier */}
                <div className="space-y-5 transform transition-transform duration-300 group-hover/quote:-translate-y-1">
                  <p
                    className="text-base sm:text-lg md:text-xl text-white font-medium leading-relaxed tracking-wide drop-shadow-md"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      textShadow: "0 2px 14px rgba(0,0,0,0.9)",
                    }}
                  >
                    "{item.quote}"
                  </p>

                  {/* Electric Blue Accent Divider */}
                  <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full group-hover/quote:w-20 transition-all duration-300 shadow-[0_0_8px_#3B82F6]" />

                  {/* Character & Movie Citation */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6] flex-shrink-0" />
                    {item.character && (
                      <span className="text-xs sm:text-sm text-white font-bold tracking-widest uppercase">
                        {item.character}
                      </span>
                    )}
                    {item.character && <span className="text-gray-500">•</span>}
                    <span className="text-xs sm:text-sm text-blue-400 font-semibold tracking-wider">
                      {item.movie}
                    </span>
                  </div>
                </div>
              </div>

              {/* Electric Blue Border Glow Mask */}
              <div className="absolute inset-0 border-2 border-blue-400/0 group-hover/quote:border-blue-400/60 rounded-[2rem] transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default React.memo(AestheticQuoteRoundup);
