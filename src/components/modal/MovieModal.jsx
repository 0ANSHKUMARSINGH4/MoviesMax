import { useEffect, useState, useContext } from "react";
import { X, Play, Plus, Check } from "lucide-react";
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
          setCast(d.cast || []);
          setSimilar(d.similar || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [media?.id]);

  if (!media) return null;

  const inWatchlist = user ? isInWatchlist(media?.id) : false;
  const matchScore = Math.min(99, Math.max(78, Math.round((details?.vote_average || media.vote_average || 8.0) * 10 + 6)));

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

  const displayGenres = details?.genres || media.genres || [];
  const displayOverview = details?.overview || media.overview || "";
  const displayRelease = details?.release_date || media.release_date || "";
  const displayDirector = details?.director || "";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4 select-none overflow-y-auto">
      {/* BACKDROP BLUR OVERLAY */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* NETFLIX MODAL CONTAINER */}
      <div className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-lg shadow-2xl overflow-hidden z-10 my-auto max-h-[95vh] flex flex-col border border-zinc-800">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-[#181818]/80 hover:bg-white text-white hover:text-black p-2 rounded-full transition-all duration-200 border border-white/10"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* SCROLLABLE MODAL BODY */}
        <div className="overflow-y-auto no-scrollbar">
          {/* 1. 16:9 VIDEO TRAILER / BACKDROP BANNER */}
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
                <img
                  src={media.backdrop_path || media.poster_path}
                  alt={media.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/60" />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-zinc-600 border-t-[#E50914] animate-spin" />
                  </div>
                )}
              </div>
            )}

            {/* OVERLAY ACTION BAR (When trailer is stopped or backdrop is shown) */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                <button
                  onClick={handleWatchlistClick}
                  className="w-10 h-10 rounded-full border border-white/40 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-110"
                  title={inWatchlist ? "In Watchlist" : "Add to My List"}
                >
                  {inWatchlist ? <Check size={18} className="text-[#46d369]" /> : <Plus size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* 2. NETFLIX DETAILS TWO-COLUMN BODY */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LEFT 2 COLS: METADATA, TITLE, OVERVIEW */}
              <div className="md:col-span-2 space-y-4">
                {/* METADATA ROW */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-semibold flex-wrap">
                  <span className="text-[#46d369] font-bold">{matchScore}% Match</span>
                  <span>{displayRelease ? displayRelease.slice(0, 4) : "2024"}</span>
                  <span className="border border-zinc-600 px-1.5 py-0.5 rounded text-[11px] text-zinc-300">
                    16+
                  </span>
                  <span className="border border-zinc-600 px-1.5 py-0.5 rounded text-[11px] text-zinc-300">
                    4K ULTRA HD
                  </span>
                  {details?.runtime && <span>{details.runtime} min</span>}
                </div>

                {/* TITLE */}
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {media.title}
                </h2>

                {/* OVERVIEW */}
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                  {displayOverview || "No overview available for this title."}
                </p>
              </div>

              {/* RIGHT 1 COL: CAST, GENRES, CREATOR */}
              <div className="space-y-4 text-xs sm:text-sm border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
                {cast && cast.length > 0 && (
                  <div>
                    <span className="text-zinc-500 block mb-1">Cast:</span>
                    <p className="text-zinc-300 font-medium">
                      {cast.slice(0, 5).map((c) => c.name).join(", ")}
                    </p>
                  </div>
                )}

                {displayGenres && displayGenres.length > 0 && (
                  <div>
                    <span className="text-zinc-500 block mb-1">Genres:</span>
                    <p className="text-zinc-300 font-medium">
                      {displayGenres.map((g) => g.name || g).join(", ")}
                    </p>
                  </div>
                )}

                {displayDirector && (
                  <div>
                    <span className="text-zinc-500 block mb-1">Director / Creator:</span>
                    <p className="text-zinc-300 font-medium">{displayDirector}</p>
                  </div>
                )}

                <div>
                  <span className="text-zinc-500 block mb-1">This title is:</span>
                  <p className="text-zinc-300 font-medium">
                    Exciting, Mind-Bending, Visual Masterpiece
                  </p>
                </div>
              </div>
            </div>

            {/* 3. MORE LIKE THIS RECOMMENDATIONS */}
            {similar && similar.length > 0 && (
              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-white">More Like This</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {similar.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#242424] rounded overflow-hidden cursor-pointer group hover:bg-[#2e2e2e] transition-colors"
                      onClick={() => {
                        onClose();
                        setTimeout(() => navigate(`/search?q=${encodeURIComponent(item.title)}`), 100);
                      }}
                    >
                      <img
                        src={item.backdrop_path || item.poster_path}
                        alt={item.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="p-3">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-[#46d369] font-bold mt-1">
                          {Math.min(99, Math.round((item.vote_average || 7.5) * 10 + 5))}% Match
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
