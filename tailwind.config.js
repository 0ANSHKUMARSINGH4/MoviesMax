/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },

      // ── A. TYPE SCALE (DESIGN.md §A) ──────────────────────────
      fontSize: {
        'hero': ['clamp(2.25rem, 5vw + 1rem, 4.5rem)', {
          lineHeight: '1.05',
          letterSpacing: '-0.03em',
          fontWeight: '900',
        }],
        'section': ['clamp(1.5rem, 2vw + 0.5rem, 1.875rem)', {
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          fontWeight: '800',
        }],
        'card-title': ['0.875rem', {
          lineHeight: '1.35',
          letterSpacing: '-0.01em',
          fontWeight: '700',
        }],
        'meta': ['0.6875rem', {
          lineHeight: '1.4',
          letterSpacing: '0.04em',
          fontWeight: '700',
        }],
      },

      // ── B. SPACING SCALE (DESIGN.md §B) ───────────────────────
      spacing: {
        'sp-1': '0.5rem',   //  8px
        'sp-2': '1rem',     // 16px
        'sp-3': '1.5rem',   // 24px
        'sp-4': '2rem',     // 32px
        'sp-5': '3rem',     // 48px
        'sp-6': '4rem',     // 64px
        'sp-7': '5rem',     // 80px
      },

      // ── D. VERTICAL PALETTES + LEGACY (DESIGN.md §D) ─────────
      colors: {
        v: {
          movies:  { base: '#0B1120', surface: '#111827', border: '#1E293B', accent: '#3B82F6', glow: '#3B82F6' },
          series:  { base: '#110B20', surface: '#1A1028', border: '#2D1F4E', accent: '#8B5CF6', glow: '#8B5CF6' },
          anime:   { base: '#1A0A0A', surface: '#231111', border: '#3D1C1C', accent: '#F97316', glow: '#F97316' },
          sports:  { base: '#071A0E', surface: '#0E2518', border: '#1A3D28', accent: '#10B981', glow: '#10B981' },
          esports: { base: '#140818', surface: '#1E0F24', border: '#361950', accent: '#EC4899', glow: '#EC4899' },
        },
        // Legacy tokens (kept for gradual migration, aliased to movies)
        "dark-main": "#0B1120",
        "dark-card": "#111827",
        "dark-elevated": "#1A1F2E",
        "netflix-red": "#E50914",
        "prime-blue": "#00A8E1",
        "crunchyroll-orange": "#FF640A",
        "blue-brand": "#2563EB",
        "blue-accent": "#60A5FA",
        "neon-green": "#10B981",
      },

      // ── E. ELEVATION SHADOWS (DESIGN.md §E) ──────────────────
      boxShadow: {
        'card': '0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 1px 0 rgba(255, 255, 255, 0.06)',
        'card-elevated': '0 20px 40px -5px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'modal': '0 32px 64px -8px rgba(0, 0, 0, 0.9), 0 0 1px 0 rgba(255, 255, 255, 0.1)',
        'hero-glow': '0 0 60px -10px rgba(0, 168, 225, 0.25)',
        'cinematic-glow': '0 0 100px -20px rgba(37, 99, 235, 0.4)',
        'card-glow': '0 0 40px -10px var(--tw-shadow-color)',
      }
    },
  },
  plugins: [],
}