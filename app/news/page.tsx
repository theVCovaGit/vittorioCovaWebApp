"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import NewsLabel from "@/components/newsLabel";
import InteractiveFingie from "@/components/interactiveFingie";
import NewsMobile from "@/components/newsMobile";
import InteractiveMosaics from "@/components/interactiveMosaics";




const labelStyles = {
    bottom: "bottom-[8vh] sm:bottom-[10vh] md:bottom-[27vh]",
    right: "right-[8vw] sm:right-[12vw] md:right-[17.18vw]",
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
      <div className="absolute right-[4vw] top-[55%] transform -translate-y-1/2 z-[1002] max-h-[80vh] overflow-visible">
        <InteractiveMosaics />
      </div>

      {/* News Timeline - Centered on vertical axis */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[10000]">
        {/* This will be populated dynamically from database */}
        {/* Example structure for news items */}
        <div className="flex flex-col items-center space-y-10 max-w-lg px-4">
          {/* News Item 1 */}
          <div className="flex flex-col items-center space-y-1.5 text-left w-full">
            <div className="text-[#fdf053] font-electrolize text-xs font-bold">
              January 2026
            </div>
            <div className="text-[#fef4dc] font-microextend text-base font-bold">
              VISTA HERMOSA 120
            </div>
            <div className="text-[#b0a99d] font-microextend text-[10px] font-normal leading-relaxed">
              The project is set to break ground in January of 2026.
            </div>
          </div>

          {/* News Item 2 */}
          <div className="flex flex-col items-center space-y-1.5 text-left w-full">
            <div className="text-[#fdf053] font-electrolize text-xs font-bold">
              2025
            </div>
            <div className="text-[#fef4dc] font-microextend text-base font-bold">
              FOUNDED
            </div>
            <div className="text-[#b0a99d] font-microextend text-[10px] font-normal leading-relaxed">
              © Vittorio Cova Studio founded.
            </div>
          </div>

          {/* News Item 3 */}
          <div className="flex flex-col items-center space-y-1.5 text-left w-full">
            <div className="text-[#fdf053] font-electrolize text-xs font-bold">
              2024
            </div>
            <div className="text-[#fef4dc] font-microextend text-base font-bold">
              AIA FORT WORTH MERIT AWARD 2024
            </div>
            <div className="text-[#b0a99d] font-microextend text-[10px] font-normal leading-relaxed">
              Brickborne is awarded an AIA (American Institute of Architects) Merit Award in a Fort Worth student competition.
            </div>
          </div>

          {/* News Item 4 */}
          <div className="flex flex-col items-center space-y-1.5 text-left w-full">
            <div className="text-[#fdf053] font-electrolize text-xs font-bold">
              2023
            </div>
            <div className="text-[#fef4dc] font-microextend text-base font-bold">
              WINECHESTER AWARDS
            </div>
            <div className="text-[#b0a99d] font-microextend text-[10px] font-normal leading-relaxed">
              WINECHESTER (2022) a short film by Vittorio Cova wins numerous international awards including a San Diego Movie Award for best Thriller.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
