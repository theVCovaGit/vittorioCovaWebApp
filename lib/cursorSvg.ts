/** The uploaded cursor is stored as markup, so it can be recoloured like the built-in one. */

export const CURSOR_SETTING_KEY = "cursor_svg";
export const MAX_CURSOR_SVG_BYTES = 100_000;

const stripTag = (svg: string, tag: string) =>
  svg.replace(new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, "gi"), "");

/** Colour values are swapped for currentColor so the cursor keeps inverting; `none` is kept. */
const useCurrentColor = (svg: string) =>
  svg
    .replace(/(fill|stroke)\s*=\s*"(?!none")[^"]*"/gi, '$1="currentColor"')
    .replace(/(fill|stroke)\s*=\s*'(?!none')[^']*'/gi, "$1='currentColor'")
    .replace(/(fill|stroke)\s*:\s*(?!none)[^;"'}]+/gi, "$1:currentColor");

/**
 * Makes an uploaded SVG safe to inline and ready to sit in the cursor box:
 * no scripts or handlers, no fixed width/height, and a single adaptive colour.
 */
export function normalizeCursorSvg(raw: string): string | null {
  if (!raw || raw.length > MAX_CURSOR_SVG_BYTES) return null;

  let svg = raw.trim();

  // Drop the XML prolog / doctype / comments
  svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, "");
  svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, "");
  svg = svg.replace(/<!--[\s\S]*?-->/g, "");
  svg = svg.trim();

  const start = svg.toLowerCase().indexOf("<svg");
  const end = svg.toLowerCase().lastIndexOf("</svg>");
  if (start === -1 || end === -1) return null;
  svg = svg.slice(start, end + "</svg>".length);

  // Nothing executable, nothing remote
  svg = stripTag(svg, "script");
  svg = stripTag(svg, "foreignObject");
  svg = svg.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  svg = svg.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  svg = svg.replace(/javascript:/gi, "");

  svg = useCurrentColor(svg);

  // Let the 28 x 28 cursor box drive the size; keep the viewBox for the shape
  svg = svg.replace(/^<svg([^>]*)>/i, (_match, attrs: string) => {
    const cleaned = attrs
      .replace(/\s(width|height)\s*=\s*"[^"]*"/gi, "")
      .replace(/\s(width|height)\s*=\s*'[^']*'/gi, "")
      .replace(/\spreserveAspectRatio\s*=\s*"[^"]*"/gi, "")
      .replace(/\spreserveAspectRatio\s*=\s*'[^']*'/gi, "");
    // "none" stretches the art to fill the box, exactly like the built-in cursor
    return `<svg${cleaned} width="100%" height="100%" preserveAspectRatio="none" fill="currentColor">`;
  });

  return svg.includes("<svg") ? svg : null;
}
