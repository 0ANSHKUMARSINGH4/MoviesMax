import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import Logo from "./Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useContext(GlobalContext);

  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are at the top of the Home page (Transparent State)
  const isHomeTop = location.pathname === "/" && !isScrolled;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
        navigate(`/search?q=${query}`);
        setShowSearch(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? "dark:bg-dark-main/90 bg-white/90 backdrop-blur-xl shadow-lg shadow-blue-900/5 border-b dark:border-blue-900/10 border-blue-100"
        : "bg-gradient-to-b from-black/80 to-transparent pt-2"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Pass the state to the Logo */}
        <Logo isHomeTop={isHomeTop} />

        {/* CENTER LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          {['Home', 'Movies', 'Watchlist'].map((item) => {
             const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`;
             const isActive = location.pathname === path;

             // Dynamic Text Color Logic
             let textColorClass = "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white";
             if (isHomeTop) textColorClass = "text-gray-300 hover:text-white"; // Force light text on Home hero
             if (isActive) textColorClass = isHomeTop ? "text-white" : "text-blue-600 dark:text-blue-400";

             return (
                 <Link
                   key={item}
                   to={path}
                   className={`relative px-3 py-1 transition-all duration-300 rounded-lg group ${textColorClass}`}
                 >
                    {item === 'Movies' ? 'Movies & Shows' : item}

                    {/* Blue Active Underline */}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-brand rounded-full transition-all duration-300 ${
                      isActive ? "w-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50"
                    }`}></span>
                 </Link>
             )
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 text-white">

          {/* SEARCH BAR */}
          <div className={`flex items-center rounded-full border transition-all duration-300 ${
            showSearch
              ? "w-64 px-4 bg-white dark:bg-dark-main border-blue-200 dark:border-blue-900 ring-2 ring-blue-500/20"
              : "w-10 h-10 justify-center bg-transparent border-transparent hover:bg-blue-500/10 dark:hover:bg-white/5"
          }`}>
             <Search
                size={20}
                className={`cursor-pointer transition-colors ${
                    showSearch
                    ? "text-blue-brand"
                    : isHomeTop ? "text-white" : "dark:text-white text-gray-800"
                }`}
                onClick={() => setShowSearch(!showSearch)}
             />
             <form onSubmit={handleSearch} className="flex-1">
                <input
                    type="text"
                    placeholder="Search titles..."
                    className={`bg-transparent border-none outline-none text-sm ml-3 w-full dark:text-white text-black placeholder-gray-500 transition-all duration-200 ${
                      showSearch ? "opacity-100" : "opacity-0 w-0 hidden"
                    }`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setShowSearch(false)}
                    autoFocus={showSearch}
                />
             </form>
             {showSearch && <X size={16} className="cursor-pointer text-gray-400 hover:text-blue-brand" onClick={() => setShowSearch(false)} />}
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-blue-500/10 dark:hover:bg-white/10 ${
                isHomeTop ? "text-white" : "dark:text-white text-gray-800"
            }`}
          >
            {theme === "dark" ? <Sun size={20} className="hover:text-yellow-400 transition-colors" /> : <Moon size={20} className="hover:text-blue-brand transition-colors" />}
          </button>

          <div className={`md:hidden ${isHomeTop ? "text-white" : "dark:text-white text-gray-800"}`}>
             <Menu className="w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;