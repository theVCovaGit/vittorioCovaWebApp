"use client";

import { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import SignatureAnimation from "./signatureAnimation";
import { useShowMobileLayout } from "@/hooks/useMediaQuery";
import { INTRO_FINISHED_EVENT } from "@/hooks/useIntroFinished";
import { useCustomCursor } from "@/hooks/useCustomCursor";

const CURSOR_LIGHT = "#fff3df";

type Rgba = { r: number; g: number; b: number; a: number };

/** Computed styles always come back as rgb()/rgba(), so parse them directly. */
function parseComputedColor(value: string): Rgba | null {
  if (!value || value === "transparent" || value === "none") return null;
  const m = value.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?/i
  );
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
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

/** Grace, in px, around a glyph so the cursor flips as it touches a letter. */
const TEXT_HIT_TOLERANCE = 1;
/** Half the cap height as a share of the font size (a line box is far taller). */
const GLYPH_HALF_BAND = 0.35;

function caretAtPoint(x: number, y: number): { node: Node; offset: number } | null {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (typeof doc.caretRangeFromPoint === "function") {
    const range = doc.caretRangeFromPoint(x, y);
    if (range) return { node: range.startContainer, offset: range.startOffset };
  }
  if (typeof doc.caretPositionFromPoint === "function") {
    const pos = doc.caretPositionFromPoint(x, y);
    if (pos) return { node: pos.offsetNode, offset: pos.offset };
  }
  return null;
}

/** The colour of the glyph the cursor is actually touching, measured per character. */
function textColorAt(x: number, y: number): Rgba | null {
  const hit = caretAtPoint(x, y);
  if (!hit || hit.node.nodeType !== Node.TEXT_NODE) return null;

  const text = hit.node.textContent ?? "";
  const el = hit.node.parentElement;
  if (!el) return null;

  const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
  const halfBand = fontSize * GLYPH_HALF_BAND + TEXT_HIT_TOLERANCE;
  const range = document.createRange();

  // The caret sits between two characters - test the one on either side
  for (const [start, end] of [
    [hit.offset, hit.offset + 1],
    [hit.offset - 1, hit.offset],
  ]) {
    if (start < 0 || end > text.length) continue;
    if (!text.slice(start, end).trim()) continue; // whitespace has no ink

    range.setStart(hit.node, start);
    range.setEnd(hit.node, end);
    const rect = range.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;

    const midY = rect.top + rect.height / 2;
    const insideX = x >= rect.left - TEXT_HIT_TOLERANCE && x <= rect.right + TEXT_HIT_TOLERANCE;
    const insideY = y >= midY - halfBand && y <= midY + halfBand;
    if (insideX && insideY) return parseComputedColor(getComputedStyle(el).color);
  }
  return null;
}

/** The painted fill of an SVG shape (barcode, icons) under the cursor. */
function svgFillAt(x: number, y: number): Rgba | null {
  const el = document.elementFromPoint(x, y);
  if (!(el instanceof SVGGraphicsElement) || el instanceof SVGSVGElement) return null;
  return parseComputedColor(getComputedStyle(el).fill);
}

/**
 * Backgrounds composited front-to-back, so translucent layers (the paused veil,
 * tinted panels) count for what they actually contribute rather than being
 * treated as opaque or skipped.
 */
function backgroundAt(x: number, y: number): Rgba | null {
  let el: Element | null = document.elementFromPoint(x, y);
  let r = 0, g = 0, b = 0, a = 0;

  for (let i = 0; i < 30 && el && a < 0.999; i++) {
    const c = parseComputedColor(getComputedStyle(el).backgroundColor);
    if (c && c.a > 0) {
      const w = c.a * (1 - a);
      r += c.r * w;
      g += c.g * w;
      b += c.b * w;
      a += w;
    }
    el = el.parentElement;
  }
  return a > 0 ? { r: r / a, g: g / a, b: b / a, a } : null;
}

/** Whatever is visually under the cursor, nearest-to-the-eye first. */
function visualColorAt(x: number, y: number): Rgba | null {
  if (typeof document === "undefined") return null;
  return svgFillAt(x, y) ?? textColorAt(x, y) ?? backgroundAt(x, y);
}

export default function IntroWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorColor, setCursorColor] = useState(CURSOR_LIGHT);
  const [cursorVisible, setCursorVisible] = useState(false);
  const customCursorSvg = useCustomCursor();
  const isMobile = useShowMobileLayout();
  const isHeroPage = pathname === "/";

  const updateCursor = useCallback((clientX: number, clientY: number) => {
    setCursorVisible(true);
    setCursorPos({ x: clientX, y: clientY });
    const sample = () => {
      const rgb = visualColorAt(clientX, clientY);
      if (rgb) setCursorColor(spectrumCursorColor(rgb.r, rgb.g, rgb.b));
    };
    // Hover colours land after this event, so take a second look once settled
    sample();
    requestAnimationFrame(sample);
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
          className="pointer-events-none fixed will-change-transform"
          style={{
            // Above every overlay (e.g. the paused "coming soon" screen)
            zIndex: 2147483647,
            left: cursorPos.x + 4,
            top: cursorPos.y + 4,
            width: 28,
            height: 28,
            transform: "translate(-50%, -50%)",
            cursor: "none",
          }}
          aria-hidden
        >
          {customCursorSvg ? (
            /* Uploaded in the admin – stretched into the same box and recoloured */
            <div
              className="w-full h-full"
              style={{ color: cursorColor }}
              dangerouslySetInnerHTML={{ __html: customCursorSvg }}
            />
          ) : (
            <svg viewBox="0 0 14 28" className="w-full h-full" style={{ color: cursorColor }}>
              <text x="0" y="21.65" fill="currentColor" fontFamily="Blur Light, Blur, sans-serif" fontSize="27" letterSpacing="-0.08em">+</text>
            </svg>
          )}
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

