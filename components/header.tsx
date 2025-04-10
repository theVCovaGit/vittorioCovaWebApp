"use client";

import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-[160px] sm:h-[180px] md:h-[200px] bg-[#5c4b4a] font-basica z-50">
      {/* Logo Block */}
      <div className="absolute top-[70px] sm:top-[80px] md:top-[100px] left-[40px] sm:left-[60px] md:left-[80px] text-black leading-[2.5rem]">
        <div className="text-[2rem] sm:text-[2.5rem] md:text-[52px] font-normal tracking-[-0.02em] md:tracking-[-0.312px]">
          VITTORIO
        </div>
        <div className="text-[2rem] sm:text-[2.5rem] md:text-[52px] font-normal tracking-[0.05em] md:tracking-[1.404px] ml-[4rem] sm:ml-[5rem] md:ml-[113px]">
          COVA
        </div>
      </div>

      {/* Frame SVG – Hidden on mobile */}
      <div className="hidden md:block absolute top-[100px] left-[420px] w-[144px] h-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 144 75"
          fill="none"
          className="w-full h-auto"
        >
          <g clipPath="url(#clip0_18_57)">
            <path d="M25.7093 0.705688H0.694824V26.1103" stroke="#FFF3DF" strokeMiterlimit="10" />
            <path d="M0.694824 48.8897V74.2943H25.7093" stroke="#FFF3DF" strokeMiterlimit="10" />
            <path d="M118.277 74.2943H143.305V48.8897" stroke="#FFF3DF" strokeMiterlimit="10" />
            <path d="M143.305 26.1103V0.705688H118.277" stroke="#FFF3DF" strokeMiterlimit="10" />
          </g>
          <defs>
            <clipPath id="clip0_18_57">
              <rect width="144" height="75" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* "Frame the Vision" – Hidden on mobile */}
      <div className="hidden md:block absolute top-[100px] left-[580px] text-black text-[1rem] tracking-[0.002em] w-[209px] h-[26px] leading-none">
        FRAME THE VISION .
      </div>
    </header>
  );
}
