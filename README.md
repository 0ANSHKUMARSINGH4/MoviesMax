# 🎬 MoviesMax

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

**The Next-Generation MERN Stack Cinema, Webseries & Anime Discovery Platform**

🚀 **Live Production URL:** [https://moviesmax-puce.vercel.app](https://moviesmax-puce.vercel.app)

</div>

---

## 🌟 Overview

**MoviesMax** is a high-performance, full-stack **MERN** web application engineered with a cinematic **Electric Blue & Midnight Navy** aesthetic. Inspired by platforms like Apple TV+, Netflix, and A24, MoviesMax delivers an interactive **3D Vinyl Record Deck Carousel**, dedicated vertical discovery portals (**Movies**, **Webseries**, and **Anime**), real-time TMDB API integration, YouTube 4K trailer playback, and persistent cloud watchlist synchronization powered by MongoDB Atlas.

---

## ✨ Key Features

### 💿 Interactive 3D Vinyl Record Deck (Homepage Showstopper)
- **Infinite Loop Geometry:** Browse movies and series fanned out like records in a vinyl crate with continuous circular wrapping that never hits a boundary.
- **Section Switcher:** Seamlessly toggle between **Movies**, **Webseries**, and **Anime** right inside the vinyl deck.
- **Auto-Sliding with Card-Hover Pause:** Cycles smoothly every 3.2 seconds with spring physics, and pauses immediately whenever the user hovers over any card.
- **Direct Action Triggers:** One-click launch into the 4K trailer theatre modal and instant watchlist toggling.

### 🏛️ Dedicated Vertical Portals
- 🎬 **Movies Portal (`/movies`):** Hollywood blockbusters, Oscar nominees, all-time classics, and Cannes winners with vertical-specific hero billboards.
- 📺 **Webseries Portal (`/webseries`):** Binge-worthy multi-season prestige television, HBO phenomena, Netflix originals, and crime thrillers.
- ⚡ **Anime Portal (`/anime`):** Trending simulcasts, dark fantasy epics, shonen legends, and Studio Ghibli masterpieces in a unified Midnight Navy theme.
- 🎮 **Sports & Esports (`/sports`, `/esports`):** Live sports tournament tracking, upcoming fixtures, and gaming broadcasts.

### 🍿 Cinematic Cinema Modal
- **Embedded 4K Trailer Player:** Powered by React Player with automatic YouTube trailer matching.
- **Rich Metadata:** Director bio, complete cast roster, release date, runtime, genres, and synopsis.
- **Audience Sentiment Gauge:** Verified reception metrics and critical consensus scores.
- **Similar Recommendations:** Contextual recommendations matching the active title.

### 💬 "Words That Resonate Through Cinema"
- Infinite dialogue marquee featuring iconic quotes (*Interstellar*, *The Dark Knight*, *Gladiator*, *Fight Club*, etc.).
- Dual-direction continuous CSS animation with hover-to-pause and verified high-res TMDB backdrops.

### 🔒 Secure MERN Authentication & Watchlist Sync
- **JWT Authentication:** Token-based authentication with bcrypt password hashing.
- **MongoDB Atlas Persistence:** Multi-user playlist and watchlist synchronization with real-time updates.

### ⚡ Zero-Lag High-Performance Architecture
- In-memory server caching with 15-minute TTL to eliminate TMDB rate-limiting.
- GPU hardware-accelerated layer compositing (`will-change`, CSS transforms).
- Responsive image resolution scaling (`w500` for cards, `w1280` for backdrops) to optimize mobile bandwidth.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 7 | Lightning-fast component rendering & HMR |
| **Styling** | Tailwind CSS 3 | Signature Electric Blue (`#3B82F6`) on Midnight Navy (`#0B1120`) |
| **Animations** | Framer Motion 12 | Spring physics, 3D card fan-outs, and layout animations |
| **Routing** | React Router DOM 7 | Client-side navigation with route-aware navbar |
| **Backend** | Node.js, Express.js | RESTful API server with modular routing & error handling |
| **Database** | MongoDB Atlas, Mongoose 8 | Cloud NoSQL database with non-blocking connection pool |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js | Stateless authentication & secure credential encryption |
| **Data Provider**| The Movie Database (TMDB) API | Global movie, TV, anime metadata, posters & trailers |
| **Deployment** | Vercel (Multi-Service) | Vite SPA static hosting & serverless Express API |

---

## 📂 Project Structure

```text
MoviesMax/
├── api/                     # Vercel Serverless Function entry point
│   └── index.js             # Express handler adapter
├── backend/                 # Node.js Express backend
│   ├── config/              # MongoDB connection configuration (db.js)
│   ├── middleware/          # Auth verification & error handling
│   ├── models/              # Mongoose schemas (User.js, Playlist.js)
│   ├── routes/              # Express API routes (auth.js, movies.js, playlists.js)
│   ├── app.js               # Express app configuration & middleware
│   ├── server.js            # Standalone local dev server
│   └── vercel.json          # Backend-specific serverless routing
├── src/                     # React frontend source
│   ├── components/
│   │   ├── common/          # ErrorBoundary, Loader, etc.
│   │   ├── layout/          # Navbar, Footer, MobileNav
│   │   ├── media/           # PlaylistRecordDeck, Hero, MovieCard, MovieRow, Top10Row, BentoGrid, QuoteRoundup
│   │   └── modal/           # MovieModal (trailer player, cast, sentiment)
│   ├── context/             # GlobalState.jsx (auth & playlist context)
│   ├── pages/               # Home, Movies, Webseries, Anime, Sports, Esports, Watchlist, Login, Search
│   ├── utils/               # movieApi.js (API client), movieData.js (catalog fallback)
│   ├── App.jsx              # Application routes & layout wrapper
│   └── main.jsx             # React entry point
├── package.json             # Root monorepo configuration
├── vercel.json              # Vercel multi-service routing config
└── README.md                # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI (or local MongoDB)
- [TMDB API Key](https://www.themoviedb.org/documentation/api)

---

### 1. Clone the Repository
```bash
git clone https://github.com/0ANSHKUMARSINGH4/MoviesMax.git
cd MoviesMax
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here

# MongoDB Atlas Database URI
MONGO_URI=your_mongodb_connection_string_here

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key_here

# Backend Port (for local development)
PORT=5000
```

### 4. Run the Development Server
Run both the Express backend API and the Vite frontend concurrently:
```bash
npm run dev:all
```
Or run them separately:
```bash
# Terminal 1: Backend API (http://localhost:5000)
npm run server

# Terminal 2: Frontend Vite App (http://localhost:5173)
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 📡 Backend API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & MongoDB status | No |
| `GET` | `/api/movies/trending` | Fetch weekly trending titles | No |
| `GET` | `/api/movies/category/:key` | Fetch category titles (popular, top-rated, etc.) | No |
| `GET` | `/api/movies/search?q=:query` | Multi-search for titles, actors, and genres | No |
| `GET` | `/api/movies/:tmdbId` | Fetch movie details, trailer key, cast & director | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/playlists` | Fetch user playlists & watchlist | Yes (Bearer Token) |
| `POST` | `/api/playlists/:id/movies` | Add movie to user playlist | Yes (Bearer Token) |
| `DELETE`| `/api/playlists/:id/movies/:tmdbId`| Remove movie from playlist | Yes (Bearer Token) |

---

## 🌐 Production Deployment

The project is deployed on **Vercel** with a multi-service architecture:
- **Frontend:** Built via Vite (`vite build`) outputting to `dist/`.
- **Backend API:** Traced and deployed as Vercel Serverless Functions via `/api/index.js` routing to Express.
- **Rewrites:** All `/api/*` requests route to the backend serverless handler, while client routes route to `/index.html` for single-page routing.

Live production URL: **[https://moviesmax-puce.vercel.app](https://moviesmax-puce.vercel.app)**

---

## 📬 Contact & Author

- **Author:** Ansh Kumar Singh
- **GitHub:** [@0ANSHKUMARSINGH4](https://github.com/0ANSHKUMARSINGH4)
- **Repository:** [https://github.com/0ANSHKUMARSINGH4/MoviesMax](https://github.com/0ANSHKUMARSINGH4/MoviesMax)

---

<div align="center">
  <sub>Built with ❤️ using the MERN Stack, Vite, Tailwind CSS, and Framer Motion.</sub>
</div>
