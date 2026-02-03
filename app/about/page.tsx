"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import AboutLabel from "@/components/aboutLabel";
import InteractiveFingie from "@/components/interactiveFingie";
import AboutMobile from "@/components/aboutMobile";




const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[40vh]",
    right: "right-[2vw] sm:right-[3vw] md:right-[6.9vw]",
    scale: "scale-[0.5] sm:scale-[0.7] md:scale-[0.55]",
    fontSize: "text-[64px] sm:text-[84px] md:text-[90px]",
  };
  
  
export default function About() {
  const isMobile = useIsMobile();

  // Mobile version
  if (isMobile) {
    return <AboutMobile />;
  }

  // Desktop version (original)
  return (
    <main className="relative min-h-screen bg-[#fff3df] text-[#a08e80] font-blurlight overflow-hidden">
        

      <div 
        className="absolute"
        style={{
          left: 'var(--barcode-left, 0)',
          bottom: 'calc(var(--barcode-bottom-offset, 80px) - 1rem)',
        }}
      >
        <AboutLabel
          bottom="bottom-0"
          left="left-0"
          scale={labelStyles.scale}
          fontSize={labelStyles.fontSize}
          transformOrigin="top left"
        />
      </div>

      {/* Fingerprint: aligned with footer "O" horizontally, 9rem above barcode, smaller, desktop only */}
      <div
        className="fixed z-[1002] overflow-visible hidden md:block origin-center"
        style={{
          left: "var(--about-o-center-x, 50%)",
          top: "calc(var(--about-o-center-y, 50%) - 9rem)",
          transform: "translate(-50%, -50%) scale(0.5)",
        }}
      >
        <InteractiveFingie />
      </div>

      {/* Text content: left-aligned, responsive inset and spacing (desktop only) */}
      <div className="absolute left-6 sm:left-12 md:left-20 top-[6rem] sm:top-[7rem] md:top-[8rem] right-4 sm:right-8 md:right-12 bottom-32 max-w-[42rem] text-left">
        <h1 className="text-[#726F6B] font-blurlight font-medium text-xl sm:text-2xl md:text-3xl leading-snug mb-4 sm:mb-5 md:mb-6">
          A multi-faceted architecture and creative design firm founded in 2025
        </h1>
        <div className="text-[#726F6B] font-blurlight text-sm sm:text-base md:text-lg leading-snug space-y-2 sm:space-y-2.5 md:space-y-3 pl-4 sm:pl-6 md:pl-10">
            <p>
              The greatest moment in human history was not when man walked the Moon, but when <span className="text-[#D4A26C] font-medium">God</span> walked the Earth.
            </p>
            <p>
              Tell yourself that pain is a reminder that you live, discomfort is <span className="text-[#D4A26C] font-medium">growth</span>, and a privilege.
            </p>
            <p>
              If you have no <span className="text-[#D4A26C] font-medium">ideas</span>, there is no project. If you have many ideas, there is still no project.
            </p>
            <p>
              True <span className="text-[#D4A26C] font-medium">passion</span> glues together teamwork. Genuine connections are the oxygen that catalyze success.
            </p>
            <p>
              Silence is a <span className="text-[#D4A26C] font-medium">beautiful</span> thing.
            </p>
            <p>
              <span className="text-[#D4A26C] font-medium">Nature</span> is Mother, it will serve as a <span className="text-[#D4A26C] font-medium">sanctuary</span>, offering both mental clarity and a wellspring of inspiration.
            </p>
            <p>
              Let <span className="text-[#D4A26C] font-medium">gratitude</span> nourish your passions. <span className="text-[#D4A26C] font-medium">Live</span> the world, don&apos;t let it live you.
            </p>
            <p>
              Even if it&apos;s hard, be the <span className="text-[#D4A26C] font-medium">smile</span> that someone may need.
            </p>
          </div>
      </div>
    </main>
  );
}
