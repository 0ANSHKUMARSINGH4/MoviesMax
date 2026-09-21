import { useLocation, Link } from "react-router-dom";
import { Home, Compass, Search, Bookmark } from "lucide-react";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const MobileNav = () => {
  const location = useLocation();
  const { watchlist } = useContext(GlobalContext);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Search", path: "/search", icon: Search },
    { name: "Watchlist", path: "/watchlist", icon: Bookmark, badge: watchlist?.length || 0 },
  ];

  if (location.pathname === "/") return null;

  return (
    <div className="fixed bottom-5 inset-x-0 mx-auto w-[92%] max-w-sm z-50 md:hidden pointer-events-auto">
      <nav className="relative flex items-center justify-around py-3 px-3 rounded-full bg-[#08080c]/85 dark:bg-[#08080c]/85 bg-white/90 backdrop-blur-2xl border border-white/10 dark:border-white/10 border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1.5 px-4 rounded-full transition-all duration-300 ${
                isActive
                  ? "text-blue-500 font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {/* Active Background Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-blue-600/15 border border-blue-500/30 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center justify-center">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive ? "scale-110 text-blue-500 stroke-[2.5]" : ""
                  }`}
                />

                {/* Watchlist Count Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-blue-600/40">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              <span className="relative z-10 text-[10px] mt-1 font-semibold tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
