import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check, Star, ChevronLeft, ChevronRight, Film, Tv, Sparkles } from "lucide-react";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";

const CURATED_DECKS = {
  popular: [
    {
      id: "deck-stranger-things",
      title: "Stranger Things",
      category: "TV Show",
      rating: 8.7,
      year: "2024",
      seasons: "4 Seasons",
      episodesCount: "34 Episodes",
      genres: ["Sci-Fi", "Horror", "Mystery"],
      synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "Chapter One: The Vanishing", duration: "48m", still: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600" },
        { ep: "Episode 2", title: "Chapter Two: The Weirdo", duration: "55m", still: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600" },
        { ep: "Episode 3", title: "Chapter Three: Holly, Jolly", duration: "51m", still: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600" },
        { ep: "Episode 4", title: "Chapter Four: The Body", duration: "50m", still: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600" },
        { ep: "Episode 5", title: "Chapter Five: The Flea", duration: "53m", still: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=600" },
      ]
    },
    {
      id: "deck-loki",
      title: "Loki: God of Stories",
      category: "TV Show",
      rating: 8.8,
      year: "2023",
      seasons: "2 Seasons",
      episodesCount: "12 Episodes",
      genres: ["Action", "Sci-Fi", "Fantasy"],
      synopsis: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "Glorious Purpose", duration: "51m", still: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600" },
        { ep: "Episode 2", title: "The Variant", duration: "54m", still: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600" },
        { ep: "Episode 3", title: "Lamentis", duration: "42m", still: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600" },
        { ep: "Episode 4", title: "The Nexus Event", duration: "48m", still: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600" },
      ]
    },
    {
      id: "deck-squid-game",
      title: "Squid Game",
      category: "TV Show",
      rating: 8.5,
      year: "2024",
      seasons: "2 Seasons",
      episodesCount: "15 Episodes",
      genres: ["Drama", "Thriller", "Action"],
      synopsis: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games with tempting rewards and deadly high stakes.",
      poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "Red Light, Green Light", duration: "60m", still: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600" },
        { ep: "Episode 2", title: "Hell", duration: "62m", still: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=600" },
        { ep: "Episode 3", title: "The Man with the Umbrella", duration: "54m", still: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600" },
      ]
    },
    {
      id: "deck-cyberpunk",
      title: "Cyberpunk: Edgerunners",
      category: "Anime",
      rating: 8.9,
      year: "2023",
      seasons: "1 Season",
      episodesCount: "10 Episodes",
      genres: ["Cyberpunk", "Action", "Anime"],
      synopsis: "A street kid trying to survive in a technology and body modification-obsessed city of the future decides to stay alive by becoming an edgerunner.",
      poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "Let You Down", duration: "24m", still: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600" },
        { ep: "Episode 2", title: "Like a Boy", duration: "25m", still: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600" },
        { ep: "Episode 3", title: "Smooth Criminal", duration: "23m", still: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=600" },
      ]
    },
    {
      id: "deck-interstellar",
      title: "Interstellar",
      category: "Movie",
      rating: 8.7,
      year: "2024 Remaster",
      seasons: "Feature Film",
      episodesCount: "2h 49m",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1400",
      episodes: [
        { ep: "Part 1", title: "The Dust Storms of Earth", duration: "45m", still: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" },
        { ep: "Part 2", title: "Miller's Oceanic Planet", duration: "50m", still: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600" },
        { ep: "Part 3", title: "The Gargantua Singularity", duration: "64m", still: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600" },
      ]
    },
    {
      id: "deck-arcane",
      title: "Arcane: League of Legends",
      category: "Animation",
      rating: 9.0,
      year: "2024",
      seasons: "2 Seasons",
      episodesCount: "18 Episodes",
      genres: ["Animation", "Sci-Fi", "Action"],
      synopsis: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
      poster: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "Welcome to the Playground", duration: "43m", still: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600" },
        { ep: "Episode 2", title: "Some Mysteries Are Better Left Unsolved", duration: "41m", still: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600" },
      ]
    }
  ],
  latest: [
    {
      id: "deck-dune-2",
      title: "Dune: Part Two",
      category: "Movie",
      rating: 8.8,
      year: "2024",
      seasons: "Feature Film",
      episodesCount: "2h 46m",
      genres: ["Action", "Adventure", "Sci-Fi"],
      synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400",
      episodes: [
        { ep: "Scene 1", title: "Sandworm Master", duration: "45m", still: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600" },
        { ep: "Scene 2", title: "Giedi Prime Arena", duration: "50m", still: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600" },
      ]
    },
    {
      id: "deck-fallout",
      title: "Fallout: Wasteland",
      category: "TV Show",
      rating: 8.6,
      year: "2024",
      seasons: "1 Season",
      episodesCount: "8 Episodes",
      genres: ["Sci-Fi", "Action", "Adventure"],
      synopsis: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves.",
      poster: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "The End", duration: "65m", still: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=600" },
        { ep: "Episode 2", title: "The Target", duration: "58m", still: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600" },
      ]
    }
  ],
  anime: [
    {
      id: "deck-sololeveling",
      title: "Solo Leveling",
      category: "Anime",
      rating: 8.6,
      year: "2024",
      seasons: "1 Season",
      episodesCount: "12 Episodes",
      genres: ["Action", "Fantasy", "Anime"],
      synopsis: "In a world where hunters must battle deadly monsters to protect humankind, the notorious weak hunter Sung Jinwoo is chosen by a mysterious quest program.",
      poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=700",
      backdrop: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1400",
      episodes: [
        { ep: "Episode 1", title: "I'm Used to It", duration: "24m", still: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600" },
        { ep: "Episode 2", title: "If I Had One More Chance", duration: "24m", still: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600" },
      ]
    }
  ]
};

const FanDeckHero = ({ onOpenDossier }) => {
  const [activeTab, setActiveTab] = useState("popular");
  const [activeIndex, setActiveIndex] = useState(0);
  const { watchlist, toggleWatchlist } = useContext(GlobalContext);

  const deck = CURATED_DECKS[activeTab] || CURATED_DECKS.popular;
  const currentShow = deck[activeIndex] || deck[0];

  const inWatchlist = watchlist?.some((w) => w.id === currentShow.id);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      // Open Dossier Modal
      onOpenDossier && onOpenDossier(currentShow);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative pt-24 md:pt-28 pb-16 overflow-hidden">
      {/* ATMOSPHERIC BACKGROUND RADIAL AURA */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-blue-600/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* 1. HERO TITLE & CATEGORY PILLS (From Video Frame 00:00 - 00:05) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display">
            Discover Unlimited Content
          </h1>

          {/* Filter Pills with Active Glow */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#12131c]/80 backdrop-blur-xl border border-white/10 shadow-xl">
            {[
              { id: "popular", label: "Popular" },
              { id: "latest", label: "Latest" },
              { id: "anime", label: "Anime" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveIndex(0);
                }}
                className={`relative px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "text-white shadow-lg shadow-purple-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. THE 3D FAN-OUT DECK (The Exact Video Hallmark) */}
        <div className="relative h-[430px] sm:h-[480px] w-full flex items-center justify-center select-none perspective-[1200px]">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-10 z-50 w-11 h-11 rounded-full bg-black/60 hover:bg-purple-600 border border-white/15 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Previous"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-10 z-50 w-11 h-11 rounded-full bg-black/60 hover:bg-purple-600 border border-white/15 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Next"
          >
            <ChevronRight size={22} />
          </button>

          {/* Cards Stack */}
          <div className="relative w-72 sm:w-80 h-[380px] sm:h-[420px] flex items-center justify-center">
            {deck.map((item, index) => {
              const offset = index - activeIndex;
              const isCenter = offset === 0;

              // Hide cards too far from center
              if (Math.abs(offset) > 3) return null;

              // Compute 3D transforms for realistic fan-out
              const xOffset = offset * 95;
              const rotateZ = offset * 8;
              const rotateY = offset * -12;
              const scale = 1 - Math.abs(offset) * 0.12;
              const zIndex = 40 - Math.abs(offset) * 10;
              const opacity = 1 - Math.abs(offset) * 0.22;

              return (
                <motion.div
                  key={item.id}
                  onClick={() => handleCardClick(index)}
                  animate={{
                    x: xOffset,
                    rotateZ: rotateZ,
                    rotateY: rotateY,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  className={`absolute w-72 sm:w-80 h-[380px] sm:h-[420px] rounded-3xl overflow-hidden cursor-pointer bg-[#12131c] border transition-shadow duration-300 ${
                    isCenter
                      ? "border-purple-500/60 shadow-[0_20px_60px_rgba(139,92,246,0.35)] ring-1 ring-purple-500/50"
                      : "border-white/10 shadow-2xl grayscale hover:grayscale-0"
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Poster Image */}
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Badges (Rating & Type Pill) */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                    <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-yellow-400 font-bold text-xs flex items-center gap-1 shadow-md">
                      <Star size={13} fill="currentColor" /> {item.rating}
                    </div>

                    <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-semibold text-[11px] shadow-md flex items-center gap-1.5">
                      {item.category === "Anime" ? <Sparkles size={12} className="text-purple-400" /> : <Tv size={12} className="text-blue-400" />}
                      {item.category}
                    </div>
                  </div>

                  {/* Gradient Shadow Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-2 text-center flex flex-col items-center">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-display drop-shadow-md">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 text-xs font-semibold">
                      {item.year} • {item.seasons} • {item.episodesCount}
                    </p>

                    {/* Quick CTA on Center Card */}
                    {isCenter && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 pt-2"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDossier && onOpenDossier(item);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-purple-600/40 transition-transform active:scale-95"
                        >
                          <Play size={13} fill="white" /> Watch Trailer
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist({
                              id: item.id,
                              title: item.title,
                              poster_path: item.poster,
                              backdrop_path: item.backdrop,
                              vote_average: item.rating,
                              overview: item.synopsis
                            });
                          }}
                          className={`p-2 rounded-full border transition-all ${
                            inWatchlist
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-black/60 border-white/20 text-white hover:bg-white/20"
                          }`}
                          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. SHOWCASE & EPISODES REEL (From Video Frame 00:06 - 00:08) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentShow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl overflow-hidden bg-[#12131c] border border-white/10 shadow-2xl relative"
          >
            {/* Backdrop Banner with Vignette */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img
                src={currentShow.backdrop}
                alt={currentShow.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12131c] via-[#12131c]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#12131c] via-transparent to-transparent" />

              {/* Title & Metadata Overlay */}
              <div className="absolute bottom-6 left-6 md:left-10 max-w-xl space-y-3 z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  {currentShow.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/15 text-gray-200"
                    >
                      {g}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                    IMDb {currentShow.rating}/10
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
                  {currentShow.title}
                </h2>

                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                  {currentShow.synopsis}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onOpenDossier && onOpenDossier(currentShow)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play size={16} fill="white" /> Watch Trailer
                  </button>

                  <button
                    onClick={() =>
                      toggleWatchlist({
                        id: currentShow.id,
                        title: currentShow.title,
                        poster_path: currentShow.poster,
                        backdrop_path: currentShow.backdrop,
                        vote_average: currentShow.rating,
                        overview: currentShow.synopsis
                      })
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-95"
                  >
                    {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                    {inWatchlist ? "In Watchlist" : "Add to List"}
                  </button>
                </div>
              </div>
            </div>

            {/* EPISODES STRIP (From Video 00:07) */}
            <div className="p-6 md:p-8 space-y-4 border-t border-white/5 bg-[#0e0f17]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white font-display uppercase tracking-wider">
                    Episodes
                  </h3>
                  <span className="text-xs text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                    Season 1
                  </span>
                </div>

                <span className="text-xs text-gray-400 font-medium">
                  {currentShow.episodes.length} episodes available
                </span>
              </div>

              {/* Horizontal Episode Thumbnails Scroll */}
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {currentShow.episodes.map((ep, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenDossier && onOpenDossier(currentShow)}
                    className="flex-none w-56 sm:w-64 group/ep cursor-pointer rounded-2xl overflow-hidden bg-[#151621] border border-white/10 hover:border-purple-500/50 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-video w-full relative overflow-hidden bg-black">
                      <img
                        src={ep.still}
                        alt={ep.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/ep:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover/ep:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 opacity-0 group-hover/ep:opacity-100 transition-opacity">
                          <Play size={16} fill="white" className="translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-1">
                        <span className="text-purple-400">{ep.ep}</span>
                        <span>{ep.duration}</span>
                      </div>
                      <h4 className="text-white font-bold text-xs truncate group-hover/ep:text-purple-300 transition-colors">
                        {ep.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FanDeckHero;
