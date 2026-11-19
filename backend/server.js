const app = require('./app');

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 MoviesMax API running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🍿 TMDB Movies: http://localhost:${PORT}/api/movies/trending`);
  });
}

module.exports = app;
