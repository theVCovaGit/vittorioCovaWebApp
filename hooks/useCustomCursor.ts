"use client";

import { useEffect, useState } from "react";

export const CURSOR_UPDATED_EVENT = "site-cursor-updated";

/** The cursor uploaded in the admin, or null to use the built-in + cursor. */
export function useCustomCursor() {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCursor = async () => {
      try {
        const res = await fetch("/api/cursor", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setSvg(typeof data?.svg === "string" && data.svg ? data.svg : null);
      } catch (error) {
        console.error("❌ Error fetching cursor:", error);
      }
    };

    fetchCursor();

    const handleUpdate = () => fetchCursor();
    window.addEventListener(CURSOR_UPDATED_EVENT, handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener(CURSOR_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return svg;
}
