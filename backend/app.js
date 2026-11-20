require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Non-blocking database connection initialization
let dbConnecting = false;
const ensureDB = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && !dbConnecting) {
    dbConnecting = true;
    connectDB().finally(() => { dbConnecting = false; });
  }
  next();
};

const app = express();
app.use(ensureDB);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'MoviesMax API',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Route imports
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlists');
const movieRoutes = require('./routes/movies');

// Mount routes on /api/* and fallback /* for Vercel serverless
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/playlists', playlistRoutes);
app.use('/playlists', playlistRoutes);

app.use('/api/movies', movieRoutes);
app.use('/movies', movieRoutes);

app.use(errorHandler);

module.exports = app;
