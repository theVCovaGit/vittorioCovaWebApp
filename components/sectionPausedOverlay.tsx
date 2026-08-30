"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SectionKey } from "@/lib/sections";
import { useSectionSettings } from "@/hooks/useSectionSettings";
import { useSession } from "@/hooks/useSession";

/**
 * Wraps a paused section. Visitors get a light gray veil and a big COMING SOON.
 * Signed-in users (vittorio / jaime) browse the section normally and only get a
 * small note in the top right corner.
 */
export default function SectionPausedOverlay({ section }: { section: SectionKey }) {
  const { settings, loaded } = useSectionSettings();
  const { isStaff, loaded: sessionLoaded } = useSession();
  const [mounted, setMounted] = useState(false);

  const isPaused = loaded && sessionLoaded && settings[section]?.paused === true;
  const veilVisitor = isPaused && !isStaff;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Block scrolling of the content behind the veil while paused
  useEffect(() => {
    if (!veilVisitor) return;

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
  }, [veilVisitor]);

  if (!mounted || !isPaused) {
    return null;
  }

  if (isStaff) {
    return createPortal(
      <div
        className="fixed top-4 right-6 pointer-events-none font-blurlight"
        style={{
          zIndex: 2147483001,
          backgroundColor: "rgba(85, 73, 67, 0.9)",
          color: "#fff5e0",
          fontFamily: '"Blur Light", sans-serif',
          fontSize: "14px",
          padding: "6px 12px",
          borderRadius: "6px",
        }}
      >
        This section is on pause
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 2147483001,
        backgroundColor: "rgba(120, 118, 114, 0.72)",
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
