"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SectionKey } from "@/lib/sections";
import { useSectionSettings } from "@/hooks/useSectionSettings";
import { useSession } from "@/hooks/useSession";
import { useIntroFinished } from "@/hooks/useIntroFinished";

/**
 * Wraps a paused section. Visitors get a light gray veil, a big COMING SOON and a
 * way back. Signed-in users (vittorio / jaime) browse the section normally and
 * only get a small note in the top right corner.
 * Nothing shows until the signature intro has finished playing.
 */
export default function SectionPausedOverlay({ section }: { section: SectionKey }) {
  const { settings, loaded } = useSectionSettings();
  const { isStaff, loaded: sessionLoaded } = useSession();
  const introFinished = useIntroFinished();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isPaused =
    loaded && sessionLoaded && introFinished && settings[section]?.paused === true;
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

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

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
      className="fixed inset-0 flex flex-col items-center justify-center"
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
      <button
        type="button"
        onClick={goBack}
        className="font-blurlight uppercase cursor-pointer bg-transparent p-0"
        style={{
          color: "#fff5e0",
          fontFamily: '"Blur Light", sans-serif',
          fontSize: "clamp(1rem, 2.2vw, 1.75rem)",
          letterSpacing: "-0.02em",
          marginTop: "clamp(0.75rem, 2vw, 1.5rem)",
          opacity: 0.75,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
      >
        Go back
      </button>
    </div>,
    document.body
  );
}
