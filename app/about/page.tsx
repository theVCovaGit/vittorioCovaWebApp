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

      {/* 🧱 Content Zone (stacked on top of SVG) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12">
        {/* 🧬 Add your bio, images, icons, etc. here */}
      </section>
    </main>
  );
}
