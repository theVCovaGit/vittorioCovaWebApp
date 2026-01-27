"use client";

import Link from "next/link";
import SlashVPatternMobile from "./slashVPatternMobile";

export default function HeroMobile() {
  return (
    <div className="min-h-screen bg-[#554943] relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .hero-content-container {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          height: 100%;
        }
        
        /* iPhone SE (375px) */
        @media (min-width: 375px) and (max-width: 390px) {
          .hero-content-container {
            width: 85%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        /* iPhone 12/13/14 (390px) */
        @media (min-width: 390px) and (max-width: 428px) {
          .hero-content-container {
            width: 85%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        /* iPhone 14 Pro Max (428px) */
        @media (min-width: 428px) and (max-width: 430px) {
          .hero-content-container {
            width: 85%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        /* Small tablets (640px - 768px) */
        @media (min-width: 640px) and (max-width: 768px) {
          .hero-content-container {
            width: 75%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        /* iPad (768px - 834px) */
        @media (min-width: 768px) and (max-width: 834px) {
          .hero-content-container {
            width: 75%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        /* iPad Pro (834px - 1024px) */
        @media (min-width: 834px) and (max-width: 1024px) {
          .hero-content-container {
            width: 75%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        
        /* Larger tablets and small desktops (1024px+) */
        @media (min-width: 1024px) {
          .hero-content-container {
            width: 75%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}} />
      
      {/* Content container - manually centered with breakpoints */}
      <div className="hero-content-container">
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
  );
}

