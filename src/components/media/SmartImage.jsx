import { useState, useCallback } from "react";
import { ImageOff } from "lucide-react";

/**
 * SmartImage — the single image primitive for the entire app.
 *
 * Features:
 *  - Shimmer skeleton while loading (surface + border tokens from DESIGN.md)
 *  - On error: gradient fallback tinted with the vertical's accent, showing title initials
 *    at hero-weight type. Visually distinct from any intentional dark panel (uses border token bg)
 *  - Never lets alt text become visible body text (alt="" on decorative, aria-hidden on fallback)
 *  - loading="lazy" and explicit width/height (caller controls via className)
 *  - Accepts `vertical` prop so fallback tint is correct
 *
 * DESIGN.md surface / border / accent tokens used:
 *   movies:  surface #111827, border #1E293B, accent #3B82F6
 *   series:  surface #1A1028, border #2D1F4E, accent #8B5CF6
 *   anime:   surface #231111, border #3D1C1C, accent #F97316
 *   sports:  surface #0E2518, border #1A3D28, accent #10B981
 *   esports: surface #1E0F24, border #361950, accent #EC4899
 */

const VERTICAL_TOKENS = {
  movies:  { border: "#1E293B", accent: "#3B82F6", glow: "rgba(59,130,246,0.25)" },
  series:  { border: "#2D1F4E", accent: "#8B5CF6", glow: "rgba(139,92,246,0.25)" },
  anime:   { border: "#3D1C1C", accent: "#F97316", glow: "rgba(249,115,22,0.25)" },
  sports:  { border: "#1A3D28", accent: "#10B981", glow: "rgba(16,185,129,0.25)" },
  esports: { border: "#361950", accent: "#EC4899", glow: "rgba(236,72,153,0.25)" },
};

function getInitials(title) {
  if (!title) return "?";
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const SmartImage = ({
  src,
  alt = "",
  title = "",
  vertical = "movies",
  className = "",
  imgClassName = "",
  objectFit = "cover",
  decorative = false,
  width,
  height,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const tokens = VERTICAL_TOKENS[vertical] || VERTICAL_TOKENS.movies;
  const initials = getInitials(title || alt);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    setLoaded(true);
    setErrored(true);
  }, []);

  // aria-hidden for decorative images so they're invisible to screen readers
  const ariaProps = decorative ? { "aria-hidden": true } : {};

  return (
    /* Outer wrapper: always has the border-token bg so a failed load is a
       visibly lighter panel (≠ intentional dark surface), with an ImageOff icon */
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: tokens.border }}
      {...ariaProps}
    >
      {/* Shimmer skeleton — visible while loading, hidden after */}
      {!loaded && (
        <div
          className="absolute inset-0 z-20 animate-shimmer"
          style={{
            background: `linear-gradient(
              90deg,
              ${tokens.border} 0%,
              color-mix(in srgb, ${tokens.border} 60%, white 10%) 40%,
              ${tokens.border} 80%
            )`,
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Error fallback — gradient + initials. Only shown after confirmed failure */}
      {errored ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 select-none"
          style={{
            background: `radial-gradient(ellipse at center, ${tokens.glow} 0%, ${tokens.border} 100%)`,
          }}
          aria-hidden
        >
          <ImageOff size={28} style={{ color: `${tokens.accent}55` }} />
          <span
            className="font-black text-white/60 tracking-tight"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              lineHeight: 1,
              fontFamily: "inherit",
            }}
          >
            {initials}
          </span>
        </div>
      ) : (
        /* The real image sits at z-10, covering the shimmer and the fallback icon */
        <img
          src={src}
          alt={decorative ? "" : alt}
          loading="lazy"
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
          style={{ objectFit }}
          {...rest}
        />
      )}

      {/* Permanent low-opacity background fallback icon (visible through shimmer region) */}
      {!errored && (
        <div className="absolute inset-0 flex items-center justify-center z-0" aria-hidden>
          <ImageOff size={32} style={{ color: `${tokens.accent}22` }} />
        </div>
      )}
    </div>
  );
};

export default SmartImage;
