import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import NewsCarousel from "../components/media/NewsCarousel";
import Leaderboard from "../components/media/Leaderboard";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import MovieModal from "../components/modal/MovieModal";
import { Trophy, Play, Activity, Calendar, Shield } from "lucide-react";

const LIVE_MATCHES = [
  {
    id: "match-1",
    tournament: "UEFA Champions League",
    teamA: "Real Madrid",
    teamB: "Manchester City",
    score: "2 - 2",
    time: "78'",
    status: "LIVE",
    odds: "Draw 3.10",
    image: "https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=600"
  },
  {
    id: "match-2",
    tournament: "NBA Finals",
    teamA: "Boston Celtics",
    teamB: "L.A. Lakers",
    score: "108 - 104",
    time: "Q4 2:15",
    status: "LIVE",
    odds: "BOS -3.5",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Stephen_Curry_Shooting.jpg"
  },
  {
    id: "match-3",
    tournament: "Formula 1 2026",
    teamA: "Max Verstappen",
    teamB: "Lewis Hamilton",
    score: "Lap 48/52",
    time: "Interval 1.2s",
    status: "LIVE",
    odds: "Red Bull",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/33/F1_2019_Silverstone_Grand_Prix_%2848288301772%29.jpg"
  }
];

const Sports = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="pb-24 relative min-h-screen bg-v-sports-base text-gray-200">
      {/* 1. SPORTS BROADCAST LIVE HERO */}
      <div className="relative h-[75vh] md:h-[82vh] w-full bg-black overflow-hidden select-none">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=1925&auto=format&fit=crop"
            alt="Champions League"
            className="w-full h-full object-cover opacity-60 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-v-sports-base via-v-sports-base/65 to-transparent" />
          <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end container-mx pb-20 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-red-600/90 text-white text-xs font-black uppercase tracking-widest w-max shadow-[0_0_20px_rgba(220,38,38,0.5)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Worldwide Broadcast
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-tight uppercase drop-shadow-2xl text-white">
            Champions League <br /> Final 2026
          </h1>

          <p className="mt-4 text-emerald-100/90 text-sm sm:text-base md:text-lg font-medium drop-shadow-md leading-relaxed">
            Watch the most anticipated match of the year live in Ultra HD 4K with spatial stadium audio. Real Madrid battles Manchester City for European supremacy.
          </p>

          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <button
              onClick={() => setSelectedMovie({
                title: "UEFA Champions League Final 2026",
                backdrop_path: "https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=1925",
                overview: "Live 4K Ultra HD coverage with real-time match analytics and multi-cam tactical views."
              })}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-xl shadow-emerald-500/30 active:scale-95"
            >
              <Play size={18} fill="black" /> Watch Live Feed
            </button>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-4 py-2 rounded-xl">
              <Activity size={14} /> 82,400 In Attendance • Santiago Bernabéu
            </span>
          </div>
        </div>
      </div>

      {/* 2. LIVE MATCH SCORECARD TICKER (Pinterest/Figma UI) */}
      <section className="-mt-10 relative z-20 container-mx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LIVE_MATCHES.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMovie({ title: `${match.teamA} vs ${match.teamB}`, backdrop_path: match.image, overview: `${match.tournament} live match coverage` })}
              className="p-sp-2 rounded-2xl bg-v-sports-surface/90 border border-v-sports-border hover:border-v-sports-accent/50 backdrop-blur-xl shadow-card transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-meta font-black uppercase tracking-wider text-v-sports-accent flex items-center gap-1">
                  <Shield size={12} /> {match.tournament}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-meta font-black bg-red-600/20 text-red-400 border border-red-500/30 animate-pulse">
                  {match.status} {match.time}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">{match.teamA}</p>
                  <p className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">{match.teamB}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-white font-display tracking-wider">{match.score}</span>
                  <p className="text-meta text-gray-400 font-semibold">{match.odds}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PINTEREST & FIGMA BENTO DISCOVERY GRID */}
      <div className="relative z-20 mt-8">
        <BentoDiscoveryGrid vertical="sports" onMovieClick={setSelectedMovie} />
      </div>

      {/* 4. LATEST SPORTS NEWS */}
      <div className="relative z-20 py-sp-5 bg-gradient-to-b from-v-sports-base to-v-sports-surface">
        <NewsCarousel vertical="sports" accentColor="emerald" />
      </div>

      {/* 5. LEADERBOARDS & STATS */}
      <div className="relative z-20 bg-gradient-to-b from-v-sports-surface to-v-sports-base py-sp-5 flex flex-col md:flex-row items-start justify-center gap-sp-4 container-mx">
        <Leaderboard vertical="sports" title="Top Athletes of All Time" accentColor="emerald" />

        {/* Trending Sports Panel */}
        <section className="w-full max-w-sm py-6">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white font-display uppercase mb-6 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy size={18} />
            </span>
            Trending Sports
          </h2>
          <div className="space-y-3">
            {[
              { name: "Football (Soccer)", events: "3,200 Live Events", rank: 1 },
              { name: "Basketball (NBA)", events: "1,450 Live Events", rank: 2 },
              { name: "Formula 1", events: "Monaco GP Preview", rank: 3 },
              { name: "Tennis (Grand Slams)", events: "Roland Garros Finals", rank: 4 },
              { name: "Combat Sports (UFC)", events: "UFC 312 Title Fight", rank: 5 },
            ].map((sport) => (
              <div key={sport.rank} className="p-sp-2 rounded-2xl bg-v-sports-surface border border-white/5 hover:border-v-sports-accent/30 transition-all flex items-center justify-between cursor-pointer group hover:bg-v-sports-surface">
                <div>
                  <span className="font-bold text-gray-200 group-hover:text-white transition-colors block text-sm">{sport.name}</span>
                  <span className="text-meta text-gray-400 flex items-center gap-1 mt-0.5"><Calendar size={11} /> {sport.events}</span>
                </div>
                <span className="text-emerald-500 font-black text-lg">#{sport.rank}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. MODAL */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Sports;
