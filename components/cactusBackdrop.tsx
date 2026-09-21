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
    </pre>
  );
}
