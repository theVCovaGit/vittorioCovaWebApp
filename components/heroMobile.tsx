"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        .pattern-aligned-container {
          position: absolute;
          top: 4rem;
          left: 0;
          width: 100%;
          z-index: 50;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
        .pattern-aligned-inner {
          width: var(--pattern-mobile-width, 85%);
          max-width: var(--pattern-mobile-width, 85%);
          margin-left: auto;
          margin-right: auto;
        }
      `}} />
      {/* Wavy pattern background (desktop-style, scaled for mobile) */}
      <SlashVPatternMobile />

      {/* VITTORIO COVA STUDIO© - Aligned with pattern, right above it */}
      {/* Using same container structure as pattern for perfect alignment */}
      <div className="pattern-aligned-container">
        <div className="pattern-aligned-inner">
          <Link href="/" className="flex flex-col items-start justify-start no-underline leading-none -space-y-3">
            <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
              VITTORIO
            </span>
            <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
              COVA
            </span>
            <span className="text-[#fec776] font-blurlight text-2xl font-bold uppercase tracking-wide">
              STUDIO©
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

