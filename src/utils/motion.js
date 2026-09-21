/**
 * Motion Primitives — DESIGN.md §F
 *
 * Exactly three Framer Motion configs. Every animation in the app uses one of these.
 * No component may define its own variants outside this file.
 */

// ── 1. HOVER — Interactive feedback on pointer enter ────────
export const motionHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: { type: 'tween', duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    scale: 1.04,
    y: -4,
    transition: { type: 'tween', duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── 2. REVEAL — Scroll-triggered entrance ───────────────────
// Usage: <motion.div variants={motionReveal} custom={index}
//          initial="hidden" whileInView="visible"
//          viewport={{ once: true, margin: "-80px" }}>
export const motionReveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      delay: i * 0.08,
    },
  }),
};

// Container variant for staggering children that each use motionReveal
export const motionRevealContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Child variant matching motionReveal but without custom index (for stagger containers)
export const motionRevealChild = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ── 3. PAGE TRANSITION — Route-level entrance/exit ──────────
// Usage: <motion.div {...motionPageTransition}>
export const motionPageTransition = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ── VERTICAL THEME MAP ──────────────────────────────────────
// Centralised theme object keyed by vertical name.
// Components import this instead of defining inline theme objects.
export const VERTICAL_THEMES = {
  movies: {
    base: 'bg-v-movies-base',
    surface: 'bg-v-movies-surface',
    border: 'border-v-movies-border',
    accent: 'bg-v-movies-accent',
    accentText: 'text-v-movies-accent',
    accentBorder: 'border-v-movies-accent',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.35)]',
    gradient: 'from-v-movies-base',
    pillBg: 'bg-v-movies-accent/15 text-v-movies-accent border-v-movies-accent/30',
    tagBg: 'bg-v-movies-accent',
    btnBg: 'bg-v-movies-accent hover:bg-blue-500',
    ambientMask: 'from-v-movies-base via-v-movies-base/70',
    badgeColor: 'text-v-movies-accent border-v-movies-accent/30 bg-v-movies-accent/10',
    borderGlow: 'hover:border-v-movies-accent/50',
    activeBullet: '!bg-v-movies-accent',
  },
  series: {
    base: 'bg-v-series-base',
    surface: 'bg-v-series-surface',
    border: 'border-v-series-border',
    accent: 'bg-v-series-accent',
    accentText: 'text-v-series-accent',
    accentBorder: 'border-v-series-accent',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.35)]',
    gradient: 'from-v-series-base',
    pillBg: 'bg-v-series-accent/15 text-v-series-accent border-v-series-accent/30',
    tagBg: 'bg-v-series-accent',
    btnBg: 'bg-v-series-accent hover:bg-purple-500',
    ambientMask: 'from-v-series-base via-v-series-base/70',
    badgeColor: 'text-v-series-accent border-v-series-accent/30 bg-v-series-accent/10',
    borderGlow: 'hover:border-v-series-accent/50',
    activeBullet: '!bg-v-series-accent',
  },
  anime: {
    base: 'bg-v-anime-base',
    surface: 'bg-v-anime-surface',
    border: 'border-v-anime-border',
    accent: 'bg-v-anime-accent',
    accentText: 'text-v-anime-accent',
    accentBorder: 'border-v-anime-accent',
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.35)]',
    gradient: 'from-v-anime-base',
    pillBg: 'bg-v-anime-accent/15 text-v-anime-accent border-v-anime-accent/30',
    tagBg: 'bg-v-anime-accent',
    btnBg: 'bg-v-anime-accent hover:bg-orange-500',
    ambientMask: 'from-v-anime-base via-v-anime-base/70',
    badgeColor: 'text-v-anime-accent border-v-anime-accent/30 bg-v-anime-accent/10',
    borderGlow: 'hover:border-v-anime-accent/50',
    activeBullet: '!bg-v-anime-accent',
  },
  sports: {
    base: 'bg-v-sports-base',
    surface: 'bg-v-sports-surface',
    border: 'border-v-sports-border',
    accent: 'bg-v-sports-accent',
    accentText: 'text-v-sports-accent',
    accentBorder: 'border-v-sports-accent',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
    gradient: 'from-v-sports-base',
    pillBg: 'bg-v-sports-accent/15 text-v-sports-accent border-v-sports-accent/30',
    tagBg: 'bg-v-sports-accent',
    btnBg: 'bg-v-sports-accent hover:bg-emerald-400',
    ambientMask: 'from-v-sports-base via-v-sports-base/70',
    badgeColor: 'text-v-sports-accent border-v-sports-accent/30 bg-v-sports-accent/10',
    borderGlow: 'hover:border-v-sports-accent/50',
    activeBullet: '!bg-v-sports-accent',
  },
  esports: {
    base: 'bg-v-esports-base',
    surface: 'bg-v-esports-surface',
    border: 'border-v-esports-border',
    accent: 'bg-v-esports-accent',
    accentText: 'text-v-esports-accent',
    accentBorder: 'border-v-esports-accent',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.35)]',
    gradient: 'from-v-esports-base',
    pillBg: 'bg-v-esports-accent/15 text-v-esports-accent border-v-esports-accent/30',
    tagBg: 'bg-v-esports-accent',
    btnBg: 'bg-v-esports-accent hover:bg-pink-400',
    ambientMask: 'from-v-esports-base via-v-esports-base/70',
    badgeColor: 'text-v-esports-accent border-v-esports-accent/30 bg-v-esports-accent/10',
    borderGlow: 'hover:border-v-esports-accent/50',
    activeBullet: '!bg-v-esports-accent',
  },
};
