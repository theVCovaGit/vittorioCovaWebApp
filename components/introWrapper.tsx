"use client";

import { useCallback, useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import SignatureAnimation from "./signatureAnimation";
import { useShowMobileLayout } from "@/hooks/useMediaQuery";
import { INTRO_FINISHED_EVENT } from "@/hooks/useIntroFinished";

const CURSOR_LIGHT = "#fff3df";

function parseColorToRgb(cssColor: string): { r: number; g: number; b: number } | null {
  if (!cssColor || cssColor === "transparent" || cssColor === "rgba(0, 0, 0, 0)") return null;
  const el = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!el) return null;
  el.style.color = cssColor;
  el.style.display = "none";
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);
  const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  const hex = computed.match(/#([0-9a-fA-F]{6})/);
  if (hex) {
    const h = hex[1];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l };

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  return { h: (h * 60 + 360) % 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rp = 0, gp = 0, bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

/** The exact opposite of what is under the cursor: hue turned 180°, lightness flipped. */
function oppositeColor(r: number, g: number, b: number): string {
  const { h, s, l } = rgbToHsl(r, g, b);
  const oppositeHue = (h + 180) % 360;
  let oppositeL = 1 - l;

  // Mid-tones flip onto themselves (a 50% grey stays a 50% grey) – push them apart
  if (Math.abs(oppositeL - l) < 0.2) {
    oppositeL = l < 0.5 ? Math.min(1, l + 0.35) : Math.max(0, l - 0.35);
  }

  const { r: nr, g: ng, b: nb } = hslToRgb(oppositeHue, s, oppositeL);
  return `rgb(${nr},${ng},${nb})`;
}

/** True when (x, y) falls inside one of the element's own text lines. */
function pointIsOverText(el: Element, x: number, y: number): boolean {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;

    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects())) {
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return true;
      }
    }
  }
  return false;
}

/**
 * What the cursor is sitting on: the text colour when it is over a word,
 * otherwise the first painted background behind it.
 */
function getColorAt(x: number, y: number): { r: number; g: number; b: number } | null {
  if (typeof document === "undefined") return null;

  const target = document.elementFromPoint(x, y);

  if (target instanceof HTMLElement && pointIsOverText(target, x, y)) {
    const rgb = parseColorToRgb(getComputedStyle(target).color);
    if (rgb) return rgb;
  }

  let el: Element | null = target;
  for (let i = 0; i < 20 && el; i++) {
    const bg = el instanceof HTMLElement ? getComputedStyle(el).backgroundColor : null;
    const rgb = bg ? parseColorToRgb(bg) : null;
    if (rgb) return rgb;
    el = el.parentElement;
  }
  return null;
}

export default function IntroWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorColor, setCursorColor] = useState(CURSOR_LIGHT);
  const [cursorVisible, setCursorVisible] = useState(false);
  const isMobile = useShowMobileLayout();
  const isHeroPage = pathname === "/";

  const sampleTimers = useRef<number[]>([]);

  const updateCursor = useCallback((clientX: number, clientY: number) => {
    setCursorVisible(true);
    setCursorPos({ x: clientX, y: clientY });

    const sample = () => {
      const rgb = getColorAt(clientX, clientY);
      if (rgb) setCursorColor(oppositeColor(rgb.r, rgb.g, rgb.b));
    };

    // Hover colours land after this event and then fade in over a transition,
    // so sample again once the element under the cursor has settled
    sampleTimers.current.forEach(clearTimeout);
    sampleTimers.current = [];
    sample();
    requestAnimationFrame(sample);
    sampleTimers.current.push(
      window.setTimeout(sample, 120),
      window.setTimeout(sample, 300)
    );
  }, []);

  useEffect(() => {
    const timers = sampleTimers;
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showIntro || !mounted) return;
    const timer = setTimeout(() => setShowIntro(false), 3400);
    return () => clearTimeout(timer);
  }, [showIntro, mounted]);

  // Let overlays (e.g. the paused "coming soon" screen) wait for the signature
  useEffect(() => {
    if (mounted && !showIntro) {
      window.dispatchEvent(new CustomEvent(INTRO_FINISHED_EVENT));
    }
  }, [mounted, showIntro]);

  /* Set attribute immediately (before paint) to prevent native cursor flash */
  useLayoutEffect(() => {
    if (isMobile) {
      document.documentElement.removeAttribute("data-custom-cursor");
    } else {
      document.documentElement.setAttribute("data-custom-cursor", "true");
    }
    return () => document.documentElement.removeAttribute("data-custom-cursor");
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const move = (e: MouseEvent) => updateCursor(e.clientX, e.clientY);
    const hide = () => setCursorVisible(false);
    document.body.addEventListener("mousemove", move, { passive: true });
    document.body.addEventListener("mouseleave", hide);
    return () => {
      document.body.removeEventListener("mousemove", move);
      document.body.removeEventListener("mouseleave", hide);
    };
  }, [updateCursor, isMobile]);

  return (
    <>
      {showIntro && (
        <div className="fixed inset-0 z-[60000] bg-[#554943] flex items-center justify-center" data-intro-animation="true">
          <div className="relative w-full h-full">
            <SignatureAnimation />
          </div>
        </div>
      )}
      {!isMobile && cursorVisible && (
        <div
          className="pointer-events-none fixed z-[999999] will-change-transform"
          style={{
            left: cursorPos.x + 4,
            top: cursorPos.y + 4,
            width: 28,
            height: 28,
            transform: "translate(-50%, -50%)",
            cursor: "none",
          }}
          aria-hidden
        >
          <svg viewBox="0 0 14 28" className="w-full h-full" style={{ color: cursorColor }}>
            <text x="0" y="21.65" fill="currentColor" fontFamily="Blur Light, Blur, sans-serif" fontSize="27" letterSpacing="-0.08em">+</text>
          </svg>
        </div>
      )}
      <motion.div
        className={isHeroPage ? "intro-content hero-page" : "intro-content"}
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showIntro ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}

