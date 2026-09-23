import { useEffect, useState, useContext } from "react";
import { X, Play, Plus, ThumbsUp, Check, Search, ExternalLink, Disc, Image as ImageIcon, Star } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalState";
import { fetchDetailedMovieInfo } from "../../utils/movieApi";
import { normalizeMedia } from "../../utils/mediaUtils";
import SmartImage from "../media/SmartImage";

const MovieModal = ({ movie, onClose }) => {
  const { API_KEY, BASE_URL, watchlist, toggleWatchlist, favorites, toggleFavorite } = useContext(GlobalContext);
  const [videoKey, setVideoKey] = useState(null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize incoming movie object to ensure 100% consistent fields
  const media = normalizeMedia(movie);

  const inWatchlist = watchlist?.some((item) => String(item.id) === String(media?.id));
  const isLiked = favorites?.some((item) => String(item.id) === String(media?.id));

  useEffect(() => {
    if (!media) return;

    const fetchData = async () => {
      setLoading(true);
      setVideoKey(null);
      setCast([]);

      try {
        if (media.isJikan) {
          // --- ANIME (JIKAN) ---
          const animeRes = await axios.get(`https://api.jikan.moe/v4/anime/${media.id}`);
          const data = animeRes.data.data;

          if (data?.trailer?.youtube_id) {
            setVideoKey(data.trailer.youtube_id);
          }

          const charRes = await axios.get(`https://api.jikan.moe/v4/anime/${media.id}/characters`);
          const topCast = charRes.data?.data?.slice(0, 5).map((char) => ({
            id: char.character.mal_id,
            name: char.character.name,
            character: char.role,
            profile_path: char.character.images?.jpg?.image_url,
          })) || [];

          setDetails({
            runtime: data?.duration || media.runtime,
            genres: data?.genres || media.genres,
            overview: data?.synopsis || media.overview,
            release_date: data?.year ? String(data.year) : media.release_date,
            score: data?.score || media.vote_average,
            director: "Animation Studio",
            country: "Japan",
            original_title: data?.title_japanese || media.original_title || media.title,
          });
          setCast(topCast);
        } else {
          // --- MOVIE / TV (OMDb + Gemini) ---
          const res = await fetchDetailedMovieInfo(media.title);
          if (res) {
            setVideoKey(res.videoKey);
            setDetails({
              ...res.details,
              score: res.movieData?.vote_average || media.vote_average,
              director: res.movieData?.director || media.director,
              country: res.movieData?.language || media.country,
              original_title: media.original_title || media.title,
            });
            setCast(res.cast || []);
          } else {
            // Fallback to normalized data if external API fails
            setDetails({
              runtime: media.runtime,
              genres: media.genres,
              overview: media.overview,
              release_date: media.release_date,
              score: media.vote_average,
              director: media.director,
              country: media.country,
              original_title: media.original_title,
            });
          }
        }
      } catch (error) {
        console.warn("Error resolving extra details, using standardized media fallback:", error);
        setDetails({
          runtime: media.runtime,
          genres: media.genres,
          overview: media.overview,
          release_date: media.release_date,
          score: media.vote_average,
          director: media.director,
          country: media.country,
          original_title: media.original_title,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media?.id, media?.title]);

  if (!media) return null;

  // Compute radial score values accurately
  const scoreValue = details?.score || media.vote_average || 8.4;
  const normalizedScore = Math.min(10, Math.max(0, Number(scoreValue)));
  const circumference = 2 * Math.PI * 38; // Radius 38
  const strokeDashoffset = circumference - (normalizedScore / 10) * circumference;

  const scoreBadge =
    normalizedScore >= 8.5
      ? { label: "Masterpiece", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
      : normalizedScore >= 7.5
      ? { label: "Great!", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" }
      : { label: "Good", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };

  // Only keep the real backdrop; dead Unsplash hashes are removed
  const sampleStills = [
    media.backdrop_path,
    media.poster_path,
  ].filter(Boolean);

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
                  vertical={media.isJikan ? "anime" : "movies"}
                  decorative
                  className="absolute inset-0 w-full h-full"
                  imgClassName="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-transparent to-black/60" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="bg-black/80 p-6 rounded-2xl backdrop-blur-md border border-white/10 max-w-sm">
                    <p className="text-gray-300 font-semibold mb-3 text-sm sm:text-base">
                      {loading ? "Searching official trailer database..." : "Official YouTube trailer not found in catalog"}
                    </p>
                    {!loading && (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          media.title + " official trailer"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/30"
                      >
                        <Search size={15} /> Search on YouTube <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. DOSSIER DETAILS BODY */}
          <div className="p-6 sm:p-8 space-y-8 bg-[#0c0c11]">
            {/* Top Bar: Title, Badges & Quick Action Controls */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start border-b border-white/10 pb-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                    {media.category}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {details?.release_date || media.release_date}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {details?.runtime || media.runtime}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
                  {media.title}
                </h1>

                {media.original_title && media.original_title !== media.title && (
                  <p className="text-sm font-semibold text-gray-400 italic">
                    Original: {media.original_title}
                  </p>
                )}

                {/* Genre Tags */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {(details?.genres || media.genres)?.map((g, i) => (
                    <span
                      key={g.id || g.mal_id || g.name || i}
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
                  onClick={() => toggleWatchlist(media)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shadow-lg ${
                    inWatchlist
                      ? "bg-blue-600 text-white shadow-blue-600/30"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                  }`}
                >
                  {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </button>

                <button
                  onClick={() => toggleFavorite(media)}
                  className={`p-3 rounded-full border transition-all active:scale-95 ${
                    isLiked
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                      : "bg-white/10 border-white/15 text-gray-300 hover:text-white hover:bg-white/20"
                  }`}
                  title={isLiked ? "Favorited" : "Add to favorites"}
                >
                  <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* 3-Column Dossier: Specs + Radial Score Gauge + Vinyl OST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Column 1: Info Specs */}
              <div className="space-y-4 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Specs & Details
                </span>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-semibold block">Director / Studio</span>
                    <span className="text-gray-200 font-medium">{details?.director || media.director}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs uppercase font-semibold block">Language / Region</span>
                    <span className="text-gray-200 font-medium">{details?.country || media.country}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs uppercase font-semibold block">Community Rating</span>
                    <div className="flex text-yellow-400 gap-1 pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: RADIAL SCORE GAUGE (Design 2 Signature) */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Official Score
                </span>

                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="38"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-white/10"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="38"
                      stroke="currentColor"
                      strokeWidth="6"
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
                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">out of 10</span>
                  </div>
                </div>

                <div className={`mt-3 px-3 py-1 rounded-full text-xs font-black border ${scoreBadge.color}`}>
                  {scoreBadge.label}
                </div>
              </div>

              {/* Column 3: VINYL SOUNDTRACK (OST) RECORD (Design 2 Signature) */}
              <div className="relative overflow-hidden p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between group">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Disc size={14} /> Official Soundtrack
                </span>

                <div className="flex items-center gap-4 py-2">
                  {/* Vinyl Album Cover */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <SmartImage
                      src={media.poster_path}
                      alt=""
                      title={media.title}
                      vertical={media.isJikan ? "anime" : "movies"}
                      decorative
                      className="w-full h-full"
                      imgClassName="object-cover"
                    />
                  </div>

                  {/* Vinyl Disc Sliding Out */}
                  <div className="relative w-14 h-14 rounded-full bg-black border-2 border-gray-800 shadow-xl flex items-center justify-center transform -translate-x-3 group-hover:translate-x-0 group-hover:rotate-45 transition-all duration-500">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white" />
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-1">
                  Original Score & Master Themes
                </p>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white tracking-tight">Synopsis</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {details?.overview || media.overview}
              </p>
            </div>

            {/* Scene Stills Photo Gallery */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <ImageIcon size={15} /> Production Photos & Stills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sampleStills.map((still, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
                  >
                    <SmartImage
                      src={still}
                      alt=""
                      title={`${media.title} still ${idx + 1}`}
                      vertical={media.isJikan ? "anime" : "movies"}
                      decorative
                      className="w-full h-full"
                      imgClassName="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Cast Portraits */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Starring & Cast
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {cast.map((actor, idx) => (
                  <div key={actor.id || idx} className="flex-none flex items-center gap-2.5 pr-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                      <SmartImage
                        src={actor.profile_path}
                        alt=""
                        title={actor.name}
                        vertical={media.isJikan ? "anime" : "movies"}
                        decorative
                        className="w-full h-full"
                        imgClassName="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate w-24">{actor.name}</p>
                      <p className="text-[10px] text-gray-400 truncate w-24">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);
};

export default MovieModal;