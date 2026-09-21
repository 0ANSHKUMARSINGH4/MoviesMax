import { useState, useEffect, useContext, useRef } from "react";
import { Sun, Moon, Search, Bookmark, User, Bell, LayoutGrid } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import Logo from "./Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { theme, toggleTheme, watchlist } = useContext(GlobalContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isDarkBgNavbar =
    location.pathname === "/" ||
    location.pathname === "/webseries" ||
    location.pathname === "/anime" ||
    location.pathname === "/esports" ||
    location.pathname === "/sports" ||
    (location.pathname === "/movies" && !isScrolled);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  let navLinks = [];
  switch (location.pathname) {
    case "/movies":
      navLinks = [
        { name: "Hub", path: "/" },
        { name: "Trending", path: "/movies#trending" },
        { name: "Top Rated", path: "/movies#top" },
        { name: "Action", path: "/movies#action" },
      ];
      break;
    case "/webseries":
      navLinks = [
        { name: "Hub", path: "/" },
        { name: "Western", path: "/webseries#western" },
        { name: "K-Dramas", path: "/webseries#kdrama" },
        { name: "Sci-Fi", path: "/webseries#scifi" },
      ];
      break;
    case "/anime":
      navLinks = [
        { name: "Hub", path: "/" },
        { name: "Classics", path: "/anime#classics" },
        { name: "Simulcasts", path: "/anime#simulcasts" },
        { name: "Movies", path: "/anime#movies" },
      ];
      break;
    case "/sports":
      navLinks = [
        { name: "Hub", path: "/" },
        { name: "Live Now", path: "/sports#live" },
        { name: "News", path: "/sports#news" },
        { name: "Leaderboards", path: "/sports#leaderboards" },
      ];
      break;
    case "/esports":
      navLinks = [
        { name: "Hub", path: "/" },
        { name: "Tournaments", path: "/esports#live" },
        { name: "News", path: "/esports#news" },
        { name: "Top Games", path: "/esports#games" },
      ];
      break;
    case "/explore":
    case "/watchlist":
    case "/search":
      navLinks = [
        { name: "Hub", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "Series", path: "/webseries" },
        { name: "Anime", path: "/anime" },
      ];
      break;
    case "/":
    default:
      navLinks = [];
      break;
  }

  if (location.pathname === "/") return null;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark-main/90 backdrop-blur-2xl shadow-2xl border-b border-white/10"
          : "bg-gradient-to-b from-dark-main/95 via-dark-main/60 to-transparent pt-1"
      }`}
    >
      <div className="container-mx h-20 flex items-center justify-between gap-4">
        {/* LEFT: 4-DOT ICON & LOGO */}
        <div className="flex items-center gap-6 md:gap-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/explore")}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
              title="Browse Categories"
            >
              <LayoutGrid size={17} />
            </button>
            <Logo isHomeTop={isDarkBgNavbar} />
          </div>

          {/* Desktop Navigation Links (From Video Frame 00:00) */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = (location.pathname + location.hash) === link.path || location.pathname === link.path && !location.hash && !link.path.includes('#');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {link.name}
                  {/* Active Indicator Underline Pill */}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_8px_#8b5cf6]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SEARCH, BELL, WATCHLIST, THEME TOGGLE, AVATAR */}
        <div className="flex items-center gap-3">
          {/* Desktop Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className={`relative hidden sm:flex items-center transition-all duration-300 ${
              isSearchOpen ? "w-64 md:w-72" : "w-44 md:w-56"
            }`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
              placeholder="Search movies, series..."
              className="w-full py-1.5 pl-9 pr-8 text-xs rounded-full bg-dark-elevated border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
            />
            <Search
              size={14}
              className="absolute left-3 text-gray-400 pointer-events-none"
            />
            {!isSearchOpen && !searchQuery && (
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 border border-white/10 pointer-events-none">
                /
              </span>
            )}
          </form>

          {/* Notification Bell (From Video Frame 00:00) */}
          <button
            onClick={() => navigate("/watchlist")}
            className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_#8b5cf6]" />
          </button>

          {/* Desktop Watchlist Icon */}
          <Link
            to="/watchlist"
            className="relative hidden md:flex p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="My Watchlist"
          >
            <Bookmark size={16} />
            {watchlist?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-purple-600/40">
                {watchlist.length > 99 ? "99+" : watchlist.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} className="hover:text-yellow-400 transition-colors" />
            ) : (
              <Moon size={16} className="hover:text-purple-400 transition-colors" />
            )}
          </button>

          {/* User Profile Avatar Pill (From Video Frame 00:00) */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 p-[1.5px] cursor-pointer shadow-md shadow-purple-500/20 hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-dark-card flex items-center justify-center text-white">
              <User size={14} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;