"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden">
      {/* Simple flex container - centers everything */}
      <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
        {/* Content container - centered via flex, both pattern and text live here */}
        <div className="relative w-full max-w-[85%] sm:max-w-[75%] h-full">
          {/* Pattern wrapper - absolutely positioned, left: 0 */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pt-32 overflow-hidden z-0">
            <SlashVPatternMobile />
          </div>
          
          {/* Text - absolutely positioned, left: 0, same parent = guaranteed alignment */}
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

