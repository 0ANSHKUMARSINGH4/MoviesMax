import { useEffect, useState, useContext } from "react";
import { X, Play, Plus, Check, Star, Sparkles, Film, Calendar, Clock, User, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import { fetchMovieDetails, addMovieToPlaylist, removeMovieFromPlaylist, fetchPlaylists } from "../../utils/movieApi";
import { normalizeMedia } from "../../utils/mediaUtils";

const MovieModal = ({ movie, onClose }) => {
  const navigate = useNavigate();
  const { user, defaultPlaylist, isInWatchlist, setPlaylists } = useContext(GlobalContext);
  const media = normalizeMedia(movie);
  const [videoKey, setVideoKey] = useState(null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (!media?.id) return;
    setLoading(true);
    setVideoKey(null);
    setCast([]);
    setSimilar([]);

    fetchMovieDetails(media.id)
      .then((d) => {
        if (d) {
          setVideoKey(d.trailerKey || null);
          setDetails(d);
          setCast(Array.isArray(d.cast) ? d.cast : []);
          setSimilar(Array.isArray(d.similar) ? d.similar : []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [media?.id]);

  if (!media) return null;

  const inWatchlist = user && media?.id ? isInWatchlist(media.id) : false;
  const rawRating = Number(details?.vote_average ?? media.vote_average ?? 8.0);
  const ratingValue = isNaN(rawRating) ? 8.0 : Math.min(10, Math.max(0, rawRating));
  const scoreOutOf10 = ratingValue.toFixed(1);
  const matchPercentage = Math.min(99, Math.max(80, Math.round(ratingValue * 10) + 4));

  // Circular Score calculation
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (ratingValue / 10) * circumference;

  const handleWatchlistClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!defaultPlaylist) return;
    try {
      if (inWatchlist) {
        await removeMovieFromPlaylist(defaultPlaylist._id, String(media.id));
      } else {
        await addMovieToPlaylist(defaultPlaylist._id, {
          tmdbId: String(media.id),
          title: media.title,
          poster_path: media.poster_path,
          backdrop_path: media.backdrop_path,
          overview: media.overview,
          vote_average: media.vote_average,
          release_date: media.release_date,
          genres: media.genres,
          runtime: details?.runtime || media.runtime || null,
        });
      }
      const updated = await fetchPlaylists();
      setPlaylists(updated);
    } catch (e) {
      console.error("Watchlist error:", e);
    }
  };

  const rawGenres = details?.genres || media.genres || [];
  const displayGenres = Array.isArray(rawGenres) ? rawGenres : [];
  const displayOverview = details?.overview || media.overview || "";
  const displayRelease = details?.release_date || media.release_date || "";
  const displayRuntime = details?.runtime ? `${details.runtime} min` : media.runtime || "";
  const displayDirector = typeof details?.director === 'string' ? details.director : (typeof media?.director === 'string' ? media.director : "");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-y-auto">
      {/* BACKDROP BLUR OVERLAY */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* CINEMATIC THEATRE MODAL CONTAINER */}
      <div className="relative w-full max-w-5xl bg-[#0B1120] border border-blue-500/20 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.2)] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col text-white">
        {/* MODAL THEATRE HEADER */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#0e1628] border-b border-white/10 z-30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3B82F6]" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              MoviesMax Cinema Showcase
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-300 font-medium">
              {videoKey ? "Official Trailer" : "Media Dossier"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE MODAL BODY */}
        <div className="overflow-y-auto custom-scrollbar">
          {/* 1. DEDICATED CINEMA THEATRE SCREEN (Zero overlapping buttons on iframe) */}
          <div className="relative aspect-video w-full bg-black flex-shrink-0">
            {videoKey ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1`}
                title="Official Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full relative">
                <img
                  src={media.backdrop_path || media.poster_path}
                  alt={media.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-4 text-center">
                  {loading ? (
                    <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <Film size={26} />
                      </div>
                      <p className="text-sm font-semibold text-gray-300">Official trailer currently in queue</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. MEDIA DOSSIER BODY */}
          <div className="p-6 sm:p-8 space-y-8 bg-[#0B1120]">
            {/* TITLE & PRIMARY ACTIONS BAR (Placed cleanly BELOW the trailer) */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start border-b border-white/10 pb-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                    {media.category || "Featured"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-white/10 text-xs font-semibold text-gray-300">
                    4K ULTRA HD
                  </span>
                  <span className="px-2 py-0.5 rounded border border-white/20 text-xs text-gray-300">
                    16+
                  </span>
                  {displayRelease && (
                    <span className="text-xs text-gray-400 font-medium">
                      {displayRelease.slice(0, 4)}
                    </span>
                  )}
                  {displayRuntime && (
                    <>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-400 font-medium">{displayRuntime}</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {media.title}
                </h1>

                {media.original_title && media.original_title !== media.title && (
                  <p className="text-sm font-medium text-blue-300/80 italic">
                    Original: {media.original_title}
                  </p>
                )}

                {/* Genre Tags */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {displayGenres.map((g, i) => {
                    const genreName = typeof g === "string" ? g : (g && typeof g === "object" ? g.name : "");
                    if (!genreName) return null;
                    return (
                      <span
                        key={g?.id || genreName || i}
                        className="text-xs font-medium text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                      >
                        {genreName}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTONS (BLUE & WHITE) */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleWatchlistClick}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${
                    inWatchlist
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
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

            {/* THREE-COLUMN SPECS & SCORE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Specs */}
              <div className="space-y-4 bg-[#111827]/70 p-5 rounded-2xl border border-white/5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Specifications
                </span>

                <div className="space-y-3 text-sm">
                  {displayDirector && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider block text-gray-500 font-semibold">Director / Creator</span>
                      <span className="text-gray-200 font-medium">{displayDirector}</span>
                    </div>
                  )}
                  {displayRuntime && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider block text-gray-500 font-semibold">Runtime</span>
                      <span className="text-gray-200 font-medium">{displayRuntime}</span>
                    </div>
                  )}
                  {displayRelease && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider block text-gray-500 font-semibold">Release Date</span>
                      <span className="text-gray-200 font-medium">{displayRelease}</span>
                    </div>
                  )}
                  {cast && cast.length > 0 && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider block text-gray-500 font-semibold">Starring</span>
                      <span className="text-gray-200 font-medium line-clamp-2">
                        {cast.slice(0, 4).map((c) => (typeof c === "string" ? c : c?.name || "")).filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Circular Score Ring */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#111827]/70 border border-white/5 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Audience &amp; Critic Score
                </span>

                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="32" stroke="currentColor" strokeWidth="5" className="text-white/10" fill="transparent" />
                    <circle
                      cx="48" cy="48" r="32"
                      stroke="currentColor" strokeWidth="5"
                      className="text-blue-500"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white leading-none">
                      {scoreOutOf10}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">/ 10</span>
                  </div>
                </div>

                <div className="mt-2.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {matchPercentage}% Global Match
                </div>
              </div>

              {/* Column 3: Overview Synopsis */}
              <div className="p-5 rounded-2xl bg-[#111827]/70 border border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
                    Synopsis
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal line-clamp-6">
                    {displayOverview || "No synopsis available for this title."}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. MORE LIKE THIS RECOMMENDATIONS */}
            {similar && similar.length > 0 && (
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-400" /> More Recommendations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {similar.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#111827] rounded-xl overflow-hidden cursor-pointer group hover:bg-[#1a233a] border border-white/5 hover:border-blue-500/40 transition-all"
                      onClick={() => {
                        onClose();
                        setTimeout(() => navigate(`/search?q=${encodeURIComponent(item.title)}`), 100);
                      }}
                    >
                      <img
                        src={item.poster_path || item.backdrop_path}
                        alt={item.title}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-2">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-blue-400 font-bold mt-0.5">
                          {Number(item.vote_average || 8.0).toFixed(1)} ★
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
