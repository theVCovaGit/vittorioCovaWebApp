"use client";

import React from "react";
import AboutFrame from "@/components/aboutFrame";
import AboutLabel from "@/components/aboutLabel";
import AboutNameplate from "@/components/aboutNameplate";


const frameStyles = {
  top: "mt-[11rem] md:mt-[11.5rem]",
  bottom: "mb-[6rem]",
  left: "left-[5vw] sm:left-[6vw] xl:left-[6vw]",
};

const nameplateStyles = {
    top: "top-[4.2%] sm:top-[4.5%] md:top-[5%]",
    right: "right-[7.5%] sm:right-[8%] md:right-[1%]",
    fontSize: "text-[18px] sm:text-[21px] md:text-[23px]",
  };  

const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[20.4vh]",
    right: "right-[2vw] sm:right-[3vw] md:right-[20vw]",
    scale: "scale-[0.5] sm:scale-[0.7] md:scale-[.85]",
    fontSize: "text-[64px] sm:text-[84px] md:text-[117.9px]",
  };
  
  
export default function About() {
  return (
    <main className="relative min-h-screen bg-[#5c4b4a] text-[#fef4dc] font-basica overflow-hidden">
        
      {/* 🔳 Frame container - responsive, graceful fallback on small screens */}
      <div
        className={`
          absolute
          top-0
          ${frameStyles.top}
          ${frameStyles.bottom}
          ${frameStyles.left}
          w-[min(90vw,52vw)]     // ✅ full responsiveness
          max-w-[1200px]         // ✅ caps on large screens
          min-w-[320px]          // ✅ avoid being crushed on tiny screens
          aspect-[781/588]       // ✅ keeps SVG looking crisp
          transform
          origin-top-left
          z-[1000]
        `}
      >
        <AboutFrame />
        <AboutNameplate
        top={nameplateStyles.top}
        right={nameplateStyles.right}
        fontSize={nameplateStyles.fontSize}
        /> 
      </div>
      <AboutLabel
        bottom={labelStyles.bottom}
        right={labelStyles.right}
        scale={labelStyles.scale}
        
        fontSize={labelStyles.fontSize}
        />



      {/* 🧱 Content Zone (stacked on top of SVG) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12">
        {/* 🧬 Add your bio, images, icons, etc. here */}
      </section>
    </main>
  );
}
