import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Newspaper, ChevronRight, Clock, ArrowRight } from "lucide-react";
import SmartImage from "./SmartImage";
import Section from "../layout/Section";

const MOCK_NEWS = {
  movies: [
    { id: 1, title: "Christopher Nolan's Next Sci-Fi Epic Casts Tom Holland", time: "2 hours ago", image: "https://image.tmdb.org/t/p/w780/xJHokMbljvjEVAql3l5I6ZfYS9.jpg", category: "Casting" },
    { id: 2, title: "Dune: Messiah Official Production Start Date Revealed", time: "5 hours ago", image: "https://image.tmdb.org/t/p/w780/8rpDcsfLJypbO6vtecsmEZgn9c2.jpg", category: "Production" },
    { id: 3, title: "Spider-Man 4 Director Confirmed by Marvel Studios", time: "1 day ago", image: "https://image.tmdb.org/t/p/w780/nGxUmL3JrsyZW2xoSn7uR94LqMB.jpg", category: "MCU" },
  ],
  webseries: [
    { id: 1, title: "Squid Game Season 2 Official Trailer Breaks Records", time: "1 hour ago", image: "https://image.tmdb.org/t/p/w780/2meX1nMdScFOoV4370rqHWKmXhY.jpg", category: "Trailer" },
    { id: 2, title: "Stranger Things 5: Duffer Brothers Tease Emotional Finale", time: "4 hours ago", image: "https://image.tmdb.org/t/p/w780/56v2KjBlU4aAB14sIGTe1T156wD.jpg", category: "Interview" },
    { id: 3, title: "HBO's The Last of Us Season 2 Wraps Filming", time: "2 days ago", image: "https://image.tmdb.org/t/p/w780/bKxiUpEQKdEBb9nED9kEIfsEqf9.jpg", category: "Production" },
  ],
  anime: [
    { id: 1, title: "Solo Leveling Season 2 Release Window Confirmed", time: "30 mins ago", image: "https://image.tmdb.org/t/p/w780/geYUqF3vO2hZ5Gj6M09F1Y7qQn0.jpg", category: "Release" },
    { id: 2, title: "Jujutsu Kaisen Creator Comments on Series Finale", time: "3 hours ago", image: "https://image.tmdb.org/t/p/w780/z0iCS5Znx7TeRwlYSd4c01Z0lFx.jpg", category: "Manga" },
    { id: 3, title: "Demon Slayer Infinity Castle Movie Trilogy Announced", time: "12 hours ago", image: "https://image.tmdb.org/t/p/w780/kC6yO9dC1E7zO3Zt3gC9iH7pZ9w.jpg", category: "Announcements" },
  ],
  sports: [
    { id: 1, title: "Champions League Final Sets New Viewership Records", time: "1 hour ago", image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Champions_League_Final_2018.jpg", category: "Football" },
    { id: 2, title: "NBA Playoffs: Historic 50-Point Game Stuns Fans", time: "3 hours ago", image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Stephen_Curry_Shooting.jpg", category: "Basketball" },
    { id: 3, title: "Formula 1 2026 Engine Regulations Detailed", time: "1 day ago", image: "https://upload.wikimedia.org/wikipedia/commons/3/33/F1_2019_Silverstone_Grand_Prix_%2848288301772%29.jpg", category: "Motorsport" },
  ],
  esports: [
    { id: 1, title: "League of Legends Worlds Finals Sells Out in Seconds", time: "45 mins ago", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/League_of_Legends_World_Championship_2015_-_Finals.jpg", category: "LoL" },
    { id: 2, title: "Valorant Champions Tour: New Agent Teased", time: "2 hours ago", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Valorant_logo_-_pink_color_version.svg/1024px-Valorant_logo_-_pink_color_version.svg.png", category: "Valorant" },
    { id: 3, title: "CS2 Major: Underdog Team Reaches Grand Finals", time: "5 hours ago", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/ESL_One_Cologne_2015_-_Final.jpg", category: "CS2" },
  ],
};

const NewsCarousel = ({ vertical = "movies", accentColor = "blue" }) => {
  const containerRef = useRef(null);
  const news = MOCK_NEWS[vertical] || MOCK_NEWS.movies;

  const colorVariants = {
    blue: "bg-blue-600 text-blue-400 group-hover:border-blue-500",
    purple: "bg-purple-600 text-purple-400 group-hover:border-purple-500",
    orange: "bg-orange-600 text-orange-400 group-hover:border-orange-500",
    emerald: "bg-emerald-600 text-emerald-400 group-hover:border-emerald-500",
    pink: "bg-pink-600 text-pink-400 group-hover:border-pink-500",
  };

  const accentClass = colorVariants[accentColor] || colorVariants.blue;
  // Extract just the background color part for the badge
  const badgeBg = accentClass.split(" ")[0];

  return (
    <Section as="section" className="py-sp-5 select-none">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-sp-3">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-6 rounded-full ${badgeBg} shadow-lg`} />
          <h2 className="text-section font-display uppercase flex items-center gap-sp-1">
            <Newspaper size={20} /> Latest Updates
          </h2>
        </div>
        <button className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
          View All <ChevronRight size={14} />
        </button>
      </div>

      {/* HORIZONTAL CAROUSEL */}
      <div 
        ref={containerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x custom-scrollbar no-scrollbar scroll-smooth"
      >
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ y: -5 }}
            className={`group relative flex-none w-[85vw] sm:w-80 md:w-96 rounded-2xl overflow-hidden bg-[#0f1118] border border-white/10 cursor-pointer transition-all duration-300 hover:shadow-2xl ${accentClass.split(' ')[2]}`}
          >
            {/* Image */}
            <div className="w-full h-48 sm:h-56 overflow-hidden relative">
              <SmartImage
                src={item.image}
                alt=""
                title={item.title}
                vertical={vertical}
                decorative
                className="absolute inset-0 w-full h-full"
                imgClassName={`object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1118] via-transparent to-transparent" />
              
              {/* Category Badge */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md ${badgeBg} text-white text-[10px] font-black uppercase tracking-wider shadow-md`}>
                {item.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2 mb-3 group-hover:text-gray-200 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {item.time}
                </span>
                <span className="flex items-center gap-1 text-gray-400 group-hover:text-white transition-colors">
                  Read Article <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default NewsCarousel;
