import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Check, Star, ChevronLeft, ChevronRight, Disc3, Tv, Film, Sparkles } from "lucide-react";
import { GlobalContext } from "../../context/GlobalState";
import { addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";

const PLAYLIST_DECKS = {
  popular: [
    {
      id: "deck-interstellar",
      tmdbId: "157336",
      title: "Interstellar",
      category: "Movie",
      rating: 8.7,
      year: "2014",
      runtime: "2h 49m",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
    },
    {
      id: "deck-loki",
      tmdbId: "84958",
      title: "Loki: God of Stories",
      category: "TV Show",
      rating: 8.8,
      year: "2023",
      runtime: "2 Seasons",
      genres: ["Action", "Sci-Fi", "Fantasy"],
      synopsis: "The mercurial villain Loki resumes his role as the God of Mischief in a race across the multiverse.",
      poster: "https://image.tmdb.org/t/p/w500/voHUmlvjysv92cr5Vq4g62m8g88.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/b9r3L4cT98fS67N1i7kS5g11a2K.jpg",
    },
    {
      id: "deck-stranger-things",
      tmdbId: "66732",
      title: "Stranger Things",
      category: "TV Show",
      rating: 8.7,
      year: "2024",
      runtime: "4 Seasons",
      genres: ["Sci-Fi", "Horror", "Mystery"],
      synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and the Upside Down.",
      poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4aAB14sIGTe1T156wD.jpg",
    },
    {
      id: "deck-dark-knight",
      tmdbId: "155",
      title: "The Dark Knight",
      category: "Movie",
      rating: 9.0,
      year: "2008",
      runtime: "2h 32m",
      genres: ["Action", "Crime", "Drama"],
      synopsis: "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham City into anarchy.",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    },
    {
      id: "deck-dune2",
      tmdbId: "693134",
      title: "Dune: Part Two",
      category: "Movie",
      rating: 8.8,
      year: "2024",
      runtime: "2h 46m",
      genres: ["Sci-Fi", "Adventure"],
      synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqq99Vl.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    },
    {
      id: "deck-cyberpunk",
      tmdbId: "105248",
      title: "Cyberpunk: Edgerunners",
      category: "Anime",
      rating: 8.9,
      year: "2023",
      runtime: "10 Episodes",
      genres: ["Cyberpunk", "Action", "Anime"],
      synopsis: "A street kid trying to survive in a body modification-obsessed city of the future decides to become an edgerunner.",
      poster: "https://image.tmdb.org/t/p/w500/7Jz7zM4zFsm8Kq2X6e1A4X0q7tH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
    },
    {
      id: "deck-breaking-bad",
      tmdbId: "1396",
      title: "Breaking Bad",
      category: "TV Show",
      rating: 9.5,
      year: "2013",
      runtime: "5 Seasons",
      genres: ["Crime", "Drama", "Thriller"],
      synopsis: "A high school chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine to secure his family's future.",
      poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    },
  ],
  latest: [
    {
      id: "deck-dune2-l",
      tmdbId: "693134",
      title: "Dune: Part Two",
      category: "Movie",
      rating: 8.8,
      year: "2024",
      runtime: "2h 46m",
      genres: ["Sci-Fi", "Adventure"],
      synopsis: "Paul Atreides unites with the Fremen to lead a rebellion against the forces that eradicated his house.",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqq99Vl.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    },
    {
      id: "deck-oppenheimer",
      tmdbId: "872585",
      title: "Oppenheimer",
      category: "Movie",
      rating: 8.9,
      year: "2023",
      runtime: "3h 00m",
      genres: ["Biography", "Drama", "History"],
      synopsis: "The story of J. Robert Oppenheimer's role in the Manhattan Project and the moral dilemmas of the atomic bomb.",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBRoOoA0i.jpg",
    },
    {
      id: "deck-frieren",
      tmdbId: "209867",
      title: "Frieren: Beyond Journey",
      category: "Anime",
      rating: 9.2,
      year: "2024",
      runtime: "28 Episodes",
      genres: ["Fantasy", "Adventure", "Anime"],
      synopsis: "An elf mage journeys to the resting place of souls, contemplating the meaning of mortal lives.",
      poster: "https://image.tmdb.org/t/p/w500/dqzenchTd7lp5zht7BdlqM7RBhD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
    },
  ],
  topRated: [
    {
      id: "deck-godfather",
      tmdbId: "238",
      title: "The Godfather",
      category: "Movie",
      rating: 9.2,
      year: "1972",
      runtime: "2h 55m",
      genres: ["Crime", "Drama"],
      synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
    },
    {
      id: "deck-dark-knight-top",
      tmdbId: "155",
      title: "The Dark Knight",
      category: "Movie",
      rating: 9.0,
      year: "2008",
      runtime: "2h 32m",
      genres: ["Action", "Crime", "Drama"],
      synopsis: "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham City into anarchy.",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    },
    {
      id: "deck-fight-club",
      tmdbId: "550",
      title: "Fight Club",
      category: "Movie",
      rating: 8.8,
      year: "1999",
      runtime: "2h 19m",
      genres: ["Drama", "Thriller"],
      synopsis: "An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker.",
      poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/c6OLXfKAk5BKeR6broC8pYiCquX.jpg",
    },
  ]
};

const PlaylistRecordDeck = ({ onPlay }) => {
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState("popular");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const deck = PLAYLIST_DECKS[activeTab] || PLAYLIST_DECKS.popular;
  const currentRecord = deck[activeIndex] || deck[0];
  const inWatchlist = user && currentRecord?.tmdbId ? isInWatchlist(currentRecord.tmdbId) : false;

  // Auto-sliding timer (flips through records smoothly like a jukebox or vinyl playlist)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % deck.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, deck.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      if (onPlay && currentRecord) {
        onPlay({
          id: currentRecord.tmdbId,
          title: currentRecord.title,
          poster_path: currentRecord.poster,
          backdrop_path: currentRecord.backdrop,
          overview: currentRecord.synopsis,
          vote_average: currentRecord.rating,
          release_date: currentRecord.year,
        });
      }
    } else {
      setActiveIndex(index);
    }
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    if (!user || !defaultPlaylist || !currentRecord) return;
    try {
      if (inWatchlist) {
        await removeMovieFromPlaylist(defaultPlaylist._id, String(currentRecord.tmdbId));
      } else {
        await addMovieToPlaylist(defaultPlaylist._id, {
          tmdbId: String(currentRecord.tmdbId),
          title: currentRecord.title,
          poster_path: currentRecord.poster,
          backdrop_path: currentRecord.backdrop,
          overview: currentRecord.synopsis,
          vote_average: currentRecord.rating,
          release_date: currentRecord.year,
        });
      }
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (err) {
      console.error("Watchlist error in record deck:", err);
    }
  };

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-[#0B1120] select-none">
      {/* ATMOSPHERIC BLUE RADIAL GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* 1. HEADER & FILTER PILLS (BLUE & WHITE) */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {/* Vinyl Record Kicker Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-600/15 text-xs font-bold uppercase tracking-widest text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <Disc3 size={15} className="text-blue-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Interactive Playlist Records</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
            Discover Unlimited <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-white">Content</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-lg mx-auto">
            Browse titles fanned out like vinyl records in a crate. Click or slide to select your next feature.
          </p>

          {/* Filter Pills with Electric Blue Indicator */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#0e1628]/90 backdrop-blur-xl border border-white/10 shadow-xl mt-2">
            {[
              { id: "popular", label: "Popular" },
              { id: "latest", label: "Latest" },
              { id: "topRated", label: "Top Rated" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveIndex(0);
                }}
                className={`relative px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "text-white shadow-lg shadow-blue-600/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeRecordFilter"
                    className="absolute inset-0 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. THE 3D FAN-OUT RECORD DECK CAROUSEL */}
        <div
          className="relative h-[430px] sm:h-[480px] w-full flex items-center justify-center select-none perspective-[1200px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows (Electric Blue & White) */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 z-50 w-11 h-11 rounded-full bg-[#0B1120]/80 hover:bg-blue-600 border border-blue-500/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Previous Record"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 z-50 w-11 h-11 rounded-full bg-[#0B1120]/80 hover:bg-blue-600 border border-blue-500/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Next Record"
          >
            <ChevronRight size={22} />
          </button>

          {/* Cards Stack (3D Fan-out Geometry) */}
          <div className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] flex items-center justify-center">
            {deck.map((item, index) => {
              const offset = index - activeIndex;
              const isCenter = offset === 0;

              // Hide cards too far from center to save memory
              if (Math.abs(offset) > 3) return null;

              // Compute 3D fan-out transforms
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
                  className={`absolute w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] rounded-3xl overflow-hidden cursor-pointer bg-[#0e1628] border transition-all duration-300 ${
                    isCenter
                      ? "border-blue-500 shadow-[0_20px_60px_rgba(37,99,235,0.4)] ring-2 ring-blue-500/50"
                      : "border-white/10 shadow-2xl opacity-60 hover:opacity-100"
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Poster Image */}
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
                    <div className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-yellow-400 font-bold text-xs flex items-center gap-1 shadow-md">
                      <Star size={13} fill="currentColor" /> {item.rating}
                    </div>

                    <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-blue-500/30 text-blue-400 font-bold text-xs shadow-md flex items-center gap-1.5">
                      {item.category === "Movie" ? <Film size={12} /> : <Tv size={12} />}
                      {item.category}
                    </div>
                  </div>

                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent" />

                  {/* Bottom Meta & Action Bar on Center Record */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-2 text-center flex flex-col items-center z-20">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 text-xs font-semibold">
                      {item.year} • {item.runtime}
                    </p>

                    {/* Action Buttons on Center Record */}
                    {isCenter && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 pt-2"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(index);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/40 transition-transform active:scale-95"
                        >
                          <Play size={13} fill="white" /> Watch Trailer
                        </button>

                        {user && (
                          <button
                            onClick={handleWatchlistToggle}
                            className={`p-2 rounded-full border transition-all ${
                              inWatchlist
                                ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/40"
                                : "bg-black/60 border-white/20 text-white hover:bg-white/20"
                            }`}
                            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                          >
                            {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PlaylistRecordDeck);
