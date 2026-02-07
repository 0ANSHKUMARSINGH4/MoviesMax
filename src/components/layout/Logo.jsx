import { Link } from "react-router-dom";
import { Film, Clapperboard } from "lucide-react";

const Logo = ({ isHomeTop }) => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
      {/* Creative Icon Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-brand blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-400 p-1.5 rounded-xl border border-blue-400/30 shadow-lg transform -rotate-6 group-hover:rotate-0 transition-all duration-300 ease-out">
           <Film className="text-white w-5 h-5" strokeWidth={2.5} />
        </div>
        <Clapperboard className="absolute -bottom-1 -right-1 w-3 h-3 text-blue-300 group-hover:text-white transition-colors" />
      </div>

      {/* Text */}
      <div className="text-2xl font-black tracking-tighter flex gap-0.5 items-baseline">
        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
          Movies
        </span>
        {/* LOGIC FIX: If at Home Top, force White. Else, adapt to Light/Dark mode. */}
        <span className={`transition-colors ${isHomeTop ? "text-white" : "text-gray-900 dark:text-white"}`}>
          Max
        </span>
      </div>
    </Link>
  );
};

export default Logo;