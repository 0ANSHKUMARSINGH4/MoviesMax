import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import NewsCarousel from "../components/media/NewsCarousel";
import Leaderboard from "../components/media/Leaderboard";
import BentoDiscoveryGrid from "../components/media/BentoDiscoveryGrid";
import MovieModal from "../components/modal/MovieModal";
import { Gamepad2, Play, Radio, Users } from "lucide-react";

const LIVE_TOURNAMENTS = [
  {
    id: "tourney-1",
    game: "League of Legends",
    event: "Worlds Grand Finals",
    match: "T1 vs Gen.G",
    score: "2 - 1",
    viewers: "1.4M Watching",
    status: "LIVE",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/League_of_Legends_World_Championship_2015_-_Finals.jpg",
    overview: "The most anticipated match in League of Legends history. Two Korean titans clash on the international stage for the ultimate prize. Will the reigning champions defend their title or will a new dynasty begin?",
    vertical: "esports",
    esports_data: {
      tournament: "League of Legends Worlds 2026",
      stage: "Grand Finals",
      team1: { name: "T1", roster: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"] },
      team2: { name: "Gen.G", roster: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"] },
      series_format: "Best of 5",
      map_pool: "Summoner's Rift",
      prize_pool: "$2,250,000",
      streaming_platform: "Twitch / YouTube 4K"
    }
  },
  {
    id: "tourney-2",
    game: "Valorant",
    event: "VCT Champions Seoul",
    match: "Sentinels vs Fnatic",
    score: "Map 3: 11 - 9",
    viewers: "890K Watching",
    status: "LIVE",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Valorant_logo_-_pink_color_version.svg/1024px-Valorant_logo_-_pink_color_version.svg.png",
    overview: "The VCT Champions Seoul reaches its climax. Sentinels and Fnatic push each other to the absolute limit on Map 3. Every single round could determine who lifts the trophy.",
    vertical: "esports",
    esports_data: {
      tournament: "VCT Champions Seoul 2026",
      stage: "Semi-Finals",
      team1: { name: "Sentinels", roster: ["zekken", "Sacy", "TenZ", "johnqt", "Zellsis"] },
      team2: { name: "Fnatic", roster: ["Boaster", "Derke", "Alfajer", "Leo", "Chronicle"] },
      series_format: "Best of 3",
      map_pool: "Ascent, Lotus, Split",
      prize_pool: "$1,000,000",
      streaming_platform: "Twitch / YouTube"
    }
  },
  {
    id: "tourney-3",
    game: "Counter-Strike 2",
    event: "IEM Major Grand Final",
    match: "NAVI vs FaZe Clan",
    score: "14 - 12",
    viewers: "650K Watching",
    status: "LIVE",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/ESL_One_Cologne_2015_-_Final.jpg",
    overview: "A fierce battle in the IEM Major Grand Final between NAVI and FaZe Clan. The tactical depth of Counter-Strike 2 is on full display. The crowd roars as the match heads into double overtime.",
    vertical: "esports",
    esports_data: {
      tournament: "IEM Major 2026",
      stage: "Grand Final",
      team1: { name: "NAVI", roster: ["Aleksib", "iM", "b1t", "jL", "w0nderful"] },
      team2: { name: "FaZe Clan", roster: ["karrigan", "rain", "broky", "ropz", "frozen"] },
      series_format: "Best of 5",
      map_pool: "Mirage, Nuke, Inferno, Ancient, Anubis",
      prize_pool: "$1,250,000",
      streaming_platform: "Twitch / ESL TV"
    }
  }
];

const Esports = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="pb-24 relative min-h-screen bg-v-esports-base text-gray-200">
      {/* 1. ESPORTS CYBERPUNK HERO */}
      <div className="relative h-[75vh] md:h-[82vh] w-full bg-black overflow-hidden select-none">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1925&auto=format&fit=crop"
            alt="Esports Arena"
            className="w-full h-full object-cover opacity-50 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-v-esports-base via-v-esports-base/70 to-transparent" />
          <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-pink-600/30 to-purple-600/30" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end container-mx pb-20 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded-full bg-pink-600/20 border border-pink-500/50 text-pink-400 text-xs font-black uppercase tracking-widest w-max backdrop-blur-md shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" /> Live World Championship
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-tight uppercase drop-shadow-2xl text-white">
            League of Legends <br /> Worlds 2026
          </h1>

          <p className="mt-4 text-pink-100/90 max-w-2xl text-sm sm:text-base md:text-lg font-medium drop-shadow-md leading-relaxed">
            The ultimate battle for the Summoner's Cup. Witness Faker and T1 defend their dynasty against the rising challengers in a sold-out stadium.
          </p>

          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <button
              onClick={() => setSelectedMovie({
                title: "League of Legends Worlds Grand Finals 2026",
                backdrop_path: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1925",
                overview: "Official Riot Games 4K broadcast stream with real-time kill gold graphs and pro commentary. Witness Faker and T1 defend their dynasty against the rising challengers in a sold-out stadium. The ultimate battle for the Summoner's Cup.",
                vertical: "esports",
                esports_data: {
                  tournament: "League of Legends Worlds 2026",
                  stage: "Grand Finals",
                  team1: { name: "T1", roster: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"] },
                  team2: { name: "Gen.G", roster: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"] },
                  series_format: "Best of 5",
                  map_pool: "Summoner's Rift",
                  prize_pool: "$2,250,000",
                  streaming_platform: "Twitch / YouTube 4K"
                }
              })}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-105 shadow-xl shadow-pink-600/30 active:scale-95"
            >
              <Play size={18} fill="white" /> Watch Tournament Stream
            </button>
            <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5 bg-pink-950/60 border border-pink-500/30 px-4 py-2 rounded-xl">
              <Radio size={14} /> 2.1M Peak Concurrent Viewers
            </span>
          </div>
        </div>

        {/* Cyberpunk Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
      </div>

      {/* 2. LIVE MATCH STATUS TICKER */}
      <section className="-mt-10 relative z-20 container-mx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LIVE_TOURNAMENTS.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedMovie({ title: `${t.game} - ${t.match}`, backdrop_path: t.image, overview: t.overview, vertical: t.vertical, esports_data: t.esports_data })}
              className="p-sp-2 rounded-2xl bg-v-esports-surface/90 border border-v-esports-border hover:border-v-esports-accent/50 backdrop-blur-xl shadow-card transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-meta font-black uppercase tracking-wider text-v-esports-accent flex items-center gap-1">
                  <Gamepad2 size={12} /> {t.game}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-meta font-black bg-pink-600/20 text-pink-400 border border-pink-500/30 animate-pulse">
                  {t.status}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="font-bold text-white text-sm group-hover:text-pink-300 transition-colors">{t.match}</p>
                  <p className="text-meta text-gray-400 mt-0.5">{t.event}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white font-display tracking-wider">{t.score}</span>
                  <p className="text-meta text-pink-400 font-semibold">{t.viewers}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PINTEREST & FIGMA BENTO DISCOVERY GRID */}
      <div className="relative z-20 mt-8">
        <BentoDiscoveryGrid vertical="esports" onMovieClick={setSelectedMovie} />
      </div>

      {/* 4. LATEST ESPORTS NEWS */}
      <div className="relative z-20 py-sp-5 bg-gradient-to-b from-v-esports-base to-v-esports-surface">
        <NewsCarousel vertical="esports" accentColor="pink" />
      </div>

      {/* 5. LEADERBOARDS & TOP GAMES */}
      <div className="relative z-20 bg-gradient-to-b from-v-esports-surface to-v-esports-base py-sp-5 flex flex-col md:flex-row items-start justify-center gap-sp-4 container-mx">
        <Leaderboard vertical="esports" title="Top Pro Players of All Time" accentColor="pink" />

        {/* Top Games Panel */}
        <section className="w-full max-w-sm py-6">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white font-display uppercase mb-6 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Gamepad2 size={18} />
            </span>
            Trending Esports Titles
          </h2>
          <div className="space-y-3">
            {[
              { name: "League of Legends", viewers: "1.4M Peak Viewers", rank: 1 },
              { name: "Valorant", viewers: "890K Live Viewers", rank: 2 },
              { name: "Counter-Strike 2", viewers: "650K Live Viewers", rank: 3 },
              { name: "Dota 2", viewers: "420K Live Viewers", rank: 4 },
              { name: "Street Fighter 6", viewers: "280K Live Viewers", rank: 5 },
            ].map((game) => (
              <div key={game.rank} className="p-sp-2 rounded-2xl bg-v-esports-surface border border-white/5 hover:border-v-esports-accent/30 transition-all flex items-center justify-between cursor-pointer group hover:bg-v-esports-surface">
                <div>
                  <span className="font-bold text-gray-200 group-hover:text-white transition-colors block text-sm">{game.name}</span>
                  <span className="text-meta text-gray-400 flex items-center gap-1 mt-0.5"><Users size={11} /> {game.viewers}</span>
                </div>
                <span className="text-pink-500 font-black text-lg">#{game.rank}</span>
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

export default Esports;
