import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Plus,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Tv,
  Film,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import {
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  fetchPlaylists,
} from "../../utils/movieApi";

// ============================================================================
// VERIFIED TMDB CATALOGS FOR SECTIONS: MOVIES, WEBSERIES & ANIME
// ============================================================================
const SECTION_DECKS = {
  movies: [
    {
      id: "deck-movie-157336",
      tmdbId: "157336",
      title: "Interstellar",
      category: "Movie",
      section: "movies",
      rating: 8.7,
      year: "2014",
      runtime: "2h 49m",
      genres: ["Sci-Fi", "Adventure", "Drama"],
      synopsis:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      poster: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
    },
    {
      id: "deck-movie-693134",
      tmdbId: "693134",
      title: "Dune: Part Two",
      category: "Movie",
      section: "movies",
      rating: 8.8,
      year: "2024",
      runtime: "2h 46m",
      genres: ["Sci-Fi", "Adventure"],
      synopsis:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      poster: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    },
    {
      id: "deck-movie-155",
      tmdbId: "155",
      title: "The Dark Knight",
      category: "Movie",
      section: "movies",
      rating: 9.0,
      year: "2008",
      runtime: "2h 32m",
      genres: ["Action", "Crime", "Drama"],
      synopsis:
        "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham City into anarchy.",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg",
    },
    {
      id: "deck-movie-872585",
      tmdbId: "872585",
      title: "Oppenheimer",
      category: "Movie",
      section: "movies",
      rating: 8.9,
      year: "2023",
      runtime: "3h 01m",
      genres: ["Biography", "Drama", "History"],
      synopsis:
        "The story of J. Robert Oppenheimer's role in the Manhattan Project and the moral dilemmas of the atomic bomb.",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    },
    {
      id: "deck-movie-27205",
      tmdbId: "27205",
      title: "Inception",
      category: "Movie",
      section: "movies",
      rating: 8.8,
      year: "2010",
      runtime: "2h 28m",
      genres: ["Action", "Sci-Fi", "Thriller"],
      synopsis:
        "A skilled thief commits corporate espionage through subconscious infiltration and attempts inception.",
      poster: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    },
    {
      id: "deck-movie-550",
      tmdbId: "550",
      title: "Fight Club",
      category: "Movie",
      section: "movies",
      rating: 8.8,
      year: "1999",
      runtime: "2h 19m",
      genres: ["Drama", "Thriller"],
      synopsis:
        "An insomniac office worker and a soap salesman create an underground fight club that spirals out of control.",
      poster: "https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/c6OLXfKAk5BKeR6broC8pYiCquX.jpg",
    },
    {
      id: "deck-movie-98",
      tmdbId: "98",
      title: "Gladiator",
      category: "Movie",
      section: "movies",
      rating: 8.5,
      year: "2000",
      runtime: "2h 35m",
      genres: ["Action", "Adventure", "Drama"],
      synopsis:
        "A betrayed Roman general fights his way through the gladiator arena to avenge the murder of his family.",
      poster: "https://image.tmdb.org/t/p/w500/aDb548BOkFfI4nFm0kx8A3Ezh7H.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/Ar7QuJ7sJEiC0oP3I8fKBKIQD9u.jpg",
    },
  ],

  webseries: [
    {
      id: "deck-tv-94997",
      tmdbId: "94997",
      title: "House of the Dragon",
      category: "TV Show",
      section: "webseries",
      rating: 8.6,
      year: "2024",
      runtime: "2 Seasons",
      genres: ["Fantasy", "Action", "Drama"],
      synopsis:
        "An internal succession war within House Targaryen at the height of its power with dragons colliding for the Iron Throne.",
      poster: "https://image.tmdb.org/t/p/w500/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/577eXC8wFQT0eUrJcgznSiFPRmk.jpg",
    },
    {
      id: "deck-tv-1396",
      tmdbId: "1396",
      title: "Breaking Bad",
      category: "TV Show",
      section: "webseries",
      rating: 9.5,
      year: "2013",
      runtime: "5 Seasons",
      genres: ["Crime", "Drama", "Thriller"],
      synopsis:
        "A chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine to secure his family's future.",
      poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    },
    {
      id: "deck-tv-66732",
      tmdbId: "66732",
      title: "Stranger Things",
      category: "TV Show",
      section: "webseries",
      rating: 8.7,
      year: "2024",
      runtime: "4 Seasons",
      genres: ["Sci-Fi", "Horror", "Mystery"],
      synopsis:
        "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and the Upside Down.",
      poster: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg",
    },
    {
      id: "deck-tv-95396",
      tmdbId: "95396",
      title: "Severance",
      category: "TV Show",
      section: "webseries",
      rating: 8.7,
      year: "2024",
      runtime: "Season 2",
      genres: ["Sci-Fi", "Mystery", "Thriller"],
      synopsis:
        "Mark leads office workers whose memories have been surgically divided between their work and personal lives.",
      poster: "https://image.tmdb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/ixgFmf1X59PUZam2qbAfskx2gQr.jpg",
    },
    {
      id: "deck-tv-84958",
      tmdbId: "84958",
      title: "Loki",
      category: "TV Show",
      section: "webseries",
      rating: 8.8,
      year: "2023",
      runtime: "2 Seasons",
      genres: ["Action", "Sci-Fi", "Fantasy"],
      synopsis:
        "The mercurial villain Loki resumes his role as the God of Mischief across time and the multiverse.",
      poster: "https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg",
    },
    {
      id: "deck-tv-100088",
      tmdbId: "100088",
      title: "The Last of Us",
      category: "TV Show",
      section: "webseries",
      rating: 8.8,
      year: "2023",
      runtime: "1 Season",
      genres: ["Drama", "Action", "Adventure"],
      synopsis:
        "A hardened survivor is hired to smuggle a 14-year-old girl out of an oppressive quarantine zone.",
      poster: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg",
    },
    {
      id: "deck-tv-1399",
      tmdbId: "1399",
      title: "Game of Thrones",
      category: "TV Show",
      section: "webseries",
      rating: 9.3,
      year: "2019",
      runtime: "8 Seasons",
      genres: ["Fantasy", "Drama", "Action"],
      synopsis:
        "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
      poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg",
    },
  ],

  anime: [
    {
      id: "deck-anime-1429",
      tmdbId: "1429",
      title: "Attack on Titan",
      category: "Anime",
      section: "anime",
      rating: 9.1,
      year: "2023",
      runtime: "4 Seasons",
      genres: ["Action", "Dark Fantasy", "Anime"],
      synopsis:
        "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant Titans.",
      poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
    },
    {
      id: "deck-anime-95479",
      tmdbId: "95479",
      title: "Jujutsu Kaisen",
      category: "Anime",
      section: "anime",
      rating: 8.6,
      year: "2023",
      runtime: "2 Seasons",
      genres: ["Supernatural", "Action", "Anime"],
      synopsis:
        "A boy with immense physical strength swallows a cursed finger to save a friend and joins Tokyo Jujutsu High.",
      poster: "https://image.tmdb.org/t/p/w500/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/flgn0jXbg8GIe2qaWfd70A0uzfp.jpg",
    },
    {
      id: "deck-anime-209867",
      tmdbId: "209867",
      title: "Frieren: Beyond Journey's End",
      category: "Anime",
      section: "anime",
      rating: 9.2,
      year: "2024",
      runtime: "28 Episodes",
      genres: ["Fantasy", "Adventure", "Anime"],
      synopsis:
        "After defeating the Demon King, an elven mage journeys across the land contemplating the mortality of human lives.",
      poster: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
    },
    {
      id: "deck-anime-114410",
      tmdbId: "114410",
      title: "Chainsaw Man",
      category: "Anime",
      section: "anime",
      rating: 8.5,
      year: "2022",
      runtime: "1 Season",
      genres: ["Action", "Dark Fantasy", "Anime"],
      synopsis:
        "Denji is forced by the yakuza into killing devils with his pet devil Pochita until a betrayal gives him chainsaw power.",
      poster: "https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/fOUKSCbZzaoQKsO39enivHnWDid.jpg",
    },
    {
      id: "deck-anime-37854",
      tmdbId: "37854",
      title: "One Piece",
      category: "Anime",
      section: "anime",
      rating: 8.8,
      year: "1999",
      runtime: "1000+ Episodes",
      genres: ["Adventure", "Action", "Anime"],
      synopsis:
        "Monkey D. Luffy sets out with his pirate crew across the Grand Line to find the legendary treasure One Piece.",
      poster: "https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg",
    },
    {
      id: "deck-anime-30984",
      tmdbId: "30984",
      title: "Bleach",
      category: "Anime",
      section: "anime",
      rating: 8.3,
      year: "2004",
      runtime: "16 Seasons",
      genres: ["Supernatural", "Action", "Anime"],
      synopsis:
        "High school student Ichigo Kurosaki gains the abilities of a Soul Reaper to defend humanity from evil spirits.",
      poster: "https://image.tmdb.org/t/p/w500/2EewmxXe72ogD0EaWM8gqa0ccIw.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/o0NsbcIvsllg6CJX0FBFY8wWbsn.jpg",
    },
    {
      id: "deck-anime-127532",
      tmdbId: "127532",
      title: "Solo Leveling",
      category: "Anime",
      section: "anime",
      rating: 8.7,
      year: "2024",
      runtime: "Season 1",
      genres: ["Action", "Fantasy", "Anime"],
      synopsis:
        "Known as the weakest hunter of all mankind, Sung Jinwoo is chosen by a mysterious quest system that lets him level up infinitely.",
      poster: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
    },
  ],
};

const SECTION_TABS = [
  { id: "movies", label: "Movies", path: "/movies", icon: Film },
  { id: "webseries", label: "Webseries", path: "/webseries", icon: Tv },
  { id: "anime", label: "Anime", path: "/anime", icon: Sparkles },
];

const PlaylistRecordDeck = ({ onPlay }) => {
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Active section: 'movies' | 'webseries' | 'anime'
  const [activeTab, setActiveTab] = useState("movies");

  // Continuous infinite timeline counter (can increment/decrement forever)
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const deck = useMemo(() => SECTION_DECKS[activeTab] || SECTION_DECKS.movies, [activeTab]);
  const deckLength = deck.length;

  // Normalized active record for metadata display & trailer trigger
  const normalizedActiveIndex = ((timelineIndex % deckLength) + deckLength) % deckLength;
  const currentRecord = deck[normalizedActiveIndex] || deck[0];
  const inWatchlist = user && currentRecord?.tmdbId ? isInWatchlist(currentRecord.tmdbId) : false;

  // ==========================================================================
  // CONTINUOUS INFINITE AUTO-SLIDING (Pauses on hover/touch)
  // ==========================================================================
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setTimelineIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleNext = () => {
    setTimelineIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setTimelineIndex((prev) => prev - 1);
  };

  const handleCardClick = (windowOffset, clickedItem) => {
    if (windowOffset === 0) {
      // Center card clicked -> open movie theatre modal
      if (onPlay && clickedItem) {
        onPlay({
          id: clickedItem.tmdbId,
          title: clickedItem.title,
          poster_path: clickedItem.poster,
          backdrop_path: clickedItem.backdrop,
          overview: clickedItem.synopsis,
          vote_average: clickedItem.rating,
          release_date: clickedItem.year,
        });
      }
    } else {
      // Side card clicked -> rotate deck to bring clicked card to center
      setTimelineIndex((prev) => prev + windowOffset);
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

  // Generate 7 visible continuous positions around the active timeline counter
  // Offsets: [-3, -2, -1, 0, 1, 2, 3]
  const visibleCards = useMemo(() => {
    const offsets = [-3, -2, -1, 0, 1, 2, 3];
    return offsets.map((offset) => {
      const continuousKey = timelineIndex + offset;
      const wrappedIndex = ((continuousKey % deckLength) + deckLength) % deckLength;
      return {
        continuousKey,
        offset,
        item: deck[wrappedIndex],
      };
    });
  }, [timelineIndex, deck, deckLength]);

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-[#0B1120] select-none">
      {/* ATMOSPHERIC BLUE RADIAL GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] bg-gradient-to-tr from-blue-600/15 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* 1. HEADER & SECTION OPTIONS (MOVIES • WEBSERIES • ANIME) */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {/* Section Kicker Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-600/15 text-xs font-bold uppercase tracking-widest text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Disc3 size={15} className="text-blue-400 animate-spin" style={{ animationDuration: "5s" }} />
            <span>Interactive Vinyl Record Deck</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-white">Section</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-xl mx-auto">
            Browse titles fanned out like records in a vinyl crate. Select Movies, Webseries, or Anime, slide through the collection, or jump straight into the full section portal.
          </p>

          {/* Section Options (Movies, Webseries, Anime) */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#0e1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl mt-2">
            {SECTION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setTimelineIndex(0);
                  }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "text-white shadow-lg shadow-blue-600/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSectionIndicator"
                      className="absolute inset-0 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={14} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Direct Portal Navigation Link */}
          <div className="pt-1">
            <Link
              to={SECTION_TABS.find((t) => t.id === activeTab)?.path || "/movies"}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              <span>Explore All {SECTION_TABS.find((t) => t.id === activeTab)?.label} in Full Grid</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 2. THE 3D FAN-OUT INFINITE RECORD DECK CAROUSEL */}
        <div
          className="relative h-[430px] sm:h-[480px] w-full flex items-center justify-center select-none perspective-[1200px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Navigation Arrows (Electric Blue & White) */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 z-50 w-11 h-11 rounded-full bg-[#0B1120]/80 hover:bg-blue-600 border border-blue-500/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Previous Record"
            aria-label="Previous Record"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 z-50 w-11 h-11 rounded-full bg-[#0B1120]/80 hover:bg-blue-600 border border-blue-500/30 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Next Record"
            aria-label="Next Record"
          >
            <ChevronRight size={22} />
          </button>

          {/* Cards Stack (Continuous Infinite Fan-out Geometry) */}
          <div className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] flex items-center justify-center">
            {visibleCards.map(({ continuousKey, offset, item }) => {
              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);

              // 3D Arc calculation:
              // Mobile offsets are smaller to fit on small screens
              const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
              const xStep = isMobile ? 65 : 105;
              const xOffset = offset * xStep;
              const rotateZ = offset * 7;
              const rotateY = offset * -14;
              const scale = 1 - absOffset * 0.12;
              const zIndex = 40 - absOffset * 10;
              
              // Fade smoothly: at offset +/-3 it reaches 0 so cards enter/exit seamlessly
              const opacity = absOffset >= 3 ? 0 : 1 - absOffset * 0.25;

              return (
                <motion.div
                  key={continuousKey}
                  onClick={() => handleCardClick(offset, item)}
                  animate={{
                    x: xOffset,
                    rotateZ: rotateZ,
                    rotateY: rotateY,
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 26,
                    mass: 0.8,
                  }}
                  className={`absolute w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] rounded-3xl overflow-hidden cursor-pointer bg-[#0e1628] border transition-all duration-300 ${
                    isCenter
                      ? "border-blue-500 shadow-[0_20px_60px_rgba(37,99,235,0.45)] ring-2 ring-blue-500/60"
                      : "border-white/10 shadow-2xl opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    pointerEvents: absOffset >= 3 ? "none" : "auto",
                  }}
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
                    <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-yellow-400 font-bold text-xs flex items-center gap-1 shadow-md">
                      <Star size={13} fill="currentColor" /> {item.rating}
                    </div>

                    <div className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-blue-500/30 text-blue-400 font-bold text-xs shadow-md flex items-center gap-1.5 capitalize">
                      {item.category === "Movie" ? (
                        <Film size={12} />
                      ) : item.category === "Anime" ? (
                        <Sparkles size={12} />
                      ) : (
                        <Tv size={12} />
                      )}
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
                            handleCardClick(0, item);
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
