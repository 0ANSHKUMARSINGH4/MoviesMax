import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Movies from "./pages/Movies";
import Search from "./pages/Search";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-main text-gray-900 dark:text-white font-sans selection:bg-red-brand selection:text-white transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;