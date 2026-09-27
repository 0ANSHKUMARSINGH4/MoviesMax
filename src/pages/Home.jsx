import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv, Sparkles, Trophy, Gamepad2, ArrowRight } from "lucide-react";
import SmartImage from "../components/media/SmartImage";

const VERTICALS = [
  {
    id: "movies",
    title: "Movies",
    subtitle: "Cinematic Blockbusters & Classics",
    path: "/movies",
    icon: Film,
    color: "from-blue-600/80",
    shadow: "hover:shadow-blue-600/50",
    bgImage: "https://image.tmdb.org/t/p/original/xJHokMbljvjEVAql3l5I6ZfYS9.jpg",
  },
  {
    id: "webseries",
    title: "Series",
    subtitle: "Binge-Worthy TV & K-Dramas",
    path: "/webseries",
    icon: Tv,
    color: "from-purple-600/80",
    shadow: "hover:shadow-purple-600/50",
    bgImage: "https://image.tmdb.org/t/p/original/56v2KjBlU4aAB14sIGTe1T156wD.jpg",
  },
  {
    id: "anime",
    title: "Anime",
    subtitle: "Simulcasts & Manga Adaptations",
    path: "/anime",
    icon: Sparkles,
    color: "from-orange-600/80",
    shadow: "hover:shadow-orange-600/50",
    bgImage: "https://image.tmdb.org/t/p/original/kC6yO9dC1E7zO3Zt3gC9iH7pZ9w.jpg",
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "Live Action & Leaderboards",
    path: "/sports",
    icon: Trophy,
    color: "from-emerald-600/80",
    shadow: "hover:shadow-emerald-600/50",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/3/33/F1_2019_Silverstone_Grand_Prix_%2848288301772%29.jpg",
  },
  {
    id: "esports",
    title: "Esports",
    subtitle: "Competitive Gaming & Tournaments",
    path: "/esports",
    icon: Gamepad2,
    color: "from-pink-600/80",
    shadow: "hover:shadow-pink-600/50",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/4/4e/League_of_Legends_World_Championship_2015_-_Finals.jpg",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeVertical, setActiveVertical] = useState(VERTICALS[0]);

  return (
    <div className="relative pt-28 pb-12 bg-dark-main text-gray-200 overflow-hidden flex flex-col justify-center">
      {/* DYNAMIC AMBIENT BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVertical.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <SmartImage
            src={activeVertical.bgImage}
            alt=""
            title={activeVertical.title}
            vertical={activeVertical.id}
            className="absolute inset-0 w-full h-full"
            imgClassName="object-cover"
            decorative
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${activeVertical.color} to-transparent mix-blend-multiply opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-main via-dark-main/60 to-dark-main opacity-90" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container-mx flex flex-col items-center">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl mb-4">
            <span className="font-display font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              MoviesMax Hub
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white drop-shadow-2xl">
            Choose Your <br className="md:hidden" /> Universe
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Dive into specialized, immersive worlds tailored perfectly for movies, series, anime, sports, and competitive esports.
          </p>
        </motion.div>

        {/* 5-WAY MULTI-VERTICAL SELECTION (Immersive Split Cards) */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 w-full h-[60vh] md:h-[500px]">
          {VERTICALS.map((vertical, index) => {
            const Icon = vertical.icon;
            const isActive = activeVertical.id === vertical.id;
            
            return (
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }}
                onMouseEnter={() => setActiveVertical(vertical)}
                onClick={() => navigate(vertical.path)}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer border border-white/10 transition-all duration-500 ease-out flex-1 hover:flex-[1.5] lg:hover:flex-[2] ${vertical.shadow}`}
              >
                {/* Background Image (Parallax) */}
                <div className="absolute inset-0">
                  <SmartImage
                    src={vertical.bgImage}
                    alt=""
                    title={vertical.title}
                    vertical={vertical.id}
                    className="absolute inset-0 w-full h-full"
                    imgClassName="object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-80"
                    decorative
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${vertical.color} to-transparent mix-blend-overlay opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110 shadow-xl ${isActive ? 'bg-white/20' : ''}`}>
                    <Icon size={24} className="text-white drop-shadow-md" />
                  </div>
                  
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h2 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight drop-shadow-lg flex items-center gap-3">
                      {vertical.title}
                      <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </h2>
                    
                    {/* Subtitle hidden on mobile, revealed on hover on desktop */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                      <p className="overflow-hidden text-sm text-gray-300 font-semibold mt-1">
                        {vertical.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Active Indicator Strip */}
                <div className={`absolute bottom-0 inset-x-0 h-1.5 transition-all duration-500 bg-white shadow-[0_0_15px_#fff] ${isActive ? 'opacity-100' : 'opacity-0 translate-y-2'}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;