const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not set. Database features (auth & watchlist) require a MongoDB connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected: ${conn.connection.name || conn.connection.host}`);
  } catch (err) {
    console.error('⚠️ [MongoDB] Connection failed:', err.message);
    console.log('💡 [Tip] If you do not have local MongoDB installed, use a free MongoDB Atlas cloud cluster:');
    console.log('       Set MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/moviesmax in .env');
    console.log('       (Movies and trailer discovery will still work without database)\n');
  }
};

module.exports = connectDB;
