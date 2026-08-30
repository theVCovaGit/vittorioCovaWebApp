"use client";

import { useEffect, useState } from "react";
import {
  SectionKey,
  SectionSetting,
  defaultSectionSettings,
  isSectionKey,
} from "@/lib/sections";

export const SECTION_SETTINGS_UPDATED_EVENT = "section-settings-updated";

/**
 * Reads the admin section switches (hidden in menu / paused with "coming soon").
 * `loaded` is false until the fetch resolves so callers can avoid flashing a link
 * that is about to disappear. Falls back to everything visible on any failure.
 */
export function useSectionSettings() {
  const [settings, setSettings] = useState<Record<SectionKey, SectionSetting>>(
    defaultSectionSettings
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/sections", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;

        if (Array.isArray(data?.sections)) {
          const next = defaultSectionSettings();
          for (const entry of data.sections as SectionSetting[]) {
            if (isSectionKey(entry?.section)) {
              next[entry.section] = {
                section: entry.section,
                hidden: entry.hidden === true,
                paused: entry.paused === true,
              };
            }
          }
          setSettings(next);
        }
      } catch (error) {
        console.error("❌ Error fetching section settings:", error);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    fetchSettings();

    // Admin toggles broadcast this so open views update without a reload
    const handleUpdate = () => fetchSettings();
    window.addEventListener(SECTION_SETTINGS_UPDATED_EVENT, handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener(SECTION_SETTINGS_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return { settings, loaded };
}
