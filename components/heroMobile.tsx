"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .hero-center-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: hidden;
        }
        .hero-content-wrapper {
          position: relative;
          width: 85vw;
          max-width: 85vw;
          height: 100%;
        }
        @media (min-width: 640px) {
          .hero-content-wrapper {
            width: 75vw;
            max-width: 75vw;
          }
        }
      `}} />
      
      {/* Flex container - centers with responsive width */}
      <div className="hero-center-wrapper">
        <div className="hero-content-wrapper">
          {/* Single container: VCS at top, then V's and /\'s below — no overlap */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pt-32 overflow-auto z-0 flex justify-center items-start">
            <div className="w-fit flex flex-col">
              <Link href="/" className="flex flex-col items-start justify-start no-underline leading-none -space-y-3 mb-6">
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
              <SlashVPatternMobile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

