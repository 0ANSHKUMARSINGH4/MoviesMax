import { useState, useEffect, useContext, useRef } from "react";
import { Search, Bookmark, Bell, X, LogOut, Film } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Movies", path: "/movies" },
  { name: "Series", path: "/webseries" },
  { name: "Anime", path: "/anime" },
  { name: "My Watchlist", path: "/watchlist" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const { user, logout, defaultPlaylist } = useContext(GlobalContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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

  const watchlistCount = defaultPlaylist?.movies?.length || 0;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0B1120]/95 backdrop-blur-xl shadow-2xl border-b border-blue-500/10"
          : "bg-gradient-to-b from-[#0B1120]/90 via-[#0B1120]/50 to-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* LEFT: BLUE & WHITE BRAND LOGO + NAV LINKS */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Film size={18} />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              MOVIES<span className="text-white">MAX</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS (Hide Movies, Series, Anime on homepage per requirements) */}
          <ul className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold">
            {(location.pathname === "/"
              ? NAV_LINKS.filter((link) => link.name === "Home" || link.name === "My Watchlist")
              : NAV_LINKS
            ).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`transition-colors duration-200 relative py-1 ${
                      isActive
                        ? "text-blue-400 font-bold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3B82F6]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT: SEARCH, WATCHLIST, NOTIFICATIONS & PROFILE */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* EXPANDABLE SEARCH */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-[#111827]/90 border border-blue-500/40 rounded-full px-3 py-1.5 transition-all duration-300 w-44 sm:w-64 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <Search size={16} className="text-blue-400 mr-2 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, actors, genres..."
                  className="bg-transparent text-white text-xs sm:text-sm focus:outline-none w-full placeholder-gray-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-white ml-1.5 flex-shrink-0"
                >
                  <X size={15} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-300 hover:text-white p-2 transition-colors rounded-full hover:bg-white/5"
                title="Search (Press /)"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* WATCHLIST QUICK SHORTCUT */}
          <Link
            to="/watchlist"
            className="relative text-gray-300 hover:text-white p-2 transition-colors rounded-full hover:bg-white/5 hidden xs:flex items-center"
            title="My Watchlist"
          >
            <Bookmark size={20} />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-blue-600/50">
                {watchlistCount > 9 ? "9+" : watchlistCount}
              </span>
            )}
          </Link>

          {/* NOTIFICATION BELL */}
          <button
            className="text-gray-300 hover:text-white p-2 transition-colors rounded-full hover:bg-white/5 hidden sm:block"
            title="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* USER AVATAR & DROPDOWN */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/30 group-hover:ring-2 group-hover:ring-blue-400 transition-all">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-blue-500/20 rounded-2xl shadow-2xl py-2 z-50 text-sm backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-white font-semibold truncate">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/watchlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-gray-200 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                  >
                    <Bookmark size={16} />
                    <span>My Watchlist ({watchlistCount})</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
