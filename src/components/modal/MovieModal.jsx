import { useEffect, useState, useContext } from "react";
import { X, Play, Plus, ThumbsUp, Check, Search, ExternalLink } from "lucide-react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalState";

const MovieModal = ({ movie, onClose }) => {
  const { API_KEY, BASE_URL, watchlist, toggleWatchlist, favorites, toggleFavorite } = useContext(GlobalContext);
  const [videoKey, setVideoKey] = useState(null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const inWatchlist = watchlist.find((item) => item.id === movie.id);
  const isLiked = favorites.find((item) => item.id === movie.id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setVideoKey(null);
      setCast([]);

      try {
        if (movie.isJikan) {
            // --- ANIME (JIKAN) ---
            const animeRes = await axios.get(`https://api.jikan.moe/v4/anime/${movie.id}`);
            const data = animeRes.data.data;

            if (data.trailer?.youtube_id) {
                setVideoKey(data.trailer.youtube_id);
            }

            const charRes = await axios.get(`https://api.jikan.moe/v4/anime/${movie.id}/characters`);
            const topCast = charRes.data.data.slice(0, 5).map(char => ({
                id: char.character.mal_id,
                name: char.character.name,
                character: char.role,
                profile_path: char.character.images.jpg.image_url
            }));

            setDetails({
                runtime: data.duration,
                genres: data.genres,
                overview: data.synopsis,
                release_date: data.year ? String(data.year) : "N/A"
            });
            setCast(topCast);

        } else {
            // --- MOVIE (TMDB) ---
            const videoRes = await axios.get(
              `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
            );
            const videos = videoRes.data.results;

            // Search Priority: Trailer -> Teaser -> Clip -> Any YouTube Video
            const official = videos.find(v => v.site === "YouTube" && v.type === "Trailer");
            const teaser = videos.find(v => v.site === "YouTube" && v.type === "Teaser");
            const anyVideo = videos.find(v => v.site === "YouTube");

            if (official) setVideoKey(official.key);
            else if (teaser) setVideoKey(teaser.key);
            else if (anyVideo) setVideoKey(anyVideo.key);

            const detailRes = await axios.get(
                `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits`
            );

            setDetails({
                runtime: `${detailRes.data.runtime} min`,
                genres: detailRes.data.genres,
                overview: detailRes.data.overview,
                release_date: detailRes.data.release_date
            });

            if (detailRes.data.credits?.cast) {
                setCast(detailRes.data.credits.cast.slice(0, 5).map(actor => ({
                    id: actor.id,
                    name: actor.name,
                    character: actor.character,
                    profile_path: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : null
                })));
            }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movie) fetchData();
  }, [movie, API_KEY, BASE_URL]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl bg-[#181818] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

        {/* Close Button - Blue Hover */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-blue-600 p-2 rounded-full text-white transition-colors">
          <X size={20} />
        </button>

        <div className="overflow-y-auto custom-scrollbar">
            {/* --- VIDEO PLAYER SECTION --- */}
            <div className="relative aspect-video w-full bg-black group">
              {videoKey ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                // --- FALLBACK IF NO VIDEO FOUND ---
                <div className="w-full h-full relative">
                    <img
                        src={movie.isJikan ? movie.poster_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                        className="w-full h-full object-cover opacity-50"
                        alt={movie.title}
                    />

                    {/* Centered "Search on YouTube" Button - Red/Blue Style */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <div className="bg-black/60 p-6 rounded-xl backdrop-blur-md border border-white/10">
                            <p className="text-gray-300 font-semibold mb-4 text-lg">
                                {loading ? "Searching for trailer..." : "Trailer not found in database."}
                            </p>
                            {!loading && (
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105"
                                >
                                    <Search size={20} /> Search on YouTube <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
              )}
            </div>

            {/* --- CONTENT DETAILS --- */}
            <div className="p-8 space-y-6 bg-[#181818]">
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="space-y-3 flex-1">
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    {movie.title}
                  </h2>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="text-green-400 font-bold">
                        {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : "N/A"}
                    </span>
                    <span>{details?.release_date?.split("-")[0] || "2024"}</span>
                    <span className="border border-gray-600 px-1 rounded text-xs">HD</span>
                    {details && <span>{details.runtime}</span>}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                      {details?.genres?.map(g => (
                          <span key={g.mal_id || g.id} className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded-full">
                            {g.name}
                          </span>
                      ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="bg-white text-black px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    <Play fill="black" size={20} /> Play
                  </button>

                  <button
                    onClick={() => toggleWatchlist(movie)}
                    className={`border-2 p-3 rounded-full transition-colors ${inWatchlist ? 'bg-gray-600 border-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'}`}
                  >
                    {inWatchlist ? <Check size={24} /> : <Plus size={24} />}
                  </button>

                  {/* LIKE BUTTON - Blue */}
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`border-2 p-3 rounded-full transition-colors ${isLiked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'}`}
                  >
                    <ThumbsUp size={24} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-12 mt-6">
                  <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-white">Synopsis</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {details?.overview || movie.overview || "No description available."}
                      </p>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-sm text-gray-500 font-semibold uppercase">Starring</h3>
                      {loading ? (
                          <p className="text-gray-500 text-sm">Loading cast...</p>
                      ) : (
                          <div className="space-y-3">
                            {cast.map((actor, idx) => (
                                <div key={actor.id || idx} className="flex items-center gap-3">
                                    <img
                                        src={actor.profile_path || "https://via.placeholder.com/50"}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt={actor.name}
                                    />
                                    <div>
                                        <p className="text-sm text-white font-medium">{actor.name}</p>
                                        <p className="text-xs text-gray-500">{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                            {cast.length === 0 && <p className="text-gray-500 text-sm">No cast info available.</p>}
                          </div>
                      )}
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;