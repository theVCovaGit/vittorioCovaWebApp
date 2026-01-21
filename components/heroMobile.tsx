"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden flex flex-col">
      {/* Wavy pattern background (desktop-style, scaled for mobile) */}
      <SlashVPatternMobile />

      {/* VITTORIO COVA STUDIO© - Aligned with pattern, right above it */}
      <div className="absolute top-10 left-0 w-full z-50 flex items-start justify-start">
        <div className="ml-9">
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
        </div>
      </div>
    </div>
  );
}

