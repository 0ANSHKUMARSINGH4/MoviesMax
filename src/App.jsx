import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GlobalProvider } from "./context/GlobalState";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";

// Lazy-load each vertical page so hero images don't block initial render
const Home      = lazy(() => import("./pages/Home"));
const Movies    = lazy(() => import("./pages/Movies"));
const Explore   = lazy(() => import("./pages/Explore"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Search    = lazy(() => import("./pages/Search"));
const Webseries = lazy(() => import("./pages/Webseries"));
const Anime     = lazy(() => import("./pages/Anime"));
const Esports   = lazy(() => import("./pages/Esports"));
const Sports    = lazy(() => import("./pages/Sports"));

// Route-level page skeleton — shown while a lazy chunk loads.
// Uses the .page-skeleton class from index.css (gradient, no all-black viewport).
const PageSkeleton = () => (
  <div className="page-skeleton" aria-hidden="true" />
);

// Page transition wrapper using motionPageTransition from DESIGN.md §F
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { type: "tween", duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route path="/"          element={<Home />} />
            <Route path="/movies"    element={<Movies />} />
            <Route path="/explore"   element={<Explore />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search"    element={<Search />} />
            <Route path="/webseries" element={<Webseries />} />
            <Route path="/anime"     element={<Anime />} />
            <Route path="/esports"   element={<Esports />} />
            <Route path="/sports"    element={<Sports />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen bg-dark-main text-gray-200 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 pb-[calc(88px+env(safe-area-inset-bottom))] md:pb-0">
          <Navbar />
          <AnimatedRoutes />
          <MobileNav />
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;