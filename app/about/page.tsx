"use client";

import React from "react";
import AboutFrame from "@/components/aboutFrame";
import AboutLabel from "@/components/aboutLabel";
import InteractiveFingie from "@/components/interactiveFingie";
// import AboutNameplate from "@/components/aboutNameplate";


const frameStyles = {
  top: "mt-[11rem] md:mt-[11.77rem]",
  bottom: "mb-[6rem]",
  left: "left-[5vw] sm:left-[6vw] xl:left-[6vw]",
  scale: "scale-[0.85] sm:scale-[0.95] md:scale-[0.85]"
};

const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[20.4vh]",
    right: "right-[2vw] sm:right-[3vw] md:right-[20vw]",
    scale: "scale-[0.5] sm:scale-[0.7] md:scale-[.85]",
    fontSize: "text-[64px] sm:text-[84px] md:text-[117.9px]",
  };
  
  
export default function About() {
  return (
    <main className="relative min-h-screen bg-[#302120] text-[#fef4dc] font-basica overflow-hidden">
        
        <div
          className={`
            absolute
            top-0
            ${frameStyles.top}
            ${frameStyles.bottom}
            ${frameStyles.left}
            ${frameStyles.scale}
            w-[min(90vw,52vw)]
            max-w-[1200px]
            min-w-[320px]
            aspect-[781/588]
            transform
            origin-top-left
            z-[1000]
          `}
        >
          <AboutFrame />
        </div>

      <AboutLabel
        bottom={labelStyles.bottom}
        right={labelStyles.right}
        scale={labelStyles.scale}
        
        fontSize={labelStyles.fontSize}
        />

      {/* Interactive Fingie SVG - Right side, vertical middle */}
      <div className="absolute right-[2vw] top-1/2 transform -translate-y-1/2 z-[1002] max-h-[80vh] overflow-visible">
        <InteractiveFingie />
      </div>

      {/* 🧱 Content Zone (stacked on top of SVG) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12">
        {/* 🧬 Add your bio, images, icons, etc. here */}
      </section>
    </main>
  );
}
