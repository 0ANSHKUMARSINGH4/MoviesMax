import { useEffect, useState, useContext } from "react";
import { X, Plus, Check, Disc } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { fetchMovieDetails, addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";
import { normalizeMedia } from "../../utils/mediaUtils";
import SmartImage from "../media/SmartImage";

const MovieModal = ({ movie, onClose }) => {
  const navigate = useNavigate();
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const media = normalizeMedia(movie);
  const [videoKey, setVideoKey] = useState(null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!media?.id) return;
    setLoading(true);
    setVideoKey(null);
    setCast([]);
    fetchMovieDetails(media.id)
      .then((d) => {
        if (d) {
          setVideoKey(d.trailerKey || null);
          setDetails(d);
          setCast(d.cast || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [media?.id]);

  if (!media) return null;

  const inWatchlist = user ? isInWatchlist(media?.id) : false;

  const handleWatchlistClick = async () => {
    if (!user) { navigate("/login"); return; }
    if (!defaultPlaylist) return;
    try {
      if (inWatchlist) {
        await removeMovieFromPlaylist(defaultPlaylist._id, String(media.id));
      } else {
        await addMovieToPlaylist(defaultPlaylist._id, {
          tmdbId: String(media.id),
          title: media.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: media.overview,
          vote_average: media.vote_average,
          release_date: media.release_date,
          genres: media.genres,
          runtime: movie.runtime || null,
        });
      }
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (e) {
      console.error("Watchlist error:", e);
    }
  };

  // Score ring
  const scoreValue = details?.vote_average || media.vote_average || null;
  const normalizedScore = scoreValue ? Math.min(10, Math.max(0, Number(scoreValue))) : null;
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = normalizedScore != null
    ? circumference - (normalizedScore / 10) * circumference
    : circumference;

  const scoreBadge =
    normalizedScore >= 8.5
      ? { label: "Masterpiece", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
      : normalizedScore >= 7.5
      ? { label: "Great!", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" }
      : { label: "Good", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };

  const displayGenres = details?.genres || media.genres || [];
  const displayOverview = details?.overview || media.overview || "";
  const displayRuntime = details?.runtime || media.runtime || "";
  const displayRelease = details?.release_date || media.release_date || "";
  const displayDirector = details?.director || media.director || "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 select-none">
        {/* Dark Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* MODAL DOSSIER CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-5xl bg-[#0c0c11] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 sm:hidden" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-black/75 hover:bg-white text-white hover:text-black p-2.5 rounded-full transition-all shadow-xl border border-white/15 hover:scale-110 active:scale-90"
            title="Close"
          >
            <X size={18} />
          </button>

          <div className="overflow-y-auto custom-scrollbar">
            {/* 1. 16:9 VIDEO TRAILER SECTION */}
            <div className="relative aspect-video w-full bg-black">
              {videoKey ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                  title="Official Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full relative">
                  <SmartImage
                    src={media.backdrop_path}
                    alt=""
                    title={media.title}
                    vertical="movies"
                    decorative
                    className="absolute inset-0 w-full h-full"
                    imgClassName="object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-transparent to-black/60" />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. DOSSIER DETAILS BODY */}
            <div className="p-6 sm:p-8 space-y-8 bg-[#0c0c11]">
              {/* Top Bar: Title, Badges & Quick Action Controls */}
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start border-b border-white/10 pb-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-meta font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                      {media.category}
                    </span>
                    {displayRelease && (
                      <span className="text-xs text-gray-400 font-semibold">
                        {displayRelease}
                      </span>
                    )}
                    {displayRuntime && (
                      <>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400 font-semibold">
                          {typeof displayRuntime === "number" ? `${displayRuntime} min` : displayRuntime}
                        </span>
                      </>
                    )}
                  </div>

                  <h1 className="text-card-title sm:text-section font-black text-white tracking-tight font-display">
                    {media.title}
                  </h1>

                  {media.original_title && media.original_title !== media.title && (
                    <p className="text-sm font-semibold text-gray-400 italic">
                      Original: {media.original_title}
                    </p>
                  )}

                  {/* Genre Tags */}
                  <div className="flex gap-2 flex-wrap pt-1">
                    {displayGenres.map((g, i) => (
                      <span
                        key={g.id || g.name || i}
                        className="text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                      >
                        {g.name || g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleWatchlistClick}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shadow-lg ${
                      inWatchlist
                        ? "bg-blue-600 text-white shadow-blue-600/30"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    }`}
                  >
                    {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                    {!user
                      ? "Sign in to Save"
                      : inWatchlist
                      ? "✓ In Watchlist"
                      : "+ Add to Watchlist"}
                  </button>
                </div>
              </div>

              {/* 3-Column Dossier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Column 1: Specs */}
                <div className="space-y-4 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Specs &amp; Details
                  </span>

                  <div className="space-y-3 text-sm">
                    {displayDirector && (
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Director</span>
                        <span className="text-gray-200 font-medium">{displayDirector}</span>
                      </div>
                    )}
                    {displayRuntime && (
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Runtime</span>
                        <span className="text-gray-200 font-medium">
                          {typeof displayRuntime === "number" ? `${displayRuntime} min` : displayRuntime}
                        </span>
                      </div>
                    )}
                    {displayRelease && (
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Release Date</span>
                        <span className="text-gray-200 font-medium">{displayRelease}</span>
                      </div>
                    )}
                    {displayGenres.length > 0 && (
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Genres</span>
                        <span className="text-gray-200 font-medium">
                          {displayGenres.map((g) => g.name || g).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Score Block */}
                {normalizedScore != null ? (
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Official Score
                    </span>

                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="38" stroke="currentColor" strokeWidth="6" className="text-white/10" fill="transparent" />
                        <circle
                          cx="56" cy="56" r="38"
                          stroke="currentColor" strokeWidth="6"
                          className="text-blue-500"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white leading-none">
                          {normalizedScore.toFixed(1)}
                        </span>
                        <span className="text-meta font-bold text-gray-400 mt-0.5">out of 10</span>
                      </div>
                    </div>

                    <div className={`mt-3 px-3 py-1 rounded-full text-xs font-black border ${scoreBadge.color}`}>
                      {scoreBadge.label}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <span className="text-meta uppercase text-gray-500">No Score Data</span>
                  </div>
                )}

                {/* Column 3: Soundtrack placeholder */}
                <div className="relative overflow-hidden p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between group">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Disc size={14} /> Official Soundtrack
                  </span>

                  <div className="flex items-center gap-4 py-2">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                      <SmartImage
                        src={media.poster_path}
                        alt=""
                        title={media.title}
                        vertical="movies"
                        decorative
                        className="w-full h-full"
                        imgClassName="object-cover"
                      />
                    </div>

                    <div className="relative w-14 h-14 rounded-full bg-black border-2 border-gray-800 shadow-xl flex items-center justify-center transform -translate-x-3 group-hover:translate-x-0 group-hover:rotate-45 transition-all duration-500">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-1">
                    Original Score &amp; Master Themes
                  </p>
                </div>
              </div>

              {/* Synopsis */}
              {displayOverview && displayOverview.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-section font-bold text-white tracking-tight">Synopsis</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {displayOverview}
                  </p>
                </div>
              )}

              {/* Cast Portraits */}
              {cast.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    Starring &amp; Cast
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                    {cast.map((actor, idx) => (
                      <div key={actor.id || idx} className="flex-none flex items-center gap-2.5 pr-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                          <SmartImage
                            src={
                              actor.profile_path
                                ? actor.profile_path.startsWith("http")
                                  ? actor.profile_path
                                  : `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : null
                            }
                            alt=""
                            title={actor.name}
                            vertical="movies"
                            decorative
                            className="w-full h-full"
                            imgClassName="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white truncate w-24">{actor.name}</p>
                          <p className="text-meta text-gray-400 truncate w-24">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MovieModal;
