"use client";

import React from "react";

export default function Architecture() {
  return (
    <section className="w-full min-h-screen bg-black font-basica text-[#FEF4DC] px-6 md:px-24 pt-[200px] pb-20 flex flex-col md:flex-row items-start gap-8 md:gap-14">
      {/* Text Block */}
      <div className="w-[259px] h-[222px] flex flex-col gap-2 text-[3.5vw] sm:text-[2.8vw] md:text-[13.5px] leading-none">
        <span
          className="tracking-[2.565px]"
          style={{ fontFamily: "Barrel" }}
        >
          120
        </span>
        <span className="tracking-[3.375px]">EARTHSHINE</span>
        <span>PANORAMA&nbsp;&nbsp;1</span>
        <span>BRICKBORNE</span>
        <span>FIBERWAY</span>
        <span>REPOWER PARK</span>
      </div>

      {/* Downward Dots */}
      <div className="hidden md:flex items-start justify-center h-[366px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4"
          height="366"
          viewBox="0 0 4 366"
          fill="none"
        >
          <g>
            {[...Array(50)].map((_, i) => (
              <circle key={i} cx="2" cy={i * 8} r="2" fill="#FEF4DC" />
            ))}
          </g>
        </svg>
      </div>

      {/* Dot Frame */}
      <div className="w-full max-w-[844px] h-auto shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 846 370"
          fill="none"
          className="w-full h-auto"
        >
          <path
            d="M844.999 368.63H1.07227V1.80209H844.999"
            stroke="#FEF4DC"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeDasharray="0.27 8"
          />
        </svg>
      </div>
    </section>
  );
}
