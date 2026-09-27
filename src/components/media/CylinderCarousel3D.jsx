import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Featured items directly matching the user's video clip
const CYLINDER_MEDIA = [
  {
    id: "cyl-ted-lasso",
    title: "Ted Lasso",
    year: "2020–2023",
    meta: "3 Seasons",
    rating: "7.8",
    networkBadge: "Apple TV+",
    networkBg: "bg-black/90 text-white border-white/20",
    glowColor: "rgba(220, 38, 38, 0.35)", // Crimson glow from video
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=700",
    backdrop: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200",
    overview: "An American football coach is hired to manage a British soccer team; what he lacks in knowledge, he makes up for with optimism, determination and biscuits."
  },
  {
    id: "cyl-antman",
    title: "Ant-Man and the Wasp: Quantumania",
    year: "2022",
    meta: "2h 49m",
    rating: "7.3",
    networkBadge: "HBO",
    networkBg: "bg-[#38123c]/95 text-white border-purple-400/30",
    glowColor: "rgba(147, 51, 234, 0.35)",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=700",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200",
    overview: "Scott Lang and Hope Van Dyne are dragged into the Quantum Realm along with Hope's parents and Scott's daughter Cassie, encountering strange new creatures and Kang the Conqueror."
  },
  {
    id: "cyl-interstellar",
    title: "Interstellar",
    year: "2014",
    meta: "2h 29m",
    rating: "8.7",
    networkBadge: "N",
    networkBg: "bg-red-600 text-white font-black",
    glowColor: "rgba(37, 99, 235, 0.35)",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=700",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    overview: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft through a wormhole to find a new home for mankind."
  },
  {
    id: "cyl-inception",
    title: "Inception",
    year: "2010",
    meta: "2h 28m",
    rating: "9.1",
    networkBadge: "MAX",
    networkBg: "bg-blue-600 text-white font-black",
    glowColor: "rgba(6, 182, 212, 0.35)",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=700",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
  },
  {
    id: "cyl-the-last-of-us",
    title: "The Last of Us",
    year: "2020–2023",
    meta: "1 Season",
    rating: "7.3",
    networkBadge: "HBO",
    networkBg: "bg-[#38123c]/95 text-white border-purple-400/30",
    glowColor: "rgba(234, 88, 12, 0.35)",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=700",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
    overview: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope."
  },
  {
    id: "cyl-stranger-things",
    title: "Stranger Things",
    year: "2024",
    meta: "4 Seasons",
    rating: "8.9",
    networkBadge: "N",
    networkBg: "bg-red-600 text-white font-black",
    glowColor: "rgba(225, 29, 72, 0.35)",
    poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=700",
    backdrop: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl."
  }
];

const CylinderCarousel3D = ({ onMovieClick }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayTimer = useRef(null);

  const total = CYLINDER_MEDIA.length;
  const angleStep = 360 / total; // 60 degrees per card for 6 cards
  const radius = 380; // 3D cylinder radius in pixels

  // Keep active index aligned with continuous rotation angle
  const computeActiveIndex = (angle) => {
    const normalized = ((-angle % 360) + 360) % 360;
    const idx = Math.round(normalized / angleStep) % total;
    return idx;
  };

  const rotateNext = () => {
    setRotationAngle((prev) => {
      const nextAngle = prev - angleStep;
      setActiveIndex(computeActiveIndex(nextAngle));
      return nextAngle;
    });
  };

  const rotatePrev = () => {
    setRotationAngle((prev) => {
      const nextAngle = prev + angleStep;
      setActiveIndex(computeActiveIndex(nextAngle));
      return nextAngle;
    });
  };

  const rotateToIndex = (targetIndex) => {
    let diff = targetIndex - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    setRotationAngle((prev) => {
      const nextAngle = prev - diff * angleStep;
      setActiveIndex(targetIndex);
      return nextAngle;
    });
  };

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayTimer.current = setInterval(rotateNext, 4500);
    }
    return () => clearInterval(autoPlayTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlay, activeIndex]);

  // Touch & Drag Support
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 40) rotatePrev();
    if (diffX < -40) rotateNext();
  };

  const currentItem = CYLINDER_MEDIA[activeIndex];

  return (
    <section
      className="relative py-14 md:py-24 overflow-hidden select-none bg-[#07080b]"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. DYNAMIC RADIAL SPOTLIGHT GLOW (Exact color match from video) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[500px] sm:h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${currentItem.glowColor} 0%, rgba(7, 8, 11, 0) 70%)`
        }}
      />

      {/* 2. SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-meta font-black uppercase tracking-widest text-gray-300">
          <span className="w-2 h-2 rounded-full bg-netflix-red animate-pulse" />
          Interactive 3D Stage
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
          Curated Universe
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
          Rotate through the cylinder to explore trending shows across top global streaming networks.
        </p>
      </div>

      {/* 3. 3D CYLINDRICAL CAROUSEL STAGE */}
      <div className="relative h-[430px] sm:h-[480px] md:h-[520px] w-full flex items-center justify-center perspective-[1100px] z-10">
        {/* Navigation Arrows */}
        <button
          onClick={rotatePrev}
          className="absolute left-4 sm:left-12 md:left-20 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95"
          title="Rotate Left"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={rotateNext}
          className="absolute right-4 sm:right-12 md:right-20 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95"
          title="Rotate Right"
        >
          <ChevronRight size={24} />
        </button>

        {/* 3D ROTATING CYLINDER PARENT (Framer Motion Physics & Drag) */}
        <motion.div
          className="relative w-64 sm:w-72 md:w-80 h-[370px] sm:h-[420px] md:h-[450px] cursor-grab active:cursor-grabbing touch-none"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: rotationAngle }}
          transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x;
            if (swipe < -40 || velocity.x < -300) rotateNext();
            else if (swipe > 40 || velocity.x > 300) rotatePrev();
          }}
        >
          {CYLINDER_MEDIA.map((item, index) => {
            const cardAngle = index * angleStep;

            // Compute relative angle to see if card is in front
            let relAngle = (cardAngle + rotationAngle) % 360;
            if (relAngle > 180) relAngle -= 360;
            if (relAngle < -180) relAngle += 360;

            const isCenter = Math.abs(relAngle) < 15;
            const isVisible = Math.abs(relAngle) <= 110; // Front ~180-degree arc visible

            // Smooth brightness and opacity falloff along the cylinder curve
            const brightness = isCenter ? 1.0 : Math.max(0.4, 1 - Math.abs(relAngle) / 140);
            const cardOpacity = isVisible ? 1 : 0;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isCenter) {
                    onMovieClick && onMovieClick(item);
                  } else {
                    rotateToIndex(index);
                  }
                }}
                className={`absolute inset-0 rounded-3xl overflow-hidden cursor-pointer select-none border transition-all duration-700 ease-out will-change-[filter,opacity,transform] ${
                  isCenter
                    ? "border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/30 pointer-events-auto"
                    : "border-white/10 shadow-2xl pointer-events-auto"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  backgroundColor: "#0d0f17",
                  filter: `brightness(${brightness})`,
                  opacity: cardOpacity,
                  pointerEvents: isVisible ? "auto" : "none",
                  backfaceVisibility: "hidden", // Cleanly hides back-facing cards
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Poster Background */}
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90" />

                {/* TOP BADGES (Network Pill + Rating Pill - From Video) */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
                  {/* Network Pill Badge (Left) */}
                  <div className={`px-2.5 py-1 rounded-md text-meta font-black uppercase tracking-wider shadow-lg backdrop-blur-md ${item.networkBg}`}>
                    {item.networkBadge}
                  </div>

                  {/* Rating Pill (Right) */}
                  <div className="px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/25 text-white font-extrabold text-xs flex items-center gap-1 shadow-lg">
                    <span>{item.rating}</span>
                    <Star size={12} fill="white" className="text-white" />
                  </div>
                </div>

                {/* BOTTOM METADATA (Title, Year, Seasons/Runtime - From Video) */}
                <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5 z-10">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-display drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-semibold">
                    {item.year} • {item.meta}
                  </p>

                  {/* Center Card Play Hint */}
                  {isCenter && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-black font-black text-meta shadow-lg hover:scale-105 transition-transform">
                        <Play size={10} fill="black" /> Click to Watch
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. CAROUSEL DOT INDICATORS */}
      <div className="flex items-center justify-center gap-2 pt-8 relative z-10">
        {CYLINDER_MEDIA.map((_, i) => (
          <button
            key={i}
            onClick={() => rotateToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "w-8 bg-white" : "w-2 bg-white/25 hover:bg-white/50"
            }`}
            title={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CylinderCarousel3D;
