import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { VERTICAL_QUOTES } from "../../utils/movieData";

const AestheticQuoteRoundup = ({ vertical = "movies" }) => {
  const containerRef = useRef(null);
  const quotes = VERTICAL_QUOTES[vertical] || VERTICAL_QUOTES.movies;

  const verticalTheme = {
    movies: {
      accent: "text-blue-400",
      pill: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      divider: "bg-blue-500/50",
      dot: "bg-blue-400"
    },
    series: {
      accent: "text-purple-400",
      pill: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      divider: "bg-purple-500/50",
      dot: "bg-purple-400"
    },
    anime: {
      accent: "text-orange-400",
      pill: "bg-orange-500/10 border-orange-500/20 text-orange-400",
      divider: "bg-orange-500/50",
      dot: "bg-orange-400"
    }
  }[vertical] || {
    accent: "text-blue-400",
    pill: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    divider: "bg-blue-500/50",
    dot: "bg-blue-400"
  };

  return (
    <section className="relative py-12 px-4 sm:px-8 md:px-12 select-none overflow-hidden max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col items-center justify-center text-center mb-8 space-y-2 relative z-20">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${verticalTheme.pill}`}>
          <Sparkles size={14} /> Iconic Dialogue & Cultural Resonance
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-white italic opacity-90" style={{ fontFamily: "serif" }}>
          Words that Resonate Through Cinema
        </h2>
      </div>

      {/* HORIZONTAL SNAP CAROUSEL */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar no-scrollbar"
      >
        {quotes.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className="relative flex-none w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] aspect-[4/5] rounded-[2rem] overflow-hidden snap-center group shadow-2xl bg-black"
          >
            {/* Background Parallax Image */}
            <div className="absolute inset-0">
              <img
                src={item.image}
                alt={item.movie}
                loading="lazy"
                className="w-full h-full object-cover opacity-50 transition-transform duration-[15s] ease-linear group-hover:scale-110"
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 z-10">
              <div className="text-white/30">
                <Quote size={48} strokeWidth={1} />
              </div>

              <div className="space-y-6 transform transition-transform duration-700 group-hover:-translate-y-2">
                <p
                  className="text-xl sm:text-2xl md:text-3xl text-white leading-relaxed tracking-wide drop-shadow-xl font-medium"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
                >
                  "{item.quote}"
                </p>
                <div className={`h-px w-12 ${verticalTheme.divider}`} />
                <div>
                  <p className="text-xs sm:text-sm text-gray-200 font-bold tracking-widest uppercase flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${verticalTheme.dot}`} />
                    {item.character ? `${item.character} — ` : ""}{item.movie}
                  </p>
                </div>
              </div>
            </div>

            {/* Hover Glow Border */}
            <div className="absolute inset-0 border-2 border-white/0 rounded-[2rem] transition-colors duration-500 group-hover:border-white/20 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AestheticQuoteRoundup;
