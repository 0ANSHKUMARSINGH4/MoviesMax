import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Explore from "./pages/Explore";
import Watchlist from "./pages/Watchlist";
import Search from "./pages/Search";
import Webseries from "./pages/Webseries";
import Anime from "./pages/Anime";
import Esports from "./pages/Esports";
import Sports from "./pages/Sports";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen bg-dark-main text-gray-200 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 pb-24 md:pb-0">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search" element={<Search />} />
            <Route path="/webseries" element={<Webseries />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/esports" element={<Esports />} />
            <Route path="/sports" element={<Sports />} />
          </Routes>
          <MobileNav />
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;