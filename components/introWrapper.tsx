"use client";

import { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
// import SignatureAnimation from "./signatureAnimation";
import LoadingSpinner from "./loadingSpinner";
import { useIsMobile } from "@/hooks/useMediaQuery";

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

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function spectrumCursorColor(r: number, g: number, b: number): string {
  const L = luminance(r, g, b);
  const darkL = luminance(85, 73, 67);
  const lightL = luminance(255, 243, 223);
  const t = Math.max(0, Math.min(1, (L - darkL) / (lightL - darkL)));
  const r1 = 255, g1 = 243, b1 = 223, r2 = 85, g2 = 73, b2 = 67;
  return `rgb(${Math.round(r1 * (1 - t) + r2 * t)},${Math.round(g1 * (1 - t) + g2 * t)},${Math.round(b1 * (1 - t) + b2 * t)})`;
}

function getBackgroundAt(x: number, y: number): { r: number; g: number; b: number } | null {
  if (typeof document === "undefined") return null;
  let el: Element | null = document.elementFromPoint(x, y);
  for (let i = 0; i < 20 && el; i++) {
    const bg = el instanceof HTMLElement ? getComputedStyle(el).backgroundColor : null;
    const rgb = bg ? parseColorToRgb(bg) : null;
    if (rgb) return rgb;
    el = el.parentElement;
  }
  return null;
}

export default function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorColor, setCursorColor] = useState(CURSOR_LIGHT);
  const [cursorVisible, setCursorVisible] = useState(false);
  const isMobile = useIsMobile();

  const updateCursor = useCallback((clientX: number, clientY: number) => {
    setCursorVisible(true);
    setCursorPos({ x: clientX, y: clientY });
    const rgb = getBackgroundAt(clientX, clientY);
    if (rgb) setCursorColor(spectrumCursorColor(rgb.r, rgb.g, rgb.b));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showIntro || !mounted) return;
    const timer = setTimeout(() => setShowIntro(false), 3400);
    return () => clearTimeout(timer);
  }, [showIntro, mounted]);

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
        <div className="fixed inset-0 z-[60000] bg-[#fff3df] flex items-center justify-center" data-intro-animation="true">
          {/* Replaced signature animation with loading spinner */}
          <LoadingSpinner />
          {/* <div className="relative w-full h-full">
            <SignatureAnimation />
          </div> */}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showIntro ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}

