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
  const media = normalizeMedia(movie);
  const [videoKey, setVideoKey] = useState(media?.youtube_id || null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize incoming movie object to ensure 100% consistent fields
  const vertical = media?.vertical || (media?.isJikan ? "anime" : (media?.category === "TV Show" || media?.category === "series" ? "series" : "movies"));

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
          } else if (media.youtube_id) {
            setVideoKey(media.youtube_id);
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
            original_title: data?.title_japanese || media.original_title || media.title,
            studio: data?.studios?.[0]?.name,
            source_material: data?.source,
            season_year: data?.season ? `${data.season} ${data.year}` : "",
            simulcast: data?.broadcast?.string,
          });
          setCast(topCast);
        } else {
          // --- MOVIE / TV (OMDb + Gemini) ---
          const res = await fetchDetailedMovieInfo(media.title);
          if (res) {
            setVideoKey(res.videoKey || media.youtube_id || null);
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
  const scoreValue = details?.score || media.vote_average || null;
  const normalizedScore = scoreValue ? Math.min(10, Math.max(0, Number(scoreValue))) : null;
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
                  <span className="text-xs text-gray-400 font-semibold">
                    {details?.release_date || media.release_date}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {details?.runtime || media.runtime}
                  </span>
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

            {/* 3-Column Dossier: Vertical-Aware Schemas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Column 1: Specs */}
              <div className="space-y-4 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {vertical === "sports" || vertical === "esports" ? "Match Details" : "Specs & Details"}
                </span>

                <div className="space-y-3 text-sm">
                  {vertical === "movies" && (
                    <>
                      {details?.director && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Director</span>
                          <span className="text-gray-200 font-medium">{details.director}</span>
                        </div>
                      )}
                      {details?.studio && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Studio</span>
                          <span className="text-gray-200 font-medium">{details.studio}</span>
                        </div>
                      )}
                      {details?.certification && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Certification</span>
                          <span className="text-gray-200 font-medium">{details.certification}</span>
                        </div>
                      )}
                      {details?.release_date && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Release Year</span>
                          <span className="text-gray-200 font-medium">{details.release_date}</span>
                        </div>
                      )}
                    </>
                  )}

                  {vertical === "series" && (
                    <>
                      {details?.showrunner && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Showrunner</span>
                          <span className="text-gray-200 font-medium">{details.showrunner}</span>
                        </div>
                      )}
                      {details?.network && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Network</span>
                          <span className="text-gray-200 font-medium">{details.network}</span>
                        </div>
                      )}
                      {(details?.seasons || details?.episodes) && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Length</span>
                          <span className="text-gray-200 font-medium">{details.seasons ? `${details.seasons} Seasons` : ""} {details.episodes ? `(${details.episodes} Episodes)` : ""}</span>
                        </div>
                      )}
                      {details?.status && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Status</span>
                          <span className="text-gray-200 font-medium">{details.status}</span>
                        </div>
                      )}
                    </>
                  )}

                  {vertical === "anime" && (
                    <>
                      {details?.studio && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Studio</span>
                          <span className="text-gray-200 font-medium">{details.studio}</span>
                        </div>
                      )}
                      {details?.source_material && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Source Material</span>
                          <span className="text-gray-200 font-medium">{details.source_material}</span>
                        </div>
                      )}
                      {details?.season_year && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Season & Year</span>
                          <span className="text-gray-200 font-medium">{details.season_year}</span>
                        </div>
                      )}
                      {details?.simulcast && (
                        <div>
                          <span className="text-meta uppercase block text-gray-500">Simulcast Platform</span>
                          <span className="text-gray-200 font-medium">{details.simulcast}</span>
                        </div>
                      )}
                    </>
                  )}

                  {vertical === "sports" && media.sports_data && (
                    <>
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Competition & Stage</span>
                        <span className="text-gray-200 font-medium">{media.sports_data.competition} • {media.sports_data.stage}</span>
                      </div>
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Venue & Time</span>
                        <span className="text-gray-200 font-medium">{media.sports_data.venue} <br/> {media.sports_data.date_time}</span>
                      </div>
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Broadcaster</span>
                        <span className="text-gray-200 font-medium">{media.sports_data.broadcaster}</span>
                      </div>
                    </>
                  )}

                  {vertical === "esports" && media.esports_data && (
                    <>
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Tournament & Stage</span>
                        <span className="text-gray-200 font-medium">{media.esports_data.tournament} • {media.esports_data.stage}</span>
                      </div>
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Format & Map Pool</span>
                        <span className="text-gray-200 font-medium">{media.esports_data.series_format} <br/> Maps: {media.esports_data.map_pool}</span>
                      </div>
                      <div>
                        <span className="text-meta uppercase block text-gray-500">Prize & Broadcast</span>
                        <span className="text-gray-200 font-medium">{media.esports_data.prize_pool} • {media.esports_data.streaming_platform}</span>
                      </div>
                    </>
                  )}

                  {/* Fallback for anything missing */}
                  {!media.sports_data && !media.esports_data && (details?.country || media.country) && (
                    <div>
                      <span className="text-meta uppercase block text-gray-500">Region</span>
                      <span className="text-gray-200 font-medium">{details?.country || media.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Status / Score Block */}
              {scoreValue && (vertical === "movies" || vertical === "series" || vertical === "anime") ? (
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    {vertical === "anime" ? "MAL Score" : "Official Score"}
                  </span>

                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="38" stroke="currentColor" strokeWidth="6" className="text-white/10" fill="transparent" />
                      <circle cx="56" cy="56" r="38" stroke="currentColor" strokeWidth="6" className="text-blue-500" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))" }} />
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
              ) : (vertical === "sports" || vertical === "esports") ? (
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Match Status</span>
                  <div className="flex items-center gap-4 w-full justify-between">
                    <div className="text-center w-1/3">
                      <p className="text-sm font-bold text-gray-200 line-clamp-2">{vertical === "sports" ? media.sports_data?.team1?.name : media.esports_data?.team1?.name}</p>
                    </div>
                    <div className="w-1/3 text-center">
                      <span className="text-3xl font-display font-black text-white">{vertical === "sports" ? media.sports_data?.score?.split(" ")[0] || "VS" : "VS"}</span>
                    </div>
                    <div className="text-center w-1/3">
                      <p className="text-sm font-bold text-gray-200 line-clamp-2">{vertical === "sports" ? media.sports_data?.team2?.name : media.esports_data?.team2?.name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                  <span className="text-meta uppercase text-gray-500">No Score Data</span>
                </div>
              )}

              {/* Column 3: Rosters / Extras */}
              {vertical === "esports" && media.esports_data ? (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden flex flex-col">
                  <span className="text-meta uppercase text-pink-400 mb-4 block">Active Rosters</span>
                  <div className="flex justify-between text-xs gap-2 h-full">
                    <div>
                      <strong className="text-white block mb-1">{media.esports_data.team1.name}</strong>
                      <ul className="text-gray-400 space-y-1">
                        {media.esports_data.team1.roster.map(r => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                    <div className="text-right">
                      <strong className="text-white block mb-1">{media.esports_data.team2.name}</strong>
                      <ul className="text-gray-400 space-y-1">
                        {media.esports_data.team2.roster.map(r => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
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
                        vertical={vertical}
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
                    Original Score & Master Themes
                  </p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            {((details?.overview || media.overview) && (details?.overview || media.overview).length > 0) && (
              <div className="space-y-3">
                <h3 className="text-section font-bold text-white tracking-tight">Synopsis</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {details?.overview || media.overview}
                </p>
              </div>
            )}

            {/* Scene Stills Photo Gallery (Only if there are actual unique stills) */}
            {sampleStills.length > 2 && (
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
                        vertical={vertical}
                        decorative
                        className="w-full h-full"
                        imgClassName="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast Portraits */}
            {cast.length > 0 && (
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
                          vertical={vertical}
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