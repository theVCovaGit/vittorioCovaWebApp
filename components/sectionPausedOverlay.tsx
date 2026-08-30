"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SectionKey } from "@/lib/sections";
import { useSectionSettings } from "@/hooks/useSectionSettings";

/**
 * Wraps a paused section: the page still renders underneath, covered by a light
 * gray veil and a big COMING SOON. Rendered in a portal on body so it sits above
 * the section's own fixed/high z-index layers.
 */
export default function SectionPausedOverlay({ section }: { section: SectionKey }) {
  const { settings, loaded } = useSectionSettings();
  const [mounted, setMounted] = useState(false);

  const isPaused = loaded && settings[section]?.paused === true;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Block scrolling of the content behind the veil while paused
  useEffect(() => {
    if (!isPaused) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("overflow", "hidden", "important");

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isPaused]);

  if (!mounted || !isPaused) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 2147483001,
        backgroundColor: "rgba(120, 118, 114, 0.35)",
      }}
      aria-live="polite"
    >
      <span
        className="font-blurlight uppercase select-none text-center px-6"
        style={{
          color: "#fff5e0",
          fontFamily: '"Blur Light", sans-serif',
          fontSize: "clamp(2.5rem, 11vw, 9rem)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        Coming soon
      </span>
    </div>,
    document.body
  );
}
