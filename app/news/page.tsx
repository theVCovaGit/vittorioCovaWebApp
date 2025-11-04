"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import NewsLabel from "@/components/newsLabel";
import InteractiveFingie from "@/components/interactiveFingie";
import NewsMobile from "@/components/newsMobile";




const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[40vh]",
    right: "right-[2vw] sm:right-[3vw] md:right-[6.9vw]",
    scale: "scale-[0.5] sm:scale-[0.7] md:scale-[0.7]",
    fontSize: "text-[64px] sm:text-[84px] md:text-[117.9px]",
  };
  
  
export default function News() {
  const isMobile = useIsMobile();

  // Mobile version
  if (isMobile) {
    return <NewsMobile />;
  }

  // Desktop version (original)
  return (
    <main className="relative min-h-screen bg-[#302120] text-[#fef4dc] font-basica overflow-hidden">
        

      <NewsLabel
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

      {/* Philosophical thoughts in the middle */}
      <div className="absolute top-[72%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-[#fef4dc] font-electrolize max-w-sm px-4 text-center z-[9999]">
        <h2 className="text-sm font-bold mb-2 text-[#fef4dc]">
          Quick thoughts I want to <span className="text-[#fbe147]">share:</span>
        </h2>
        <div className="space-y-1 text-sm leading-tight">
          <p>
            The greatest moment in human history was not when man walked the Moon, but when <span className="text-[#fbe147] font-bold">God</span> walked the Earth.
          </p>
          <p>
            Tell yourself that pain is a reminder that you live, discomfort is <span className="text-[#fbe147] font-bold">growth</span>, and a privilege.
          </p>
          <p>
            If you have no <span className="text-[#fbe147] font-bold">ideas</span>, there is no project. If you have many ideas, there is still no project.
          </p>
          <p>
            True <span className="text-[#fbe147] font-bold">passion</span> glues together teamwork. Genuine connections are the oxygen that catalyze success.
          </p>
          <p>
            Silence is a <span className="text-[#fbe147] font-bold">beautiful</span> thing.
          </p>
          <p>
            <span className="text-[#fbe147] font-bold">Nature</span> is Mother, it will serve as a <span className="text-[#fbe147] font-bold">sanctuary</span>, offering both mental clarity and a wellspring of inspiration.
          </p>
          <p>
            Let <span className="text-[#fbe147] font-bold">gratitude</span> nourish your passions. <span className="text-[#fbe147] font-bold">Live</span> the world, don&apos;t let it live you.
          </p>
          <p>
            Even if it&apos;s hard, be the <span className="text-[#fbe147] font-bold">smile</span> that someone may need.
          </p>
        </div>
      </div>
    </main>
  );
}
