"use client";

import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#5c4b4a] font-basica z-50 h-[10rem] sm:h-[11.25rem] md:h-[12.5rem]">
      {/* Logo Block */}
      <div className="absolute top-[4.375rem] sm:top-[5rem] md:top-[6.25rem] left-[2.5rem] sm:left-[3.75rem] md:left-[5rem] text-black leading-[2.5rem]">
        {/* VITTORIO */}
        <div className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-normal tracking-[-0.02em] md:tracking-[-0.0195rem]">
          VITTORIO
        </div>

        {/* COVA */}
        <div className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-normal tracking-[0.05em] md:tracking-[0.08775rem] ml-[4rem] sm:ml-[5rem] md:ml-[7.06rem]">
          COVA
        </div>
      </div>

      {/* Frame SVG – Hidden on mobile */}
      <div className="hidden md:block absolute top-[6.25rem] left-[26.25rem] w-[9rem] h-auto">
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
      <div className="hidden md:block absolute top-[6.25rem] left-[36.25rem] text-black text-[1rem] tracking-[0.002em] w-[13.06rem] h-[1.625rem] leading-none">
        FRAME THE VISION .
      </div>
    </header>
  );
}
