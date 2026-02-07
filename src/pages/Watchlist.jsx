import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieRow from "../components/media/MovieRow"; // Reuse for styling if needed, but grid is better here.

const Watchlist = () => {
  const { watchlist, toggleWatchlist } = useContext(GlobalContext);

  return (
    <div className="min-h-screen pt-24 px-8 md:px-12 pb-12">
      <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <h2 className="text-2xl">Your watchlist is empty.</h2>
          <p className="mt-2">Add movies from the home page to keep track of what you want to watch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <div key={movie.id} className="relative group cursor-pointer transition-transform hover:scale-105">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />

              {/* Overlay with Remove Button */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-4">
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700"
                >
                  Remove
                </button>
              </div>

              <h3 className="mt-2 text-sm font-bold text-gray-300 truncate">{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;