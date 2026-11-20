import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Film,
  Tv,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bookmark,
  Disc3,
  Play,
  Flame,
  Star,
} from "lucide-react";
import PlaylistRecordDeck from "../components/media/PlaylistRecordDeck";
import MovieModal from "../components/modal/MovieModal";
import ErrorBoundary from "../components/common/ErrorBoundary";

const SECTION_PORTALS = [
  {
    id: "movies-portal",
    title: "Movies",
    badge: "10,000+ Blockbusters",
    kicker: "Cinema & Oscars",
    desc: "From Christopher Nolan mind-benders to high-octane action, timeless classics, and Cannes winners.",
    path: "/movies",
    icon: Film,
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    borderColor: "group-hover:border-blue-500/60",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
  },
  {
    id: "webseries-portal",
    title: "Webseries",
    badge: "Prestige Television",
    kicker: "HBO, Netflix & Originals",
    desc: "Immerse in gripping multi-season phenomena, Emmy champions, psychological thrillers, and crime sagas.",
    path: "/webseries",
    icon: Tv,
    gradient: "from-indigo-600/20 via-blue-500/10 to-transparent",
    borderColor: "group-hover:border-indigo-500/60",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]",
  },
  {
    id: "anime-portal",
    title: "Anime",
    badge: "Japanese Simulcasts",
    kicker: "Shonen & Dark Fantasy",
    desc: "Experience dark fantasy epics, supernatural battles, slice-of-life charm, and Studio Ghibli artistry.",
    path: "/anime",
    icon: Sparkles,
    gradient: "from-cyan-600/20 via-blue-500/10 to-transparent",
    borderColor: "group-hover:border-cyan-500/60",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
  },
];

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col justify-between overflow-x-hidden pt-16 sm:pt-20">
      {/* 1. ATMOSPHERIC AMBIENT GLOWS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/10 via-blue-500/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 2. THE MAIN SHOWSTOPPER: 3D VINYL PLAYLIST RECORD CAROUSEL */}
      <main className="relative z-10 flex-1">
        <PlaylistRecordDeck onPlay={setSelectedMovie} />

        {/* 3. SECTION GATEWAY PORTALS (Direct entry to the sections removed from the homepage navbar) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span>Explore The Entire Universe</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Enter Dedicated <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Portals</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
              Dive into full discovery grids, curated bento spotlights, and complete top 10 rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {SECTION_PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.id}
                  to={portal.path}
                  className={`group relative p-6 sm:p-8 rounded-3xl bg-[#0e1628]/80 backdrop-blur-xl border border-white/10 ${portal.borderColor} ${portal.glowColor} transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
                >
                  {/* Subtle Card Ambient Glow */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="relative z-10 space-y-4">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/60 border border-white/10 text-gray-300">
                        {portal.badge}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        {portal.kicker}
                      </p>
                      <h4 className="text-2xl font-black text-white tracking-tight mt-1 group-hover:text-blue-300 transition-colors">
                        {portal.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
                      {portal.desc}
                    </p>
                  </div>

                  {/* Bottom Action Pill */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                    <span>Enter {portal.title} Catalog</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 4. LANDING PAGE VALUE PILLARS */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/10 text-center sm:text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">0ms Instant Playback</h5>
                <p className="text-xs text-gray-400 mt-0.5">Ultra-fast TMDB trailer streaming with zero buffering</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Curated Editorial</h5>
                <p className="text-xs text-gray-400 mt-0.5">Hand-picked collections & verified sentiment scoring</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Bookmark size={20} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Cloud Watchlist Sync</h5>
                <p className="text-xs text-gray-400 mt-0.5">Sync favorites instantly across all your devices</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. MINIMAL CLEAN LANDING FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-8 bg-[#080d1a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Film size={14} />
            </div>
            <span className="font-bold text-white tracking-tight">MOVIES<span className="text-blue-500">MAX</span></span>
            <span className="text-gray-500">• The Next-Gen Streaming Experience</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link to="/webseries" className="hover:text-white transition-colors">Webseries</Link>
            <Link to="/anime" className="hover:text-white transition-colors">Anime</Link>
            <Link to="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
          </div>
        </div>
      </footer>

      {/* 6. POLISHED CINEMA THEATRE MODAL */}
      {selectedMovie && (
        <ErrorBoundary onReset={() => setSelectedMovie(null)}>
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Home;
