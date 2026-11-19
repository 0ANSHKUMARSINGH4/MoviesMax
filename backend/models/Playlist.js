const mongoose = require('mongoose');

const movieEntrySchema = new mongoose.Schema({
  tmdbId: { type: String, required: true },
  title: String,
  poster_path: String,
  backdrop_path: String,
  overview: String,
  vote_average: Number,
  release_date: String,
  genres: [{ id: Number, name: String }],
  runtime: Number,
  addedAt: { type: Date, default: Date.now }
});

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 60, default: 'My Watchlist' },
  description: { type: String, maxlength: 200, default: '' },
  isDefault: { type: Boolean, default: false },
  movies: [movieEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
