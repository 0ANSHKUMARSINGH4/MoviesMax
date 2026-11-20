import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GlobalProvider } from "./context/GlobalState";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import ErrorBoundary from "./components/common/ErrorBoundary";

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
const Login     = lazy(() => import("./pages/Login"));

// Route-level page skeleton — shown while a lazy chunk loads.
// Uses the .page-skeleton class from index.css (gradient, no all-black viewport).
const PageSkeleton = () => (
  <div className="page-skeleton" aria-hidden="true" />
);

// Ultra-snappy page transitions (zero sluggish exit lag)
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
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
            <Route path="/login"     element={<Login />} />
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
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
          <MobileNav />
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;