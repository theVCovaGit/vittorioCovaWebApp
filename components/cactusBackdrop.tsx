import { CACTUS_ART } from "@/lib/cactusArt";

/**
 * Decorative ASCII cactus behind the desktop hero.
 *
 * Every value below is derived from the design PDF (Arial 3.72pt, 1.403pt
 * tracking, 8.33pt line pitch, rows centred, on a 1080pt-wide page) and kept in
 * vw so it scales with the page exactly like the PDF does. The typography is
 * fixed: the rows only line up in Arial metrics, so this does not use the site
 * display font. Do not convert these to px/rem or add a max-width.
 */
export default function CactusBackdrop() {
  return (
    <pre
      aria-hidden="true"
      // Desktop only – mobile gets its own treatment later
      className="hidden lg:block"
      style={{
        position: "absolute",
        top: "5.55vw",
        left: "34.52%",
        transform: "translateX(-50%)",
        margin: 0,
        whiteSpace: "pre",
        textAlign: "center",
        fontFamily: 'Arial, Helvetica, "Liberation Sans", sans-serif',
        fontSize: "0.3444vw",
        letterSpacing: "0.3772em",
        lineHeight: 2.24,
        color: "#CEA267",
        zIndex: 0,
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {CACTUS_ART}
      {/*
        Anchored to the <pre>, not the viewport, so it holds its place over the
        art at any width. Absolute positioning also keeps it out of the inline
        flow, so it cannot disturb the preformatted rows. currentColor inherits
        the art's own colour above.
      */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{
          position: "absolute",
          // Measured off the design mockup, as a share of the art block
          left: "51.8%",
          top: "39.6%",
          width: "14.6%",
          aspectRatio: "1 / 1",
          // The mockup's lines are far fainter than a solid #CEA267 hairline:
          // they sit at about the weight of the surrounding ASCII texture
          opacity: 0.45,
          pointerEvents: "none",
        }}
      >
        <rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/*
          Inscribed: the rect's stroke centreline spans 0.5-99.5, so the centre
          is 50,50 and the perpendicular centre-to-edge distance is 49.5. The
          circle is tangent to all four sides, as in the mockup.
        */}
        <circle
          cx="50"
          cy="50"
          r="49.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </pre>
  );
}
