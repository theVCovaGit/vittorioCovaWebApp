/** Sections that can be hidden from the main menu or paused ("coming soon") from the admin panel. */
export const SECTION_KEYS = ["architecture", "art", "film", "news"] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface SectionSetting {
  section: SectionKey;
  hidden: boolean;
  paused: boolean;
}

export const isSectionKey = (value: unknown): value is SectionKey =>
  typeof value === "string" && (SECTION_KEYS as readonly string[]).includes(value);

/** Everything visible and running – used before settings load and when the API fails. */
export const defaultSectionSettings = (): Record<SectionKey, SectionSetting> =>
  SECTION_KEYS.reduce((acc, section) => {
    acc[section] = { section, hidden: false, paused: false };
    return acc;
  }, {} as Record<SectionKey, SectionSetting>);
