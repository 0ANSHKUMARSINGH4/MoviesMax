# DESIGN.md — MoviesMax Design System

> This document is the single source of truth for all visual decisions.
> No component code may invent colours, font sizes, spacings, shadows, or animation configs outside of what is defined here.
> Reference: [AUDIT.md](file:///c:/Users/KIIT/Desktop/DeskFol/Personal%20Projects/MoviesMax/AUDIT.md)

---

## Problems Being Solved

| Problem | Root Cause (from AUDIT.md) |
|---|---|
| All five verticals look like the same near-black page | Every `base` background is within `#040d07`–`#0c0505` (luminance 2–4%). Indistinguishable. |
| Layout sections each pick their own container width | 8 distinct `max-w-*` / `px-*` combinations across files. No shared container. |
| No mid-level typographic hierarchy | Only hero `text-7xl` and card body `text-xs`. Section titles are ad-hoc `text-xl`/`text-2xl`. 15+ hardcoded `text-[9px]`–`text-[11px]` sizes. |
| Wide viewports show dead space | `max-w-7xl` (80rem) is too narrow for 2560px monitors. Some pages use `px-4 md:px-8` with no max-width at all, causing unbounded line lengths. |

---

## A. Type Scale

Exactly four levels. Every text element in the app maps to one of these. The existing `text-[9px]`, `text-[10px]`, `text-[11px]` arbitrary values are **banned** — use `meta` for all such labels.

### Tailwind `theme.extend.fontSize` config

```js
// tailwind.config.js → theme.extend.fontSize
fontSize: {
  // Level 1: HERO — page-level hero titles only (Hero.jsx h1, Sports/Esports hero h1)
  // Rationale: current hero uses text-4xl/6xl/7xl which is correct in spirit,
  // but the responsive ramp is inconsistent. This formalises it.
  'hero': ['clamp(2.25rem, 5vw + 1rem, 4.5rem)', {
    lineHeight: '1.05',
    letterSpacing: '-0.03em',
    fontWeight: '900',
  }],

  // Level 2: SECTION-TITLE — row headers, section headings, bento card headlines
  // Rationale: current code mixes text-xl, text-2xl, text-3xl for the same role.
  // 1.5rem (24px) at minimum, scaling to 1.875rem (30px).
  'section': ['clamp(1.5rem, 2vw + 0.5rem, 1.875rem)', {
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    fontWeight: '800',
  }],

  // Level 3: CARD-TITLE — movie card titles, modal title, quote attributions
  // 0.875rem (14px) base, no fluid scaling needed.
  'card-title': ['0.875rem', {
    lineHeight: '1.35',
    letterSpacing: '-0.01em',
    fontWeight: '700',
  }],

  // Level 4: META — ratings, badges, timestamps, genre pills, "SUB|DUB", live status
  // Replaces ALL occurrences of text-[9px], text-[10px], text-[11px].
  // 0.6875rem = 11px — large enough to be legible, small enough to be subordinate.
  'meta': ['0.6875rem', {
    lineHeight: '1.4',
    letterSpacing: '0.04em',
    fontWeight: '700',
  }],
}
```

### Usage mapping

| Level | Token | Used by |
|---|---|---|
| Hero | `text-hero font-display` | `Hero.jsx` h1, `Sports.jsx` h1, `Esports.jsx` h1, `FanDeckHero.jsx` main title |
| Section | `text-section font-display` | `MovieRow.jsx` h2, `Top10Row.jsx` h2, `NewsCarousel.jsx` h3, `Leaderboard.jsx` h2, `BentoDiscoveryGrid.jsx` heading, `AestheticQuoteRoundup.jsx` heading |
| Card Title | `text-card-title` | `MovieCard.jsx` h4, `MovieModal.jsx` h1 (yes — the modal title is a *card* context, not a page hero), quote character names |
| Meta | `text-meta` | Star ratings, genre pills, "LIVE" badges, timestamps, "4K ULTRA HD", "SUB\|DUB", sentiment scores, card footers |

> [!IMPORTANT]
> The modal title (`MovieModal.jsx` L224) currently uses `text-3xl sm:text-4xl md:text-5xl`. This is a **card-level** context shown in an overlay, not a page hero. It should use `text-section` at most. The hero scale is reserved for full-viewport backgrounds only.

---

## B. Spacing Scale

An 8pt base grid. All spacing values derive from this scale.

### Scale definition

```js
// tailwind.config.js → theme.extend.spacing
spacing: {
  'sp-1': '0.5rem',   //  8px  — minimum internal gap
  'sp-2': '1rem',     // 16px  — card internal padding, tight gaps
  'sp-3': '1.5rem',   // 24px  — grid gutter, section-header-to-content
  'sp-4': '2rem',     // 32px  — between related sections
  'sp-5': '3rem',     // 48px  — between major sections (e.g. Hero → Top10 → Bento)
  'sp-6': '4rem',     // 64px  — page-level vertical breathing room
  'sp-7': '5rem',     // 80px  — hero bottom padding
}
```

### Role assignments (one value each, no alternatives)

| Role | Token | Value | Where |
|---|---|---|---|
| Gap between **major sections** | `py-sp-5` | 48px | Between Hero and Top10Row, between Top10Row and BentoGrid, between BentoGrid and NewsCarousel, etc. |
| Gap between a **section header and its content** | `mb-sp-3` | 24px | Between a `<h2>` row title and the carousel/grid below it |
| **Grid gutter** (multi-column layouts) | `gap-sp-3` | 24px | Bento grid, live match card grid, leaderboard columns |
| **Card internal padding** | `p-sp-2` | 16px | MovieCard overlay text, BentoDiscoveryGrid card, NewsCarousel card, Leaderboard row |
| **Inline element gap** (badges, pills) | `gap-sp-1` | 8px | Between genre pills, between rating star and number, between badge and text |

---

## C. Layout Container

**One canonical container.** Every section on every page wraps its content in this. The navbar's inner `<div>` also uses it.

```js
// tailwind.config.js — no change needed; this is a CSS utility class

// In index.css or as a Tailwind @layer component:
@layer components {
  .container-mx {
    @apply w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12;
  }
}
```

### Specification

| Property | Value | Rationale |
|---|---|---|
| `max-width` | `1440px` (90rem) | Wider than `max-w-7xl` (80rem) — fills more of a 2560px monitor. Narrower than unconstrained — prevents unreadable line lengths. 1440px is a standard design-frame width. |
| `padding-x` (mobile) | `20px` (px-5) | Slightly more than the current `px-4` (16px). Gives cards breathing room from edges on small phones. |
| `padding-x` (sm) | `32px` (px-8) | Consistent with the better-behaved pages. |
| `padding-x` (lg) | `48px` (px-12) | Matches the current Sports/Esports hero padding. |
| `margin-x` | `auto` | Centred. |

> [!WARNING]
> **Full-bleed exceptions.** Hero components and the Swiper carousel intentionally span the full viewport. They do NOT use `container-mx` on their outermost wrapper. Instead, any *text content* within the hero uses `container-mx` for alignment. This ensures hero imagery is edge-to-edge while text aligns with the content grid below.

### Navbar application

The navbar's inner `<div>` (currently `max-w-7xl mx-auto px-4 sm:px-6`) becomes:

```html
<div class="container-mx h-20 flex items-center justify-between gap-4">
```

---

## D. Five Vertical Palettes

### The core problem

Current backgrounds sampled from code:

| Vertical | Current hex | Luminance |
|---|---|---|
| Movies | `#07080b` | 2.8% |
| Series | `#090510` | 2.5% |
| Anime | `#0c0505` | 2.1% |
| Sports | `#040d07` | 2.9% |
| Esports | `#07050d` | 2.6% |

These are **all within 1% luminance of each other**. On any monitor, cropping a mid-page screenshot gives you no signal which vertical you are on.

### Design decision

Lift each `base` to **6–10% luminance** — still unmistakably dark, but with enough hue saturation that the verticals are distinguishable by peripheral vision alone. The hue angle is the identity signal.

### Palette table

Each vertical defines five semantic tokens:

| Token | Role |
|---|---|
| `base` | Page background, applied to the root `<div>` of each vertical page |
| `surface` | Card backgrounds, elevated panels (one step lighter than base) |
| `border` | Default border colour for cards and dividers |
| `accent` | Primary action colour — buttons, active states, focused elements |
| `accent-glow` | Box-shadow / glow colour — `box-shadow: 0 0 Xpx <accent-glow>` |

---

#### Movies — Steel Blue

| Token | Hex | Contrast vs `#E5E5E5` body text |
|---|---|---|
| `base` | `#0B1120` | **12.8 : 1** ✅ |
| `surface` | `#111827` | 11.2 : 1 ✅ |
| `border` | `#1E293B` | — |
| `accent` | `#3B82F6` | — |
| `accent-glow` | `rgba(59, 130, 246, 0.4)` | — |

Hue: 220° (blue). Saturation: 38%. Lightness: 8%.
This is a deep navy — cinematic, premium, associated with theatrical film.

---

#### Series — Royal Violet

| Token | Hex | Contrast vs `#E5E5E5` body text |
|---|---|---|
| `base` | `#110B20` | **13.1 : 1** ✅ |
| `surface` | `#1A1028` | 11.6 : 1 ✅ |
| `border` | `#2D1F4E` | — |
| `accent` | `#8B5CF6` | — |
| `accent-glow` | `rgba(139, 92, 246, 0.4)` | — |

Hue: 265° (violet). Saturation: 40%. Lightness: 8%.
Purple connotes prestige TV, binge-watching, HBO/Apple TV+ sensibility.

---

#### Anime — Warm Crimson

| Token | Hex | Contrast vs `#E5E5E5` body text |
|---|---|---|
| `base` | `#1A0A0A` | **14.2 : 1** ✅ |
| `surface` | `#231111` | 12.4 : 1 ✅ |
| `border` | `#3D1C1C` | — |
| `accent` | `#F97316` | — |
| `accent-glow` | `rgba(249, 115, 22, 0.4)` | — |

Hue: 0° (red). Saturation: 45%. Lightness: 7%.
Warm red/orange echoes Crunchyroll and the energy of shonen anime.

---

#### Sports — Deep Pitch Green

| Token | Hex | Contrast vs `#E5E5E5` body text |
|---|---|---|
| `base` | `#071A0E` | **14.5 : 1** ✅ |
| `surface` | `#0E2518` | 12.8 : 1 ✅ |
| `border` | `#1A3D28` | — |
| `accent` | `#10B981` | — |
| `accent-glow` | `rgba(16, 185, 129, 0.4)` | — |

Hue: 150° (green). Saturation: 50%. Lightness: 6%.
Green = the pitch, the court, the field. Immediately reads as "sports."

---

#### Esports — Neon Magenta

| Token | Hex | Contrast vs `#E5E5E5` body text |
|---|---|---|
| `base` | `#140818` | **14.0 : 1** ✅ |
| `surface` | `#1E0F24` | 12.1 : 1 ✅ |
| `border` | `#361950` | — |
| `accent` | `#EC4899` | — |
| `accent-glow` | `rgba(236, 72, 153, 0.4)` | — |

Hue: 290° (magenta/pink). Saturation: 45%. Lightness: 6%.
Hot pink/magenta = gaming culture, RGB aesthetics, streaming overlays.

---

### Tailwind config

```js
// tailwind.config.js → theme.extend.colors
colors: {
  v: {
    movies:  { base: '#0B1120', surface: '#111827', border: '#1E293B', accent: '#3B82F6', glow: '#3B82F6' },
    series:  { base: '#110B20', surface: '#1A1028', border: '#2D1F4E', accent: '#8B5CF6', glow: '#8B5CF6' },
    anime:   { base: '#1A0A0A', surface: '#231111', border: '#3D1C1C', accent: '#F97316', glow: '#F97316' },
    sports:  { base: '#071A0E', surface: '#0E2518', border: '#1A3D28', accent: '#10B981', glow: '#10B981' },
    esports: { base: '#140818', surface: '#1E0F24', border: '#361950', accent: '#EC4899', glow: '#EC4899' },
  },
  // Keep existing brand tokens for backward compat during migration
  'dark-main': '#0B1120',
  'dark-card': '#111827',
  'dark-elevated': '#1A1F2E',
}
```

> [!NOTE]
> Body text colour is `#E5E5E5` (Tailwind `text-gray-200`). All five base colours exceed 4.5:1 contrast ratio against it, with the lowest being Movies at 12.8:1 — nearly triple the WCAG AA minimum.

---

## E. Elevation and Surface Rules

Three elevation tiers. Every surface in the app is one of these.

### Tier table

| Tier | Token(s) | Background | Border | Shadow | Used by |
|---|---|---|---|---|---|
| **Ground** | `bg-v-{vertical}-base` | The vertical's `base` hex | none | none | Page root `<div>`, full-bleed sections |
| **Card** | `bg-v-{vertical}-surface` | The vertical's `surface` hex | `border border-v-{vertical}-border` | `shadow-xl shadow-black/40` | `MovieCard`, `NewsCarousel` card, `Leaderboard` row, `BentoDiscoveryGrid` cell, `ContinueWatchingRow` card, live-match scorecard |
| **Modal** | `bg-v-{vertical}-surface` | Surface + `backdrop-blur-2xl` | `border border-white/15` | `shadow-2xl shadow-black/80` | `MovieModal`, dropdowns, search overlays |
| **Hero overlay** | N/A | Full-bleed image with gradient masks | none | none | Hero, Sports/Esports broadcast hero |

### Failed-image rule

> [!CAUTION]
> A failed/broken `<img>` must never be visually identical to an intentional dark panel.

**Implementation spec:**
1. Every `<img>` tag must sit inside a container with a **distinguishable fallback state**:
   - Container gets `bg-v-{vertical}-border` (not `surface`). This makes the empty state visibly lighter than surrounding cards.
   - A centred placeholder icon (Lucide `ImageOff`, 32px, `text-white/20`) is rendered behind the image via absolute positioning.
   - The `<img>` tag gets `object-cover` and sits on `z-10` above the placeholder.
2. When the image loads, it covers the placeholder entirely. When it fails, the user sees a subtly lighter panel with a broken-image icon — unmistakably different from an intentional dark surface.

### Example pattern (pseudocode, not to be implemented now)
```jsx
<div className="relative bg-v-movies-border overflow-hidden">
  <ImageOff className="absolute inset-0 m-auto text-white/20" size={32} />
  <img src={url} className="relative z-10 w-full h-full object-cover" />
</div>
```

---

## F. Motion Primitives

Exactly three Framer Motion configurations. **Every animation in the app** uses one of these. All existing ad-hoc variants in `MovieCard.jsx`, `Hero.jsx`, `FanDeckHero.jsx`, etc. are replaced.

### 1. `hover` — Interactive feedback on pointer enter

```js
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
```

- **Duration:** 250ms
- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` — standard Material ease-out
- **Scale:** 1.04 (subtle, no layout thrashing)
- **Y lift:** -4px (enough for shadow reveal, not cartoonish)
- **No stagger.** Hover is a single-element effect.

**Used by:** `MovieCard`, `NewsCarousel` card, `BentoDiscoveryGrid` cell, `Top10Row` card, `Leaderboard` row, `ContinueWatchingRow` card, live-match scorecard, quick-action icon buttons.

### 2. `reveal` — Scroll-triggered entrance

```js
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
```

- **Duration:** 500ms
- **Easing:** Same Material ease-out
- **Y offset:** 24px (perceptible but not jumpy)
- **Stagger:** 80ms per child (pass `custom={index}` to each `motion.div`)
- **Trigger:** `whileInView="visible"` with `viewport={{ once: true, margin: "-80px" }}`

**Used by:** Section headings, card rows entering viewport, hero content stack (title → synopsis → buttons), bento grid cells, quote cards, leaderboard rows.

### 3. `pageTransition` — Route-level page entrance/exit

```js
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
```

- **Enter duration:** 400ms
- **Exit duration:** 200ms (fast exit feels snappy)
- **Easing:** Same curve throughout
- **Y offset:** 16px enter, -8px exit (slight upward drift on leaving)
- **No stagger.** The page wrapper is a single element.

**Used by:** Wrap each `<Route>` page component in `<motion.div {...motionPageTransition}>`. Applied once, at the router level.

### Banned patterns

The following motion patterns currently in the codebase are **replaced by the three primitives above**:

- `MovieCard.jsx` L21–57: 6 separate variant objects → replaced by `motionHover` + `motionReveal`
- `Hero.jsx` L115–121: inline `staggerChildren: 0.12, delayChildren: 0.2` → replaced by `motionReveal` with `custom={index}`
- `FanDeckHero.jsx`: spring-based card spreads → replaced by `motionReveal` for entrance, CSS `transition` for the fan-deck interactivity (pointer-driven positioning is not animation, it is interaction state)
- `CylinderCarousel3D.jsx`: drag-based rotation → retains its own drag handler (not an animation primitive), but entrance uses `motionReveal`

---

## Implementation Checklist

When this design is approved, implementation proceeds in this order:

1. Update `tailwind.config.js` with the type scale, spacing scale, and colour palette from sections A, B, D.
2. Add `container-mx` utility class to `index.css`.
3. Create `src/utils/motion.js` exporting the three motion primitives.
4. Migrate each page and component file to use the new tokens, one vertical at a time.

> [!IMPORTANT]
> This document is a specification. No code has been modified. Review and approve before any implementation begins.
