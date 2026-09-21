# Codebase Audit Report

## 1. Image and Background-Image Analysis

### Components Rendering `<img>`
The following components render standard `<img>` tags. Their sources are predominantly derived from API props, with a few notable hardcoded fallbacks.

- **[Watchlist.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/pages/Watchlist.jsx#L85)**: `item.poster_path` or `item.backdrop_path`
- **[Sports.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/pages/Sports.jsx#L54)**: Hardcoded `heroImage` from page data
- **[Home.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/pages/Home.jsx#L76)**: Category images
- **[Esports.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/pages/Esports.jsx#L51)**: Hardcoded `heroImage` from page data
- **[MovieModal.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/modal/MovieModal.jsx#L176)**: `media.backdrop_path`
- **[MovieModal.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/modal/MovieModal.jsx#L359)**: `media.poster_path` (Vinyl Record album art)
- **[MovieModal.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/modal/MovieModal.jsx#L397)**: Gallery stills mapped from `sampleStills` (Includes 3 hardcoded Unsplash URLs)
- **[MovieModal.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/modal/MovieModal.jsx#L416)**: `actor.profile_path` (Falls back to hardcoded Unsplash URL)
- **[BentoDiscoveryGrid.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/BentoDiscoveryGrid.jsx#L78)**: `spotlight.image`
- **[BentoDiscoveryGrid.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/BentoDiscoveryGrid.jsx#L122)**: `tallFeature.image`
- **[BentoDiscoveryGrid.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/BentoDiscoveryGrid.jsx#L186)**: `soundtrackCard.image`
- **[AestheticQuoteRoundup.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/AestheticQuoteRoundup.jsx#L65)**: `quote.image`
- **[CylinderCarousel3D.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/CylinderCarousel3D.jsx#L260)**: `item.image`
- **[Top10Row.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/Top10Row.jsx#L135)**: `item.poster_path`
- **[NewsCarousel.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/NewsCarousel.jsx#L82)**: `news.image`
- **[Leaderboard.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/Leaderboard.jsx#L74)**: `item.image`
- **[Hero.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/Hero.jsx#L98)**: `media.poster_path`
- **[FanDeckHero.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/FanDeckHero.jsx#L306)**: `item.backdrop_path`
- **[FanDeckHero.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/FanDeckHero.jsx#L396)**: `item.poster_path`
- **[FanDeckHero.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/FanDeckHero.jsx#L482)**: `cast.profile_path`
- **[ContinueWatchingRow.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/components/media/ContinueWatchingRow.jsx#L50)**: `item.backdrop_path`

### CSS `background-image`
There are **no direct uses of CSS `url(...)`** in `style` attributes or custom CSS files. However, Tailwind gradient classes are heavily used.
Notably, in **[Esports.jsx](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/src/pages/Esports.jsx#L91)**, an arbitrary background-image is used for a grid effect:
- `bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]`

---

## 2. Layout Container Patterns

The layout system exhibits significant inconsistency, using a variety of disparate container widths, paddings, and centering rules. There are **at least 8 distinct container variants** across pages and components:

1. **`max-w-7xl mx-auto px-4 sm:px-8 md:px-12`**: Used in `Watchlist.jsx`, `Search.jsx`, `Sports.jsx`, `Esports.jsx`.
2. **`max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-12`**: Used in `Home.jsx`.
3. **`px-4 md:px-8`**: Used in `Webseries.jsx`, `Movies.jsx`, `Anime.jsx`.
4. **`px-4 md:px-12`**: Used in `Explore.jsx`.
5. **`px-6 sm:px-12 md:px-16 max-w-4xl`**: Used in `Sports.jsx`, `Esports.jsx` (Hero text containers).
6. **`max-w-2xl mx-auto`**: Used for descriptive paragraphs in `Home.jsx` and `Watchlist.jsx`.
7. **`max-w-sm mx-auto`**: Used in `Sports.jsx`, `Esports.jsx`.
8. **`max-w-5xl`**: Used in `MovieModal.jsx` for the modal container itself.

---

## 3. Hardcoded Styling Values

A significant number of colors, typography sizes, and spacing values bypass the standard `tailwind.config.js` theme tokens.

### Hardcoded Hex Colors (Backgrounds)
Grouped by component/page file:
- **`App.jsx`, `Home.jsx`**: `#020205`
- **`Webseries.jsx`**: `#090510`, `#12081f`
- **`Movies.jsx`, `Watchlist.jsx`, `Search.jsx`, `Explore.jsx`, `Hero.jsx`, `CylinderCarousel3D.jsx`**: `#07080b`, `#090b10`, `#11131c`
- **`Sports.jsx`**: `#040d07`, `#0a180f`, `#081a0e`, `#09160d`, `#0e2215`
- **`Esports.jsx`**: `#07050d`, `#120a1b`, `#12081c`, `#12091c`, `#1c0f2b`
- **`Anime.jsx`**: `#0c0505`, `#180a0a`
- **`MovieModal.jsx`, `Top10Row.jsx`, `BentoDiscoveryGrid.jsx`**: `#0c0c11`, `#0c0d14`
- **`NewsCarousel.jsx`, `Leaderboard.jsx`, `ContinueWatchingRow.jsx`**: `#0f1118`, `#151822`
- **`FanDeckHero.jsx`**: `#12131c`, `#0e0f17`, `#151621`
- **`Navbar.jsx`, `MobileNav.jsx`**: `#090a0f`, `#141522`, `#08080c`
- **`index.css`**: `#07080b` (global background)

### Hardcoded Font Sizes
Many sub-12px sizes are hardcoded instead of extending Tailwind's `text-xs`:
- **`text-[9px]`**: Found in `Sports.jsx`, `Esports.jsx`, `Top10Row.jsx`, `MovieCard.jsx`.
- **`text-[10px]`**: Widespread across `Sports.jsx`, `Esports.jsx`, `MovieModal.jsx`, `Top10Row.jsx`, `NewsCarousel.jsx`, `MovieRow.jsx`, `MovieCard.jsx`, `Hero.jsx`, `BentoDiscoveryGrid.jsx`, `Navbar.jsx`, `MobileNav.jsx`.
- **`text-[11px]`**: Found in `Sports.jsx`, `Esports.jsx`, `MovieModal.jsx`, `Top10Row.jsx`, `MovieCard.jsx`, `Hero.jsx`, `FanDeckHero.jsx`, `CylinderCarousel3D.jsx`, `BentoDiscoveryGrid.jsx`.

### Hardcoded Spacing / Layout (Widths, Heights)
- **Viewport Heights**: `h-[60vh]`, `h-[75vh]`, `h-[82vh]`, `h-[85vh]`, `h-[90vh]`, `h-[92vh]`
- **Specific Pixels**: `h-[370px]`, `h-[380px]`, `h-[420px]`, `h-[430px]`, `h-[450px]`, `h-[480px]`, `h-[500px]`, `h-[520px]`, `h-[600px]`.
- **Specific Widths**: `w-[650px]`, `w-[700px]`, `w-[850px]`, `max-w-[1400px]`.
- **Viewport Widths**: `w-[85vw]`, `w-[60vw]`, `w-[45vw]`, `w-[35vw]`.

---

## 4. `movieData.js` Entry Counts Analysis

The `CATEGORY_CATALOG` in `src/utils/movieData.js` reveals major inconsistencies in data volume across verticals.

### Count of Entries per Category
**Movies:**
- `trending blockbusters`: 6
- `top rated classics`: 6
- `action thrillers`: 5
- `sci-fi & cyberpunk`: 5
- `comedy hits`: 5

**Webseries:**
- `western prestige tv`: 5
- `korean dramas (k-dramas)`: 5
- `sci-fi & fantasy epics`: 5
- `crime & mystery thrillers`: 5

**Anime:**
- `top rated classics (crunchyroll)`: 5
- `currently airing simulcasts`: 5
- `top anime movies & features`: 5

**Sports:**
- *CRITICAL ISSUE: Missing entirely from `CATEGORY_CATALOG`.* (0 categories, 0 entries)

**Esports:**
- *CRITICAL ISSUE: Missing entirely from `CATEGORY_CATALOG`.* (0 categories, 0 entries)

### Categories with fewer than 12 entries
> [!WARNING]
> **EVERY SINGLE CATEGORY** in the codebase has fewer than 12 entries. They all range between 5 and 6 entries. In addition, the Sports and Esports verticals possess 0 entries in the primary `CATEGORY_CATALOG`.

---

## 5. `MovieModal.jsx` Fallback Trace

`MovieModal.jsx` acts as the primary data presentation layer for individual media items. Due to potential discrepancies from external APIs (Jikan/OMDb), it relies on extensive fallbacks mapped from the base `media` object passed as a prop:

- **`score`**: Falls back to `media.vote_average` -> Hardcoded `8.4`.
- **`runtime`**: Falls back to `media.runtime`.
- **`genres`**: Falls back to `media.genres`.
- **`overview`**: Falls back to `media.overview`.
- **`release_date`**: Falls back to `media.release_date`.
- **`director`**: Falls back to `media.director`.
- **`country`**: Falls back to `media.country`.
- **`original_title`**: Falls back to `media.title`.
- **`trailer videoKey`**: If YouTube ID is absent, it renders a backdrop image with a hardcoded button that executes a YouTube Search URL query string (`https://www.youtube.com/results?search_query=...`).
- **`actor.profile_path`**: Falls back to a hardcoded Unsplash URL (`"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120"`).
- **Stills Gallery**: Hardcodes 3 `images.unsplash.com` fallback URLs directly in the component body.
