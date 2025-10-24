"use client";

import React from "react";

import AboutLabel from "@/components/aboutLabel";
import InteractiveFingie from "@/components/interactiveFingie";
// import AboutNameplate from "@/components/aboutNameplate";




const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[33.2vh]",
    right: "right-[2vw] sm:right-[3vw] md:right-[13.8vw]",
    scale: "scale-[0.5] sm:scale-[0.7] md:scale-[0.7]",
    fontSize: "text-[64px] sm:text-[84px] md:text-[117.9px]",
  };
  
  
export default function About() {
  return (
    <main className="relative min-h-screen bg-[#302120] text-[#fef4dc] font-basica overflow-hidden">
        

      <AboutLabel
        bottom={labelStyles.bottom}
        right={labelStyles.right}
        scale={labelStyles.scale}
        
        fontSize={labelStyles.fontSize}
        />

      {/* Interactive Fingie SVG - Right side, lower position */}
      <div className="absolute right-[4vw] top-[60%] transform -translate-y-1/2 z-[1002] max-h-[80vh] overflow-visible">
        <InteractiveFingie />
      </div>

      {/* Text content in upper left */}
      <div className="absolute top-[10rem] left-[4rem] text-[#fef4dc] font-microextend">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl">©</span>
          <span className="text-2xl font-bold">VITTORIO COVA STUDIO</span>
          <span className="text-xl ml-auto">Est. 2025</span>
        </div>
        
        <p className="text-lg mb-6 leading-relaxed">
          A multi-faceted creative firm founded by Vittorio Cova in 2025.
        </p>
        
        <ul className="space-y-1 text-lg">
          <li>- Architect</li>
          <li>- Film director</li>
          <li>- Designer</li>
          <li>- Artist</li>
        </ul>
      </div>
    </main>
  );
}
