"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden flex flex-col">
      {/* Wavy pattern background (desktop-style, scaled for mobile) */}
      <SlashVPatternMobile />

      {/* VITTORIO COVA STUDIO© - Aligned with left edge of centered pattern */}
      <style dangerouslySetInnerHTML={{__html: `
        .vittorio-text-wrapper {
          position: absolute;
          top: 4rem;
          left: calc((100% - 80%) / 2);
          z-index: 50;
        }
        @media (min-width: 640px) {
          .vittorio-text-wrapper {
            left: calc((100% - 75%) / 2);
          }
        }
      `}} />
      <div className="vittorio-text-wrapper">
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
  );
}

