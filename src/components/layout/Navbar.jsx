import { useState, useEffect, useContext, useRef } from "react";
import { Search, Bookmark, Bell, X, LogOut, User as UserIcon } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import Logo from "./Logo";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "TV Shows", path: "/webseries" },
  { name: "Movies", path: "/movies" },
  { name: "Anime", path: "/anime" },
  { name: "My List", path: "/watchlist" },
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
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[#141414] shadow-2xl border-b border-white/5"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* LEFT: BRAND LOGO & NETFLIX NAV LINKS */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#E50914] group-hover:scale-105 transition-transform duration-200">
              MOVIES<span className="text-white">MAX</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <ul className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-white font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT: SEARCH, WATCHLIST, NOTIFICATIONS & PROFILE */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* EXPANDABLE NETFLIX SEARCH */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-black/80 border border-white/30 rounded px-2.5 py-1.5 transition-all duration-300 w-44 sm:w-64"
              >
                <Search size={16} className="text-zinc-400 mr-2 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres..."
                  className="bg-transparent text-white text-xs sm:text-sm focus:outline-none w-full placeholder-zinc-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-400 hover:text-white ml-1.5 flex-shrink-0"
                >
                  <X size={15} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-zinc-300 hover:text-white p-2 transition-colors duration-200"
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
            className="relative text-zinc-300 hover:text-white p-2 transition-colors duration-200 hidden xs:flex items-center"
            title="My Watchlist"
          >
            <Bookmark size={20} />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#E50914] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {watchlistCount > 9 ? "9+" : watchlistCount}
              </span>
            )}
          </Link>

          {/* NOTIFICATION BELL */}
          <button
            className="text-zinc-300 hover:text-white p-2 transition-colors duration-200 hidden sm:block"
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
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-[#E50914] text-white font-bold flex items-center justify-center text-sm shadow-md group-hover:ring-2 group-hover:ring-white/40 transition-all">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-zinc-800 rounded-md shadow-2xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-zinc-800">
                    <p className="text-white font-semibold truncate">{user.name}</p>
                    <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/watchlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Bookmark size={16} />
                    <span>My Watchlist ({watchlistCount})</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors text-left"
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
              className="bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded transition-all duration-200 shadow-lg"
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
