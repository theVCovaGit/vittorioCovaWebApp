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
  
  
export default function Contact() {
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
        
        <p className="text-lg mb-6 leading-relaxed font-electrolize">
          A multi-faceted creative firm founded by Vittorio Cova in 2025.
        </p>
        
        <ul className="space-y-1 text-lg font-electrolize">
          <li>- Architect</li>
          <li>- Film director</li>
          <li>- Designer</li>
          <li>- Artist</li>
        </ul>
      </div>

      {/* Contact information in the middle */}
      <div className="absolute top-[75%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-[#fef4dc] font-electrolize max-w-sm px-4 text-center">
        <h2 className="text-sm font-bold mb-2 text-[#fef4dc]">
          Get in <span className="text-[#fbe147]">touch:</span>
        </h2>
        <div className="space-y-1 text-sm leading-tight">
          <p>
            Email: <span className="text-[#fbe147] font-bold">hello@vittoriocova.com</span>
          </p>
          <p>
            Phone: <span className="text-[#fbe147] font-bold">+1 (555) 123-4567</span>
          </p>
          <p>
            Location: <span className="text-[#fbe147] font-bold">New York, NY</span>
          </p>
          <p>
            Available for <span className="text-[#fbe147] font-bold">collaborations</span> and <span className="text-[#fbe147] font-bold">commissions</span>
          </p>
          <p>
            Let's create something <span className="text-[#fbe147] font-bold">extraordinary</span> together
          </p>
        </div>
      </div>
    </main>
  );
}
