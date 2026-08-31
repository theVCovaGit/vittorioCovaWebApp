/** Editable copy for /about and /contact, stored as JSON in site_settings. */

export const ABOUT_CONTENT_KEY = "about_content";
export const CONTACT_CONTENT_KEY = "contact_content";

export interface AboutContent {
  /** One line per newline – desktop joins them, mobile keeps the breaks. */
  heading: string;
  /**
   * The whole body as typed: blank lines separate paragraphs, single line
   * breaks and spacing are kept, and *asterisks* highlight a word.
   */
  body: string;
}

export interface ContactContent {
  instagram: string;
  email: string;
  locations: string[];
  /** One line per entry. */
  copyright: string[];
}

const DEFAULT_ABOUT_PARAGRAPHS = [
    "The greatest moment in human history was not when man walked the Moon, but when *God* walked the Earth.",
    "Tell yourself that pain is a reminder that you live, discomfort is *growth*, and a privilege.",
    "If you have no *ideas*, there is no project. If you have many ideas, there is still no project.",
    "True *passion* glues together teamwork. Genuine connections are the oxygen that catalyze success.",
    "Silence is a *beautiful* thing.",
    "*Nature* is Mother, it will serve as a *sanctuary*, offering both mental clarity and a wellspring of inspiration.",
    "Let *gratitude* nourish your passions. *Live* the world, don't let it live you.",
  "Even if it's hard, be the *smile* that someone may need.",
];

export const defaultAboutContent = (): AboutContent => ({
  heading: "A multi-faceted architecture and\ncreative design firm\nfounded in 2025",
  body: DEFAULT_ABOUT_PARAGRAPHS.join("\n\n"),
});

export const defaultContactContent = (): ContactContent => ({
  instagram: "@vittoriocova_studio",
  email: "studio@vittoriocova.com",
  locations: ["Mexico City", "Houston", "Florence"],
  copyright: ["© Vittorio Cova Studio", "All rights reserved."],
});

const asStringList = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return fallback;
  const list = value.filter((item): item is string => typeof item === "string");
  return list.length ? list : fallback;
};

/** Never throws – anything malformed falls back to the built-in copy. */
export function parseAboutContent(value: unknown): AboutContent {
  const defaults = defaultAboutContent();
  if (!value || typeof value !== "object") return defaults;

  const raw = value as Partial<AboutContent> & { paragraphs?: unknown };
  // Older saves kept the body as a list of paragraphs
  const legacy = Array.isArray(raw.paragraphs)
    ? asStringList(raw.paragraphs, []).join("\n\n")
    : "";

  const body = typeof raw.body === "string" && raw.body.trim() ? raw.body : legacy;

  return {
    heading: typeof raw.heading === "string" && raw.heading.trim() ? raw.heading : defaults.heading,
    body: body || defaults.body,
  };
}

export function parseContactContent(value: unknown): ContactContent {
  const defaults = defaultContactContent();
  if (!value || typeof value !== "object") return defaults;

  const raw = value as Partial<ContactContent>;
  return {
    instagram: typeof raw.instagram === "string" ? raw.instagram : defaults.instagram,
    email: typeof raw.email === "string" ? raw.email : defaults.email,
    locations: asStringList(raw.locations, defaults.locations),
    copyright: asStringList(raw.copyright, defaults.copyright),
  };
}
