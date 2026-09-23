/**
 * Section — canonical layout primitive for MoviesMax.
 *
 * Implements the container-mx layout from DESIGN.md §C.
 *   max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12
 *
 * Every section-level component in the app must wrap its content in <Section>.
 * This guarantees a single, consistent left/right edge across:
 *   - Navbar inner content
 *   - Hero text block
 *   - BentoDiscoveryGrid
 *   - MovieRow, Top10Row, NewsCarousel
 *   - AestheticQuoteRoundup
 *   - Explore grid, Watchlist page
 *
 * Props:
 *   as       — HTML element to render (default "section")
 *   className — extra classes merged onto the container (e.g. py-sp-5)
 *   fullBleed — if true, skips the horizontal padding (use for full-width bg bands
 *               where only the *inner* text uses Section again)
 *   children  — content
 */
const Section = ({ as: Tag = "section", className = "", fullBleed = false, children, ...rest }) => {
  return (
    <Tag
      className={`container-mx ${fullBleed ? "" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Section;
