"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden flex flex-col">
      {/* Centered container - both pattern and text are children */}
      <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
        <div className="relative w-full max-w-[85%] sm:max-w-[75%] h-full">
          {/* Pattern - fills container, starts at left: 0 */}
          <div className="absolute inset-0 pt-32 overflow-hidden z-0 left-0 right-0">
            <SlashVPatternMobile />
          </div>
          
          {/* Text - also starts at left: 0, guaranteed to align */}
          <div className="absolute top-16 left-0 z-50">
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
    </div>
  );
}

