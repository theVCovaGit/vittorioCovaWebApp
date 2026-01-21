"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden flex flex-col">
      {/* Wavy pattern background (desktop-style, scaled for mobile) */}
      <SlashVPatternMobile />

      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#554943] flex items-start justify-start px-4 pt-4" style={{ height: 'var(--mobile-header-height)' }}>
        <Link href="/" className="flex flex-col items-start justify-start no-underline leading-none">
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
      </header>
    </div>
  );
}

