// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Minus, TrendingDown } from "lucide-react";

const MOCK_LEADERBOARDS = {
  sports: [
    { rank: 1, name: "Lionel Messi", team: "Inter Miami", stat: "8 Ballon d'Ors", trend: "up", image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg" },
    { rank: 2, name: "Cristiano Ronaldo", team: "Al Nassr", stat: "850+ Goals", trend: "same", image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg" },
    { rank: 3, name: "LeBron James", team: "Lakers", stat: "40k Points", trend: "up", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/LeBron_James_2018.jpg" },
    { rank: 4, name: "Max Verstappen", team: "Red Bull", stat: "3x World Champ", trend: "up", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Max_Verstappen_2017_Malaysia_3.jpg/800px-Max_Verstappen_2017_Malaysia_3.jpg" },
    { rank: 5, name: "Novak Djokovic", team: "Tennis", stat: "24 Grand Slams", trend: "same", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Novak_Djokovic_in_2023.jpg/800px-Novak_Djokovic_in_2023.jpg" },
  ],
  esports: [
    { rank: 1, name: "Faker (Lee Sang-hyeok)", team: "T1", stat: "4x Worlds Winner", trend: "up", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Faker_2020_Interview.png/800px-Faker_2020_Interview.png" },
    { rank: 2, name: "s1mple (Oleksandr)", team: "NAVI", stat: "3x HLTV #1", trend: "down", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/S1mple_at_IEM_Katowice_2020.jpg/800px-S1mple_at_IEM_Katowice_2020.jpg" },
    { rank: 3, name: "TenZ (Tyson Ngo)", team: "Sentinels", stat: "Masters Winner", trend: "up", image: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Sentinels_logo.svg/800px-Sentinels_logo.svg.png" },
    { rank: 4, name: "ImperialHal", team: "Falcons", stat: "ALGS Champion", trend: "same", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TSM_Logo.svg/800px-TSM_Logo.svg.png" },
    { rank: 5, name: "Scump (Seth Abner)", team: "OpTic", stat: "X-Games Gold", trend: "same", image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/OpTic_Gaming_logo.svg/800px-OpTic_Gaming_logo.svg.png" },
  ]
};

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-500" />;
};

const Leaderboard = ({ vertical = "sports", title = "All-Time Greats", accentColor = "emerald" }) => {
  const data = MOCK_LEADERBOARDS[vertical] || MOCK_LEADERBOARDS.sports;
  
  const colorVariants = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  };
  
  const headerVariant = colorVariants[accentColor] || colorVariants.emerald;

  return (
    <section className="py-6 px-4 sm:px-8 md:px-12 select-none w-full max-w-4xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg border ${headerVariant}`}>
          <Trophy size={20} />
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white font-display uppercase">
          {title}
        </h2>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.rank}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl bg-[#0f1118] border border-white/5 hover:border-white/20 hover:bg-[#151822] transition-colors group cursor-default`}
          >
            {/* Rank & Info */}
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                item.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]" :
                item.rank === 2 ? "bg-gray-400/20 text-gray-400 border border-gray-400/30" :
                item.rank === 3 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" :
                "bg-white/5 text-gray-500"
              }`}>
                {item.rank}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-black/50 hidden sm:block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold">
                    {item.team}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats & Trend */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-white font-black text-xs sm:text-sm">
                  {item.stat}
                </span>
              </div>
              <div className="w-6 flex justify-center">
                <TrendIcon trend={item.trend} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Leaderboard;
